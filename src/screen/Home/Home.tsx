import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Linking,
  AppState
} from 'react-native';
import  ImageCompressor  from 'react-native-compressor';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import { normalize, scaleHeight } from '../../styles/utilities/dimentions';
import Menu from '../../routes/Menu';
import DeviceInfo,{isTablet} from 'react-native-device-info';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getAllSponsors,getUserGroups,createPost,updateToken, getUserUnreadCount, getPostNotificationsByMemberId, readPostNotificationBymemberId } from '../../services/api/auth';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import { checkPermissions, permissionAlert, sliceString } from '../../styles/utilities/variables';
import MembersContext from '../Members/MembersContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from "react-native-vector-icons/Entypo";
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import ModalNative from "react-native-modal";
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { getLoggedInUserUnreadCount } from '../../services/CometUtils';
interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  const navigate = useNavigation();
  const isScreenFocused = useIsFocused();
  const {setHideChatbot,setAccessToken,loggedInUser,setMsgUnreadCountUpdate,msgUnreadCountUpdate,msgUnreadCount,setMsgUnreadCount,setSelectedMenu,loggedInUserUpdate,notUpdate,setPostsCount,postsCount} = useContext(MembersContext);
  const [index, setIndex] = useState(1);
  const [sponsorsLoader,setSponsorsLoader] = useState(true)
  const [accessTokenHome, setAccessTokenHome] = useState('');
  const [sponsorsData, setSponsorsData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [description,setDescription] = useState("");
  const [descriptionErr,setDescriptionErr] = useState("")
  const [selectedGrpError,setSelectedGrpError] = useState("")
  const [updateSuccess,setUpdateSuccess] = useState(false)
  const [isLodering, setIsLodering] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [blobImage, setBlobImage] = useState([]);
  const [isImageLodering, setIsImageLodering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropDownMoal, setDropDownMoal] = useState(false);
  const [dropDownMoalSearch, setDropDownMoalSearch] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);
  const [appFocused, setAppFocused] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleInputFocus = () => {
    setIsFocused(true);
    setDescriptionErr('')
  };
 
  const selectImage = async () => {
    const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      } 
    setIsImageLodering(true);
    try {
      const images = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        cropping: false,
        cropperActiveWidgetColor: "#FFFFFF",
      });
  
      const blobsUris = []
      const uploadPromises = images.map(async (image) => {
        const result = await ImageCompressor.Image.compress(image.path, {
          quality: 0.8,
        });
        const fileContent = await fetch(result);
        const blob = await fileContent.blob();
        const reader = new FileReader();
        
        const blobUriPromise = new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
        
        const blobUri = await blobUriPromise;
        blobsUris.push(blobUri);
  
        const fileName = result.split('/').pop();

        setBlobImage(blobsUris);
        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
          Body: blob,
        };      
  
        return new Promise((resolve, reject) => {
          s3.upload(params, (err, data) => {
            if (err) {
              console.error("Error uploading image:", err);
              reject(err);
            } else {
              resolve(`${Config.DIRECTORY_URL}/${data.key}`);
            }
          });
        }).then(async (url) => {
          return { url, blobUri };
        });
      });
  
      const results = await Promise.all(uploadPromises);
      const imageUrls = results.map(result => result.url);
      setSelectedImage(imageUrls);
      setIsImageLodering(false);
  
    } catch (error) {
      console.error("Error selecting or uploading images:", error);
      setIsImageLodering(false);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const postNotifications = async() => {
        try {
          const response = await getPostNotificationsByMemberId(loggedInUser?.id,accessTokenHome);
          if(response.status === 200){
              setPostsCount(response.data)
      }
      } catch (error) {
          console.error(error); 
      }
  }
  postNotifications()
    },[loggedInUserUpdate,loggedInUser,notUpdate])
  )

  const postHandler = async() => {
     try {
       const response = await readPostNotificationBymemberId(loggedInUser?.id,accessTokenHome);
       if(response.status === 200){
        setPostsCount("")        
      }
    } catch (error) {
      console.error(error)
    }
    navigate.navigate('Posts',{resetPost:true})
   } 

  useFocusEffect(React.useCallback(() => {
    const getGroupsData = async() => {
    setSelectedImage([])
    setBlobImage([])
    setIsFocused(false)
      try {
        const response = await getUserGroups(accessTokenHome);
        if(response.status === 200){
          const sortedArray = response.data.sort((a, b) => {
            if (a.groupName === "Public") return -1;
            if (b.groupName === "Public") return 1;
            return 0;
          }); 
          setGroupsData(sortedArray);
          setSelectedItems([sortedArray[0].id])
        }
      } catch (error) {
        console.error('error',error)
      }
    }
   
    getGroupsData()
  },[]))

    useEffect(() => {
      const deleteAndRefreshToken = async () => {
        try {
          await messaging().deleteToken();
          const newToken = await messaging().getToken();
          CometChat.registerTokenForPushNotification(newToken);
          // if (newToken) {
          //   try {
          //     const response = await updateToken(loggedInUser?.id,accessTokenHome,newToken,DeviceInfo.getBrand(),Platform.OS)
          //   } catch (error) {
          //     console.error(error) 
          //   }
          // } else {
          //   console.log('No new FCM token available');
          // }
        } catch (error) {
          console.log('Error deleting or getting FCM token:', error);
        }
      };
      deleteAndRefreshToken();
    }, [loggedInUser])
  
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const getaccessTokenData = await AsyncStorage.getItem('accessToken');
        if (getaccessTokenData !== null) {
          setAccessTokenHome(getaccessTokenData)
          setAccessToken(getaccessTokenData)
        } else {
          console.log('Access Token not found');
          return null;
        }
      } catch (error) {
        console.error('Error retrieving Access Token:', error);
        return null;
      }
    };
    getAccessToken()
  }, [])

  useFocusEffect(React.useCallback(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setAppFocused(true)
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]));
  let filterUnread =0
  useFocusEffect(
    React.useCallback(() => {
      setSelectedMenu(0)
      const getUnreadChat = async () => {
        try {
          const response = await getUserUnreadCount(accessTokenHome);
          if (response.status === 200) {
            setMsgUnreadCount(response.data)
            setMsgUnreadCountUpdate(false)
            setAppFocused(false) 
          }
        } catch (error) {}
      };
      // getUnreadChat();
      getLoggedInUserUnreadCount(setMsgUnreadCount,setMsgUnreadCountUpdate,setAppFocused)
    }, [msgUnreadCountUpdate,isScreenFocused,appFocused])
  );
  useFocusEffect(
    React.useCallback(() => {
      setMsgUnreadCountUpdate(false)
      setMsgUnreadCountUpdate(true)
      getSponsors();
      setHideChatbot(false);
      setDescriptionErr("")
      setDescription('')
    
    }, [updateSuccess,isFocused])
  );
  
  const getSponsors = async() => {
    try {
      setSponsorsLoader(true)
      const response = await getAllSponsors(accessTokenHome);
      if(response.status === 200){
        const customSort = (a, b) => {
          if (a.sponsorsType === 'PLATINUM') return -1;
          if (b.sponsorsType === 'PLATINUM') return 1;
          if (a.sponsorsType === 'GOLD') return -1;
          if (b.sponsorsType === 'GOLD') return 1;
          if (a.sponsorsType === 'SILVER') return -1;
          if (b.sponsorsType === 'SILVER') return 1;
          if (a.sponsorsType === 'BRONZE') return -1;
          if (b.sponsorsType === 'BRONZE') return 1;
          if (a.sponsorsType === 'MARINA') return -1;
          if (b.sponsorsType === 'MARINA') return 1;
          return 0;
        };
          const sortedData = response.data.sort(customSort); 
         setSponsorsData(sortedData);
         setSponsorsLoader(false)
      }
    } catch (error) {
      console.error(error);
      setSponsorsLoader(false)
    }
  }
    
  const createPostHandler = async () => {
    setSelectedGrpError('')
    setDescriptionErr('')
    let payload = {};
    let isValid = true;
  
    // Check if description is empty
    if (description === "") {
      setDescriptionErr('Please write something')
      isValid = false;
    }
    if (selectedItems.length === 0) {
      setSelectedGrpError('Please select group')
      isValid = false;
    }
    if (selectedImage.length > 5) {
      setDescriptionErr('You can only select up to 5 images');
      isValid = false;
  }
      payload = {
        publicGroup: false,
        groupId: selectedItems,
        attachments: selectedImage.map(url => ({
          uploadUrl: url
      })),
        content: description
      };
    if(isValid){
    try {
      setIsLodering(true);
      setUpdateSuccess(false);
        const response = await createPost(payload, accessTokenHome);
        if (response.status === 200) {
          setDescription("");
          setSelectedItems([groupsData[0].id]);
          setSelectedGrpError('')
          setDescriptionErr('')
          setIsFocused(false)
          setSelectedImage([]);
          setBlobImage([]);
          setUpdateSuccess(true);
          setIsLodering(false);
        }
      } catch (error) {
        setIsLodering(false);
        console.error(error);
    }
  }
  };


  useEffect(() => {
    const setBadgeCount = async () => {
        if(Platform.OS === 'ios'){
            if (msgUnreadCount > 0 ) {
                PushNotificationIOS.setApplicationIconBadgeNumber(msgUnreadCount);
            }else{
                PushNotificationIOS.setApplicationIconBadgeNumber(0);

            }
        }else if (Platform.OS === 'android') {
          const deviceManufacturer = DeviceInfo.getBrand();          
          if(msgUnreadCount > 0 ){
              if (deviceManufacturer.toLowerCase() !== 'samsung') {
                PushNotification.setApplicationIconBadgeNumber(msgUnreadCount);
              }
                
            }else{
              if (deviceManufacturer.toLowerCase() !== 'samsung') {
                PushNotification.setApplicationIconBadgeNumber(0);
            }
          }
        }
     
    };
    setBadgeCount();
}, [msgUnreadCount]);

  useEffect(() => {
    const backAction = () => {
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
 

const handleSelectGroup = (item) => {
  const publicId = groupsData[0].id
  if (item.groupName === 'Public') {
    setSelectedItems([publicId]);
  } else {
    const isChecked = selectedItems.some((m) => m === item.id);
    if(isChecked){
      setSelectedItems((prevMentors) =>
        prevMentors.filter((m) => m !== item.id && m !== publicId)
      );
    }else{
      setSelectedItems((prev) => {
        const hasPublic = prev.includes(publicId);
        const updatedItems = hasPublic
          ? prev.filter((selectedItem) => selectedItem !== publicId)
          : prev;
        return [...updatedItems, item.id];
      });
    }
   
  }
};


const renderCarouselItem = ({item, index}:any) => {
  return (
      <View style={[styles.shadowBox,style.pH10,styles.sliderContainer]} key={index}>
        <TouchableOpacity onPress={() => {
                if (item?.sponsorUrl) {
                  Linking.openURL(item?.sponsorUrl);
                }}}>
          {item.sponsorsMediaUrl ? <Image resizeMode='contain' style={styles.sliderImage} source={{uri:item.sponsorsMediaUrl}}></Image> :
          <Image resizeMode='contain' style={styles.sliderImage} source={require('../../assets/dataImage/news_placeholder.png')}></Image>}
         </TouchableOpacity>                
      </View>
  );
} 

  const SponsorData = ()=>{
    return <View>
          <SwiperFlatList
      autoplay
      autoplayDelay={2}
      autoplayLoop
      index={1}
      data={sponsorsData}
      renderItem={renderCarouselItem}
    />
 
        </View>
  }

  return (
   
    <View style={[style.contant]}>
      <FastImage style={[styles.imageBackgroundStyle]} resizeMode={FastImage.resizeMode.cover} source={{uri:'https://dev-admin.qennect.com/media/3befeb4f-d3bd-463a-961e-36f2e2d0177b/1719830586505.jpg',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}}>
    
      <View style={[style.contant ]}>
            <View style={[style.contant]}>
                <View style={[style.sidepanelcolor]}> 
               <Menu  selectIndex={0}></Menu>
                </View>
                <ScrollView scrollToOverflowEnabled={false} style={[style.contant,style.mt10]}>
                  <View style={[styles.shadowBox,style.mt15,style.mH20]}>
                    <View style={[style.row,style.mH15,style.mtb10]}>
                     
                    {!isFocused ?  ( <View>
                    {loggedInUser && loggedInUser?.profileUrl ? (
                 <Image
                  source={{ uri: loggedInUser?.profileUrl }}
                  style={styles.profileImg}
                />
                ) : (
                 <Image
                  style={styles.profileImg}
                  source={require("../../assets/avatarImage.png")}
                  alt="img"
                  />
                )}
                </View> ) : ""}
                <View style={[style.mH5]}>
                {!isFocused ?  (
                <TouchableOpacity style={style.contant} onPress={handleInputFocus}>
                <TextInput
                style={[styles.inputStyleisFocused]}
                placeholder={"Write your Post"}
                placeholderTextColor={COLORS.GREY}
                value={description}
               onPressIn={handleInputFocus}
                autoCorrect={false}
                underlineColor='transparent'
                cursorColor={COLORS.GREY}
                activeUnderlineColor='transparent'
                multiline={true}
              />
              </TouchableOpacity>
               ) :
               (
                <View>
                  <TouchableOpacity  style={[style.alignSelfEnd,styles.closeTextbox]}>
                    <AntDesign onPress={() =>{setIsFocused(false);setDescription("")}} name='closecircle' size={26} color={COLORS.LIGHT_PRIMARY}/>
                  </TouchableOpacity>
                <TextInput
                style={[styles.inputStyleFocused]}
                placeholder={"Write your Post"}
                placeholderTextColor={COLORS.GREY}
                value={description}
                textAlign='left'
                onChangeText={(txt) => {setDescription(txt);setDescriptionErr('')}}
                autoCorrect={false}
                underlineColor='transparent'
                contentStyle={{textDecorationLine:"none"}}
                cursorColor={COLORS.BLACK}
                activeUnderlineColor ='transparent'
                multiline={true}
                caretHidden={false}
                numberOfLines={7}
                autoFocus={true}
                selectionColor={COLORS.PRIMARY}
              />
              </View>)
                }
                {descriptionErr && <Text style={[style.textDanger,style.mH10]}>{descriptionErr}</Text>}
              </View>
                </View>
                {blobImage.length > 0 && blobImage.map((item, index) => (
                  <View key={index} style={[style.centerItem, style.row, style.mB10]}>
                  <Image 
                    source={{ uri: item }} 
                    resizeMode='contain' 
                    style={styles.pickedImage} 
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)} 
                  />
                  {isImageLodering && (
                    <ActivityIndicator size="small" color={COLORS.LIGHT_PRIMARY} style={styles.loader} />
                  )}
                  <TouchableOpacity 
                    onPress={() => {
                      const updatedSelectedImages = [...selectedImage];
                      const updatedBlobImages = [...blobImage];
                      updatedSelectedImages.splice(index, 1);
                      updatedBlobImages.splice(index, 1);
                      setSelectedImage(updatedSelectedImages);
                      setBlobImage(updatedBlobImages);
                    }} 
                    style={styles.closeImageIcon}
                  >
                    <AntDesign name='closecircle' size={26} color={COLORS.LIGHT_PRIMARY} />
                  </TouchableOpacity>
                </View>
              ))}
               

                <View style={[style.contentBetween,style.mH15,style.mB10]}>
                <View style={[style.row]}>
                <TouchableOpacity onPress={selectImage}>
                <Image style={[styles.uploadImage,style.centerItem,style.mt5]} source={require("../../assets/uploadImage.png")} alt=''/>
                </TouchableOpacity>
                </View>       
                <View style={[style.contant,style.mH10]}>
                  <TouchableOpacity style={[styles.postDropdown]} onPress={()=>{setDropDownMoal(true);setSelectedGrpError('');setDropDownMoalSearch("")}}>
                    <Text style={[style.font16]}>{selectedItems.length > 1 ? `Selected(${selectedItems.length})` : (selectedItems.length > 0 ? sliceString(groupsData.find(item => item.id ===selectedItems[0])?.groupName,15):'Select' ) }</Text>
                    <Entypo name='chevron-thin-down'size={normalize(15)} color={COLORS.BLACK}/>
                  </TouchableOpacity>
               {selectedGrpError && <Text style={[style.textDanger]}>{selectedGrpError}</Text>}
                </View>
                <TouchableOpacity disabled={isImageLodering || isLodering} style={[style.centerBox,style.primaryLayout,styles.postbtn]} onPress={createPostHandler}>
                {isLodering ?
                <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                  :
                <Text style={[style.whiteText,style.centerItem]}>Post</Text>
                }
                </TouchableOpacity>     
                </View>
                </View>
                <View style={[style.contant,style.p5,style.mH15,style.mtb10]}>
                  <View style={[style.contentBetween,style.mt20]}>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={postHandler}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter]}>Posts</Text>
                      <View style={[style.row]}>
                      <FastImage style={[style.centerBox,styles.postIcon]}  source={{uri:'https://admin.qennect.com/media/postIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                      {postsCount && postsCount > 0 ?
                        <View style={[style.mB15,styles.notificationCount,style.centerItem,style.centerBox]}>
                        <Text style={[style.textCenter,{color:COLORS.WHITE}]}>{postsCount}</Text>          
                        </View>
                        : null}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={() => navigate.navigate("WebChat",{type:'user'})}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter,style.mb5,style.mH10]}>Messages</Text>
                      <View style={[style.row]}>
                      <FastImage style={[style.centerBox,styles.menuIcons]} source={{uri:'https://admin.qennect.com/media/chatRoomIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                      {msgUnreadCount && msgUnreadCount > 0 ?
                        <View style={[style.mB15,styles.notificationCount,style.centerItem,style.centerBox]}>
                        <Text style={[style.textCenter,{color:COLORS.WHITE}]}>{msgUnreadCount}</Text>          
                        </View>
                        : null}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('MemberMap',{tabIndex:'Map'})}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.mb5,style.mt2,style.textCenter]}>Member Map</Text>
                      <FastImage style={[style.centerBox,styles.menuIcons]}  source={{uri:'https://admin.qennect.com/media/MemberMapIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}}  resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                  </View>
                  <View style={[style.contentBetween,style.mt30]}>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('Education')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.mt7,style.textCenter]}>Education</Text>
                      <FastImage style={[style.centerBox,styles.menuEducationIcon]} source={{uri:'https://admin.qennect.com/media/EducationIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('RalliesEvents')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter,style.mb5]}>Events</Text>
                      <FastImage style={[style.centerBox,styles.eventIcon]} source={{uri:'https://admin.qennect.com/media/events&redenzvousIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('Rallies')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.mt7,style.textCenter]}>Rallies</Text>
                      <FastImage style={[style.centerBox,styles.menuEducationIcon]}  source={{uri:'https://admin.qennect.com/media/RalliesIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}}  resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                  </View>
                  <View style={[style.contentBetween,style.mt30]}>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('ShipStore')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter,style.mb5]}>Store</Text>
                      <FastImage style={[style.centerBox,styles.homeScreenIcon]}  source={{uri:'https://admin.qennect.com/media/storeIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('Members')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter]}>Members</Text>
                      <FastImage style={[style.centerBox,style.mt5,styles.homeScreenIcon]}  source={{uri:'https://admin.qennect.com/media/ourMembersIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}} resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.offWhiteLayout, styles.eventsIcon, style.centerBox,style.centerItem]} onPress={()=>navigate.navigate('Volunteer')}>
                      <Text style={[style.font16,style.boldTxt,style.centerBox,style.textCenter,style.mb5]}>Volunteer</Text>
                      <FastImage style={[style.centerBox,styles.homeScreenIcon]}  source={{uri:'https://admin.qennect.com/media/volunteerHomeIcon.png',priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable,}}  resizeMode={FastImage.resizeMode.contain}/>
                    </TouchableOpacity>
                  </View>
                </View>
                 <View style={[style.mt20]}>
                  <SponsorData></SponsorData>
                  </View>
                 </ScrollView>
               
          </View>
      </View>
      </FastImage>
      <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            onBackdropPress={() => setDropDownMoal(false)}
            isVisible={dropDownMoal}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.whiteLayout,style.borderRadius8]}>
               <View style={[style.row,style.centerBox,style.mtb10]}>
                <View style={[{flex:0.2,}]}>
                <AntDesign name='search1' size={20} color={COLORS.GREY} style={[style.textCenter]}/>
                </View>
               <TextInput
                style={[styles.dropDownInput,{flexGrow:1}]}
                placeholder={"Search"}
                placeholderTextColor={COLORS.GREY}
                value={dropDownMoalSearch}
                textAlign='left'
                onChangeText={(txt) => {setDropDownMoalSearch(txt)}}
                autoCorrect={false}
                underlineColor='transparent'
                contentStyle={{textDecorationLine:"none"}}
                cursorColor={COLORS.BLACK}
                activeUnderlineColor ='transparent'
                caretHidden={false}
                selectionColor={COLORS.PRIMARY}
              />
               </View>
                <ScrollView style={[{height:normalize(150)},style.pH20]} persistentScrollbar={true}>
                  {groupsData && groupsData.filter((item)=> item.groupName && item?.groupName.toLowerCase().includes(dropDownMoalSearch.toLocaleLowerCase())).length > 0 ?groupsData.filter((item)=>item.groupName && item?.groupName.toLowerCase().includes(dropDownMoalSearch.toLocaleLowerCase())).map((item) => ( 
                    <TouchableOpacity style={[{marginVertical:normalize(7)},style.row,style.centerBox,style.between]} key={item.id} onPress={()=>handleSelectGroup(item)}>
                      <Text style={[style.font16,style.boldTxt]}>{item.groupName && item.groupName}</Text>
                      {selectedItems.includes(item.id) && <AntDesign name='check' size={20} color={COLORS.BLACK}/>}
                    </TouchableOpacity>
                  )): <View>
                    <Text style={[style.textCenter,style.mt20]}>Sorry, no results</Text>
                    </View>}
                </ScrollView>
                <View style={[style.row,style.centerBox]}>
                <TouchableOpacity onPress={() => {setDropDownMoal(false);setDropDownMoalSearch("")}} style={[{flex:0.1,backgroundColor:COLORS.LIGHT_BLACK,padding:normalize(11),borderBottomStartRadius:10,height:normalize(35)}]}>
                    <AntDesign name='closecircle' size={18} color={COLORS.WHITE} style={[style.textCenter]}/>
                  </TouchableOpacity>
                <TouchableOpacity style={[{flexGrow:1,backgroundColor:COLORS.PRIMARY,padding:normalize(10),borderBottomEndRadius:10,height:normalize(35)}]} onPress={() => {setDropDownMoal(false)}}>
                 <Text style={[style.whiteText,style.textCenter,style.boldTxt,{fontSize:18}]}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
          </ModalNative>
    </View>

  );
};
const styles = StyleSheet.create({
  postDropdown:{
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
    width: '100%',
    height: normalize(34),
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  desStyle:{
    lineHeight:normalize(15), 
    fontSize:normalize(12), 
    color:COLORS.BLACK
  },
  mL15:{
    marginLeft:-15
  },
  iconBox:{
    borderColor:COLORS.LIGHT_PRIMARY,
    borderWidth:1,
    borderRadius:3,
    alignContent:'center',
    alignItems:'center',
    justifyContent:'center',
    width:20,
    height:20
  },
  sidepanelcolor:{
 //   width: "100%",
    //position:'absolute',
   // zIndex:9999
 },
 birthdayMessage:{
  width:200,
  height:"100%",
  borderRadius:8,
  borderWidth:1,
  borderColor:COLORS.PRIMARY,
  marginLeft:10
 },
 iconLogo:{
  height:scaleHeight(30),
  resizeMode:'contain',
  width:scaleHeight(35),
},
font14: {
  fontSize: 14,
},
headerIcon:{
  width:normalize(90),
  height:normalize(60),
  borderRadius:12
},
eventsIcon:{
  width:Dimensions.get("screen").width *0.28,
  height:isTablet() ? Dimensions.get("screen").height*0.1 : normalize(75),
  borderRadius:12
},
SectionBox:{
  paddingVertical:scaleHeight(10),
},
profileImg: {
  width: normalize(45),
  height: normalize(45),
  borderRadius:50 
},
senderImg: {
  width: normalize(45),
  height: normalize(45),
  borderRadius:8 
},
inputStyle: {
  fontSize:normalize(14),
  height:normalize(35),
  fontFamily:'Roboto-Regular',
  width:normalize(220),
  color:COLORS.BLACK,
  textDecorationLine:"none",
  borderWidth:0.1,
  borderRadius:30,
  borderTopRightRadius:30,
  borderTopLeftRadius:30,
  borderColor:'#EDEDED',
},
inputStyleFocused: {
  fontSize:normalize(14),
  fontFamily:'Roboto-Regular',
  width:isTablet() ? Dimensions.get("screen").width*0.89 :normalize(260),
  color:COLORS.BLACK,
  backgroundColor:"#EDEDED",
  textDecorationLine:"none",
  textDecorationColor:"transparent", 
  borderRadius:30,
  borderTopRightRadius:30,
  borderTopLeftRadius:30,
  borderColor:'#EDEDED',
  overflow:'hidden',
  borderWidth:0
},
inputStyleisFocused: {
  fontSize:normalize(14),
  fontFamily:'Roboto-Regular',
  width:isTablet() ? Dimensions.get("screen").width*0.83 :normalize(220),
  color:COLORS.BLACK,
  height: normalize(45),
  backgroundColor:"#EDEDED",
  textDecorationLine:"none",
  textDecorationColor:"transparent", 
  borderRadius:30,
  borderTopRightRadius:30,
  borderTopLeftRadius:30,
  borderColor:'#EDEDED',
  overflow:'hidden',
  borderWidth:0
},
dropDownInput: {
  fontSize:normalize(14),
  fontFamily:'Roboto-Regular',
  color:COLORS.BLACK,
  borderColor:'#EDEDED',
  height:normalize(30),
  borderRadius:0,
  backgroundColor:"transparent"
},
inputContainer:{
  flex:1,
  borderWidth:0.1,
  paddingHorizontal:15,
  borderRadius:30,
  borderColor:'#EDEDED',
  backgroundColor:'#EDEDED',
  alignItems:'center',
  flexDirection:'row',
  height:normalize(45),
},
inputComments:{
  paddingHorizontal:9,
  borderRadius:30,
  paddingLeft:-10,
  backgroundColor:'#EDEDED',
  alignItems:'center',
  flexDirection:'row',
  height:normalize(35),
  marginTop:normalize(10)
},
uploadImage:{
  width:normalize(25),
  height:normalize(25),
  resizeMode:"contain"
},
gifImage:{
  width:normalize(25),
  height:normalize(20),
  resizeMode:"contain"
},
postbtn:{
  width:normalize(70),
  height:normalize(33),
  borderColor:COLORS.LIGHT_PRIMARY,
  borderWidth:1,
  borderRadius:8,
  color:COLORS.WHITE,
  justifyContent:"center",
  alignContent:'center',
  alignItems:'center',
},
postImg:{
  width:"100%",
  marginTop:normalize(5),
  height:normalize(280),
  resizeMode:"cover",
  justifyContent:"center",
  backgroundColor:"#fff",
  borderRadius:8
},
pickedImage :{
  width:normalize(100),
  height:normalize(120),
  resizeMode:"contain",
  justifyContent:"center",
  alignItems:"center",
  alignContent:"center",
  borderRadius:8,
},
shadowBox:{
  borderRadius:10,
  backgroundColor:"#FAFAFA",
    shadowOffset: {
      width: -2,
      height: 2,
    },
    opacity:0.8
 },
 postBox:{
  borderRadius:10,
  paddingTop:normalize(8),
  paddingBottom:5,
  backgroundColor:COLORS.WHITE,
  borderColor:COLORS.WHITE,
 },
 postsContainer:{
  borderRadius:10,
  paddingTop:3,
  paddingBottom:5,
  backgroundColor:COLORS.WHITE,
  borderColor:COLORS.WHITE,
 },
  borderStyle: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(6),
    paddingHorizontal: normalize(5),
    marginBottom: normalize(5),
    width: '100%',
    color:COLORS.BLACK,
    height: normalize(35),
  },
  iconSize:{
    width:normalize(20),
    height:normalize(20)
  },
  textSize:{
    fontWeight:'600',
    fontFamily:"Metropolis",
    lineHeight:20
},
fontFamily:{
  fontFamily:"Metropolis"
},
postContainer:{
  borderRadius:8
},
bgColor:{
  backgroundColor:"#DDDDDD"
},
commentsenderImg:{
  width:normalize(30),
  height:normalize(30),
  borderRadius:30
},
closeTextbox:{
  position:"absolute",
  zIndex:999
},
closeImageIcon:{
  marginBottom:140,
  marginLeft:-15
},
sliderImage:{
  height: Dimensions.get("screen").height * 0.1,
  width: Dimensions.get("screen").width - 40,
  objectFit:'contain',
  justifyContent:"center"
},
sliderContainer:{
height:Dimensions.get('screen').height * 0.12,
flexDirection:"column",
justifyContent:"space-around",
marginHorizontal:10,
width: Dimensions.get("screen").width - 20,
},
notificationCount:{
  backgroundColor:COLORS.YELLOW,
  color:COLORS.WHITE,
  borderRadius:50,
  paddingVertical:normalize(1),
  paddingHorizontal:normalize(5),
  fontWeight:"bold",
  fontSize:normalize(12),
  display:"flex",
  marginBottom:24,
  alignItems:"center",
  justifyContent:"center"
},
menuIcons:{
  width:normalize(30),
  height:normalize(30)
},
menuEducationIcon:{
  width:normalize(40),
  height:normalize(40)
},
imageBackgroundStyle :{
  width:'100%',
  flex:1,
  height:'100%'
},
postIcon:{
  width:normalize(35),
  height:normalize(35)
},
homeScreenIcon:{
  width:normalize(35),
  height:normalize(30)
},
eventIcon:{
  width:normalize(25),
  height:normalize(30)

},
loader: {
  position: 'absolute',
  zIndex:1,
  marginTop:normalize(50)
},
})
export default HomePage;