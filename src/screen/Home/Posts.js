import React, { useState,useContext,useEffect, useRef, useCallback } from "react";
import DeviceInfo, { isTablet } from 'react-native-device-info';
import  ImageCompressor  from 'react-native-compressor';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Text, TextInput,Dimensions,KeyboardAvoidingView,Platform,Modal,FlatList, Keyboard, Alert,TouchableHighlight, TouchableWithoutFeedback,PermissionsAndroid, Linking} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import Menus from "../../routes/Menu";
import style from "../../styles/style";
import { getAllPost, getUserGroups,getPostById,createPost,getPrivatePostById, likePostById, deletePost  } from "../../services/api/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import { normalize } from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from '@react-navigation/native';
import FilterComponent from "../../components/FilterComponent";
import Icons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MembersContext from "../Members/MembersContext";
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import ModalNative from "react-native-modal";
import { checkPermissions, permissionAlert, sliceString } from "../../styles/utilities/variables";
import FastImage from 'react-native-fast-image';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SwiperFlatList from 'react-native-swiper-flatlist';
import Likes from "./Likes";
import MaterialIconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from "react-native-image-zoom-viewer";
import RNFS from 'react-native-fs';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Icon from 'react-native-vector-icons/Feather';
import moment from "moment-timezone";
import Comments from "./Comments";


const Post = ({route}) => {
    const isTablet = DeviceInfo.isTablet();
    const {loggedInUser,setSelectedMenu,setHideChatbot,setHideChatbotMember} = useContext(MembersContext); 
    const token = AsyncStorage.getItem('accessToken');
    const [search, setSearch] = useState("");
    const [groupSearch, setGroupSearch] = useState("");
    const [searchTxt, setsearchTxt] = useState("");
    const [isLoader, setIsLoader] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null)
    const navigate = useNavigation();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [userGroupData, setuserGroupData] = useState([]);
    const [userAllGroupsData, setuserAllGroupsData] = useState([]);
    const [commentDescription, setCommentDescription] = useState("");
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [dropDownMoal, setDropDownMoal] = useState(false);
    const [dropDownMoalSearch, setDropDownMoalSearch] = useState('');
    const [description,setDescription] = useState("");
    const [descriptionErr,setDescriptionErr] = useState("");
    const [selectedImage, setSelectedImage] = useState([]);
    const [isImageLodering, setIsImageLodering] = useState(false);
    const [selectedGrpError,setSelectedGrpError] = useState("")
    const [selectedItems, setSelectedItems] = useState([]);
    const [isLodering, setIsLodering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedGroupChanged, setSelectedGroupChanged] = useState(false);
    const [selectedPrivatePost, setSelectedPrivatePost] = useState([]);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [postSuccess,setPostSuccess ] = useState(false);
    const scrollViewRef = useRef(null);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageGroup, setPageGroup] = useState(0);
    const [load, setLoad] = useState(false);
    const [loadGroups, setLoadGroups] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [refreshingGrpups, setRefreshingGroups] = useState(false);
    const [hasMoreGroups, setHasMoreGroups] = useState(true);
    const [blobImage, setBlobImage] = useState([]);
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postLoader,setPostLoader] = useState(false);
    const [likeSuccess, setLikeSuccess] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [viewLikes, setViewLikes] = useState(null); 
    const [viewComments, setViewComments] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [popupOpen,setPopupOpen] = useState(null);
    const [isDeleteModal, setIsDeleteModal] = useState(false);
    const [isVisible, setModalVisible] = useState(false);
    const [commentModal, setCommentModal] = useState(false);
    const [selectedImages, setSelectedImages] = useState(null);
    const [commentImage, setCommentImage] = useState(null);
    const [isHighlighted, setIsHighlighted] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [postId,setPostId] = useState("");
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [updatedComment, setUpdatedComment] = useState("");

    const copyToClipboard = (item) => {
      Clipboard.setString(item?.content);
      Alert.alert('Copied to Clipboard',item?.content);
      setIsHighlighted(item.id);
      setTimeout(() => {
        setIsHighlighted(null);
      }, 2000);
    };

    const formatMessageLinks = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Text
            key={index}
            onPress={() => Linking.openURL(part)}
            style={style.blueText}>
            {part}
          </Text>
        );
      } else {
        return ( index === 0 &&
          <Text key={index}>{part}</Text>
        );
      }
    });
  };

    const formatDate = (timestamp) => {
      const est = moment.tz(timestamp, "UTC").tz("America/New_York");
      const nowEst = moment.tz("America/New_York");
      const todayEst = nowEst.clone().startOf('day');
  
      if (est.isSame(todayEst, 'day')) {
          const diffMinutes = nowEst.diff(est, 'minutes');
          if (diffMinutes < 1) {
              return "Just now";
          } else if (diffMinutes < 60) {
              return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
          } else {
              const diffHours = nowEst.diff(est, 'hours');
              return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          }
      } else {
          return est.format('MMM DD, YYYY');
      }
  };
  

    const handleImagePress = (image,index) => {
      setCurrentImageIndex(index);
      setSelectedImages(image);
      setModalVisible(true);
    };

    const handleCommentImagePress = (image) => {
      setCommentImage(image);
      setCommentModal(true);
    };

    const handleImageChange = (index) => {
      setCurrentImageIndex(index); 
    }

    const currentImageUrl = selectedImages?.attachments[currentImageIndex]?.uploadUrl;

    const openPopup = (item) => {
      setPopupOpen(popupOpen === item ? null : item)
    }

    const handleToggle = (itemId) => {
      setExpandedId(!expandedId === itemId ? null : itemId);
      Clipboard.setString(itemId?.content);
      setIsHighlighted(itemId.id);
      setTimeout(() => {
        setIsHighlighted(null);
      }, 2000);
    };

    const handleInputFocus = () => {
        setIsFocused(true);
        setSelectedGrpError("")
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

        if (images.length > 5) {
          Alert.alert("You can only select up to 5 images.");
          return;
        }
    
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
            setHideChatbotMember(true)
            setHideChatbot(true)
            getGroupsData()
        },[]))


  const OpenLikes =async (item) => {
    setViewLikes(item);
    setIsModalVisible(true);
  }

  const openComments = async (item) => {
    setViewComments(item);
    setIsCommentsVisible(true);
  }


  const handlePress = async (groupId,reset=false) => {
    const limit = 10;
    const offset = reset ? 0 : pageGroup;
    if (loadGroups) return;
    setLoadGroups(true);
    try {
      // setIsLoader(true);
      if(isLoading){
        setIsLoader(true)
      }
      setShow(false)
      const response = await getPrivatePostById(groupId, limit, offset, token);
      if(response.status === 200){ 
      setShow(true)
      setIsLoading(false)
      const newPosts = response.data;
        if(newPosts?.errorResponse === "No Posts found for the group!"){
          setSelectedPrivatePost([])
          
        }else {
        setSelectedPrivatePost(reset ? newPosts : (prevGroupList) => {
          const existingUids = new Set(prevGroupList &&  prevGroupList.map(post => post.id));
          const filteredList = newPosts.filter(post => !existingUids.has(post.id));
          return [...prevGroupList, ...filteredList];
        });
        setHasMoreGroups(newPosts.length === limit)
        }
        setRefreshingGroups(false);
        setIsLoader(false);
        
      }
    } catch (error) {
      console.error(error);
      setShow(true)
      setIsLoader(false);
    }  finally {
      setLoadGroups(false);
      setIsLoader(false);
      if (reset) setRefreshingGroups(false);
    }
  };

    useFocusEffect(React.useCallback(() => {
      if (selectedGroup === 'all') {
        setSelectedPost(null)
        setIsFocused(false)
        setSelectedImage([]);
        setBlobImage([])
        setCommentDescription("")
      } else {
        if(selectedGroupChanged){
          setPageGroup(0)
          handlePress(selectedGroup,true);
          setSelectedGroupChanged(false)
        }else{
          handlePress(selectedGroup);
        }

    }
    }, [selectedGroup,postSuccess,pageGroup]));

   

    const loadMoreGroups = () => {
      if(!loadGroups && hasMoreGroups) {
        setPageGroup((prev) => prev + 10)
      }
    }

    const renderFooterGroups = () => {
      return loadGroups && search.length === 0 ? 
      <ActivityIndicator style={[style.mt40,style.mB30]} size="small" color={COLORS.LIGHT_PRIMARY_50}/> : null;
    }

    const handleSelectGroup = (item) => {
      const publicId = userAllGroupsData[0].id
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
        setPostLoader(true);
        setUpdateSuccess(false);
        setPostSuccess(false)
          const response = await createPost(payload, token);
          if (response.status === 200) {
            setDescription("");
            setSelectedItems([userAllGroupsData[0].id]);
            setPostSuccess(true)
            setSelectedGrpError('')
            setDescriptionErr('')
            setIsFocused(false)
            setSelectedImage([]);
            setBlobImage([]);
            setPostLoader(false);
            handleRefresh()
          }
      } catch (error) {
        console.error(error);
        setPostLoader(false);
      }
    }
   };

    const getPostsData = async (reset=false) => {
      const limit = 10;
      const offset = reset ? 0 : page;
      if (load) return;
      setLoad(true);
      try {
        if(isLoading){
          setIsLoader(true)
        }
        if(reset){
          setIsLodering(true)
          setExpandedId(null)
        }else{
          setIsLodering(false)
        }
        setShow(false)
        const response = await getAllPost(limit, offset, token);
        if(response.status === 200){ 
          setShow(true)
          setIsLodering(false)
          setIsLoading(false)
        const newPosts = response.data;
        if(newPosts?.errorResponse === "No Posts found for the group!"){
          setData([])
        }else {
        setData(reset ? newPosts : (prevGroupList) => {
          const existingUids = new Set(prevGroupList && prevGroupList.map(post => post.id));
          const filteredList = newPosts.filter(post => !existingUids.has(post.id));
          return [...prevGroupList, ...filteredList];
        });
        setHasMore(newPosts.length === limit);
        }
        setIsLoader(false)
        setPopupOpen(null)
        setSelectedGroup('all');
    }
    } catch (error) {
      console.error(error);
      setShow(true)
      setIsLodering(false)
      setIsLoader(false);
      } finally {
        setLoad(false);
        setIsLoader(false);
        if (reset) setRefreshing(false);
      }
    };

    useFocusEffect(React.useCallback(() => {
      if(route?.params?.resetPost){
        handleRefresh()
        navigate.setParams({
        resetPost:null
        })
      }else{
       if(page){
        getPostsData();
       }
      }
    }, [page,postSuccess,route]));
  
    const loadMore = () => {
      if(selectedGroup === "all"){
      if (!load && hasMore) {
        setPage((prev)=> prev + 10);
      }
    }else{
      loadMoreGroups()
    }
    };
 
    const handleRefresh = () => {
      setRefreshing(true);
      setPage(0);
      setHasMore(true);
      getPostsData(true);
    };
      
    const renderFooter = () => {
      return load && !refreshing && search.length === 0 ? <ActivityIndicator style={[style.mt40,style.mB30]} size="small" color={COLORS.LIGHT_PRIMARY} /> : null;
    };

    useFocusEffect(
        React.useCallback(() => {
            setSelectedMenu(15)
            setSelectedGrpError("")
            setDescriptionErr('')
            setDescription('')
            if(comment){
                OpenPost(comment)
            }
        }, [updateSuccess,comment,isFocused,postSuccess]))

    const getGroupsData = async () => {
        try {
            const response = await getUserGroups(token);
            if (response.status === 200) {
              const sortedArray = response.data.sort((a, b) => {
                if (a.groupName === "Public") return -1;
                if (b.groupName === "Public") return 1;
                return 0;
              });
              const publicstatus = [{ id: "all", groupName: "All Posts" },...sortedArray]
              setuserAllGroupsData(sortedArray)
              setSelectedItems([sortedArray[0].id])
                setuserGroupData(publicstatus);
            }
        } catch (error) {
            console.error(error)
        }
    }

    const groupItems = userGroupData.map(group => ({
      label: group.groupName,
      value: group.id,
    }));

    const deletePostHandler = async() => {
      setPostSuccess(false)
      setLoader(true)
      try {
        const response = await deletePost(postId.id,token);
        if(response.status === 200){
          setData(prevPosts => prevPosts.filter(post => post.id !== postId.id));
          setPostSuccess(true)
          setIsDeleteModal(true)
          setPopupOpen(null)
          setLoader(false)
          setDeleteModal(false)
          setTimeout(() => {
            setIsDeleteModal(false)
          }, 2000);
        }
      } catch (error) {
        console.error(error)
      }
    }

    const OpenPost = async(item) => {
      setCommentDescription("")
      setDropdownVisible(false)
      setLoading(false)
        try {
            const response = await getPostById(item,token)
            if(response.status === 200){
            setSelectedPost(response.data);
            setComment('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    let filteredList = [];
    const filtered = data && data.filter(
        (item) => {
            const fullName = item.senderName ? item.senderName.toLowerCase() : '';
            const searchLower = search ? search.toLowerCase() : '';
            const content = item.content ? item.content.toLowerCase() : '';
            return fullName.includes(searchLower) || content.includes(searchLower);
        }
    );
    filteredList = filtered || [];

    let filteredGroupsData = [];
    const filteredGroups = selectedPrivatePost && selectedPrivatePost.filter(
        (item) => {
          const fullName = item.senderName ? item.senderName.toLowerCase() : '';
          const searchLower = search ? search.toLowerCase() : '';
          const content = item.content ? item.content.toLowerCase() : '';  
          return fullName.includes(searchLower) || content.includes(searchLower);
    }
    );
    filteredGroupsData = filteredGroups || [];

    const filteredGroupItems = groupItems.filter(item =>
      item?.label?.toLowerCase().includes(groupSearch.toLowerCase())
    );

      const backHandler = () => {
        Keyboard.dismiss();
        navigate.navigate("Home");
        setSelectedImage([])
        setBlobImage([]);
        setIsFocused(false);
        setGroupSearch("");
        setSearch("");
        setSelectedGroup('all');
        setDescriptionErr('');
        setDescription("");
      }

      const handlePressLike = async(item) => {
        if(likeSuccess)return;
        setLikeSuccess(true)
        try {
          const response = await likePostById(item.id)
          if(response.status === 200){
            const updatedPostResponse = await getPostById(item.id, token);
            if (updatedPostResponse.status === 200) {
                setSelectedPost(updatedPostResponse.data);
            }
            if(selectedGroup === 'all'){
                const updatedPost = filteredList && filteredList.map(post => post.id ===item.id ? updatedPostResponse.data : post )
                setData(updatedPost)
            }else{
              const updatedPost = filteredGroupsData && filteredGroupsData.map(post => post.id ===item.id ? updatedPostResponse.data : post )
              setSelectedPrivatePost(updatedPost)
            }
            setLikeSuccess(false)
          }
        } catch (error) {
          console.error(error)
          setLikeSuccess(false)
        }
      };

      const saveImageToGallery = async (imageUri) => {
        try {
          if (Platform.OS === 'android') {
            if (Platform.Version < 31) {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                  title: 'Storage Permission',
                  message: 'App needs access to your storage to save images',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                }
              );
              if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'You need to give storage permission to save images');
                return;
              }
            }
            const fileName = imageUri?.split('/').pop();
            const downloadDest = `${RNFS.ExternalDirectoryPath}/${fileName}`;
            await RNFS.downloadFile({ fromUrl: imageUri, toFile: downloadDest }).promise;
      
            await CameraRoll.save(downloadDest, { type: 'photo' });
            Alert.alert('Success', 'Image saved to gallery!');
            
          } else if (Platform.OS === 'ios') {
            const fileName = imageUri.split('/').pop();
            const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            await RNFS.downloadFile({ fromUrl: imageUri, toFile: downloadDest }).promise;
      
            await CameraRoll.save(downloadDest, { type: 'photo' });
            Alert.alert('Success', 'Image saved to gallery!');
          }
        } catch (error) {
          console.error('Error saving image:', error);
        }
      };

      const renderItem = (imageData) => ({ item,index }) => (
        <View style={[style.contant]}>
        <TouchableOpacity  key={index} onPress={() =>handleImagePress(imageData,index)} style={[styles.imageContainer]}>
        <FastImage
          source={{ uri: item?.uploadUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        </TouchableOpacity>
        </View>
      );

      const renderItemPostsData = ({item,index}) => {
        return (
          <TouchableWithoutFeedback  onPress={() => setPopupOpen(null)}>
          <View style={[style.borderRadius8,style.mtb10]}>
            
            <View style={[style.contant]}>
            <View style={[style.contentBetween]} >
              <View style={[style.row]}>
              {item && (
              <FastImage source={item.senderProfileUrl ? { uri: item.senderProfileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable } : require("../../assets/avatarImage.png")} style={styles.senderImg} resizeMode={FastImage.resizeMode.cover}/>
              )}
              <View>
                <Text style={[style.font16, style.boldTxt, style.mH10, styles.fontFamily, style.BlackbuttonTxt,style.mt3,styles.width190]}>{item?.senderName}</Text>
                <View style={[style.row,style.mH10,style.mt2]}>
                  {item.groupName === "Public" ?
                  <Entypo name="globe" style={style.mt2} size={16} color={COLORS.GREY}  /> :
                  <FontAwesome name="group" style={style.mt2} size={16} color={COLORS.GREY}/>} 
                  <Text selectable={true} style={[style.font14,style.mH5, styles.fontFamily, style.grayText,style.mt2]}>{item.groupName}</Text>
                </View>
                </View>
              </View>
              <View style={[style.row]}>
              <Text selectable={true} style={[style.font15,style.mt3,style.grayText]}>{formatDate(item?.creationTimestamp)}</Text>
              {loggedInUser.id === item.senderId && (
              <TouchableOpacity style={[style.mt5]} onPress={() => openPopup(item.id)}>
              <Entypo name="dots-three-vertical" size={normalize(16)} color={COLORS.PRIMARY} />
              </TouchableOpacity>)}
              </View>
              
              {popupOpen === item.id && (
               <View style={styles.menuContainer}>
                  <TouchableOpacity style={[style.row,style.centerBox,styles.p3]} onPress={() => {setPopupOpen(null);navigate.navigate("EditPost",{id:item.id})}}>
                  <MaterialIconCommunity
                   name='square-edit-outline'
                   size={18} 
                   color={COLORS.DARK_PRIMARY}
                   />
                    <Text style={[style.font14,style.mH10]}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.row,style.centerBox,style.pV10,styles.p3]} onPress={() => {setPostId(item),setDeleteModal(true)}}>
                  <MaterialIcon
                   name='delete'
                   size={18}
                   color={COLORS.DARK_PRIMARY}
                   />
                    <Text selectable={true} style={[style.font14,style.mH10]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
              )}
              </View>
              <View style={[style.column,style.mb5,style.mt10]}>
              <TouchableOpacity onPress={() => copyToClipboard(item)}>
      <Text
      selectable={true}
        numberOfLines={expandedId === item.id ? undefined : 5}
        style={[style.font16, style.textSize, style.mH10, style.fontFamily, style.BlackbuttonTxt, style.mt10,item.id === isHighlighted && styles.highlight]}
      >
        {formatMessageLinks(item?.content)}
      </Text>
      </TouchableOpacity>
      {item?.content?.length > 250 && (
        <TouchableOpacity onPress={() => handleToggle(item.id)}>
          <Text selectable={true}  style={[style.boldTxt,style.font16, style.primaryText, style.mH10,item.id === isHighlighted && styles.highlight]}>
            {expandedId === item.id ? "" : 'more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
              {item?.mediaUrl && (
                <TouchableOpacity style={[styles.imageContainer]}  onPress={() =>handleCommentImagePress(item.mediaUrl)}>
                <FastImage source={{ uri: item?.mediaUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable}} style={[styles.image]} resizeMode={FastImage.resizeMode.cover}/>
                </TouchableOpacity>
              )}
               <View style={styles.swiperContainer}>
              <SwiperFlatList
              index={-1} 
              paginationStyle={styles.paginationContainer}
              paginationDefaultColor={COLORS.GREY}
              showPagination={item?.attachments?.length > 1 ? true : false}
              paginationActiveColor={COLORS.BLACK}
              paginationStyleItem={[styles.paginationActiveStyle]}
              paginationStyleItemInactive={[styles.paginationWidth]}
              paginationAccessibilityLabels={true}
              data={item?.attachments || []}
              renderItem={renderItem(item)}
              />

        </View>
              <View style={[style.contentBetween,style.mt15]}>
              <View style={[style.row,style.mH10,style.mtb10]}>
              <TouchableOpacity disabled={likeSuccess} onPress={()=> handlePressLike(item)} style={[style.mt2]}>
              {item?.isLiked === false ? 
              <AntDesign name="hearto" size={26} color={COLORS.LIGHT_PRIMARY}/>
               :
              <AntDesign name="heart" size={26} color={COLORS.RED}/>
              }
              </TouchableOpacity>
              <TouchableOpacity style={[style.row,style.mH20]} onPress={() => openComments(item)}>
                {item?.commentCount === 0 ?
              <FontAwesome name='comment-o' size={26} color={COLORS.LIGHT_PRIMARY} /> :
              <FontAwesome name='comment' size={26} color={COLORS.LIGHT_PRIMARY}/>
              }
              <Text selectable={true} style={[style.boldTxt,style.font15,style.primaryText,style.mt5,style.mH5]}>{item?.commentCount === 0 ? " " : (item?.commentCount === 1 ? "1" : `${item?.commentCount}`)}</Text>
              </TouchableOpacity>

              </View>
              <View style={[style.contentBetween,style.mt5]}>
                <View style={[style.row,style.mH10]}>
                {item?.recentLikesDtos && item?.recentLikesDtos.slice(0, 3).map((items, index) => (
                <View style={[style.row,]}>
                  {items?.profileUrl ?
                  <FastImage key={index} source={{uri: items?.profileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable}} style={[styles.likedImg,style.mL10]} resizeMode={FastImage.resizeMode.contain}/> :
                  <Image style={[styles.likedImg,style.mL10]} source={require("../../assets/avatarImage.png")}/>
                  }
                </View>))}
                <TouchableOpacity onPress={() => OpenLikes(item)} disabled={item?.likeCount === 0}>
              <Text style={[style.boldTxt,style.font15,style.primaryText,style.mt7,style.mH5]}>{item?.likeCount === 0 ? " " : (item?.likeCount === 1 ? "1 Like" : `${item?.likeCount} Likes`)}</Text>
              </TouchableOpacity>
               </View>

              </View>
              
              </View>
              {
              item?.groupMessageComments && item?.groupMessageComments?.slice(0, 2).map((comment, index) => (
                  <View style={[style.contentBetween,style.centerBox,style.mH5]}>
                  <View style={[style.row,style.mtb5]}>
                      {comment?.senderProfileUrl ? (
                          <FastImage source={{ uri: comment?.senderProfileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }} style={[styles.commentsenderImg]} resizeMode={FastImage.resizeMode.cover}/>
                      ) : (
                          <Image style={[styles.commentsenderImg]} source={require("../../assets/avatarImage.png")} alt="img" />
                      )}
                      <View style={style.mH10}>
                      <Text selectable={true}  style={[style.font13,]}>{comment?.senderName}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(comment)}>
                      {comment?.content && <Text selectable={true}  style={[style.font14,style.commentsWidth]}>{comment?.content}</Text>}
                      </TouchableOpacity>
                          {comment.imageUrl &&
                          <TouchableOpacity onPress={() => handleCommentImagePress(comment?.imageUrl)}>
                          <FastImage source={{ uri: comment?.imageUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }} style={[styles.pickedImage,style.mb5]} resizeMode={FastImage.resizeMode.cover}/>
                          </TouchableOpacity>}
                          <Text selectable={true}  style={[style.font12, style.grayText]}>{formatDate(comment?.creationTimestamp)}</Text>
                      </View>
                  </View>
                  </View>
                ))}
              <TouchableOpacity style={[style.mH10]} onPress={() => openComments(item)}>
              <Text style={[style.font15,style.grayText]}>View Comments</Text>
              </TouchableOpacity>
              </View>
              <View>
              </View>
            </View>
            </TouchableWithoutFeedback>
        )
      }

      const renderPaginationDots = () => {
        return (
          <View style={styles.modalPaginationContainer}>
            {selectedImages?.attachments.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        );
      };

    return (
        <View style={[style.contant]}>
                <View style={[style.contant]}>
                    <View style={[style.sidepanelcolor]}>
                        <Menus selectIndex={15}></Menus>
                    </View>
                    
                    <ScrollView onMomentumScrollEnd={loadMore} keyboardShouldPersistTaps={'handled'} scrollEnabled={true} persistentScrollbar={true} ref={scrollViewRef} style={[style.mt10]}>
                    <View style={[styles.shadowBox,style.mtb5,style.mH15]}>
                    <View style={[style.row,style.mH15,style.mtb10]}>
                     
                    {!isFocused ?  ( <View>
                    {loggedInUser && loggedInUser?.profileUrl ? (
                 <FastImage
                  source={{ uri: loggedInUser?.profileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }}
                  style={styles.profileImg}
                  resizeMode={FastImage.resizeMode.cover}
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
                <TouchableOpacity onPress={handleInputFocus}>
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
                onChangeText={(txt) => {setDescription(txt);setDescriptionErr('')}}
                autoCorrect={false}
                underlineColor='transparent'
                contentStyle={{textDecorationLine:"none"}}
                cursorColor={COLORS.BLACK}
                activeUnderlineColor ='transparent'
                multiline={true}
                numberOfLines={2}
                caretHidden={false}
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
                    <Text style={[style.font16]}>{selectedItems.length > 1 ? `Selected(${selectedItems.length})` : (selectedItems.length > 0 ? sliceString(userAllGroupsData.find(item => item.id ===selectedItems[0])?.groupName,15):'Select' ) }</Text>
                    <Entypo name='chevron-thin-down'size={normalize(15)} color={COLORS.BLACK}/>
                  </TouchableOpacity>
               {selectedGrpError && <Text style={[style.textDanger]}>{selectedGrpError}</Text>}
                </View>
                <TouchableOpacity disabled={isImageLodering || isLodering || postLoader} style={[style.centerBox,style.primaryLayout,styles.postbtn]} onPress={createPostHandler}>
                {postLoader ?
                <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
                  :
                <Text style={[style.whiteText,style.centerItem]}>Post</Text>
                }
                </TouchableOpacity>    
                <TouchableOpacity onPress={() => {setDropdownVisible(true);setSearch("")}}>
                <MaterialCommunityIcons
                 name={selectedGroup === "all" ? "filter-outline" : "filter"}
                 size={35}
                 color={COLORS.PRIMARY}/>
                </TouchableOpacity> 
                </View>
                </View>
                <View style={[style.mH20,style.row,style.centerBox]}>
                {/* <FilterComponent searchComponentWidth={isTablet ? "95%" : "90%"} isButtion={true} searchInput={search} onSearchBut={() => setsearchTxt(search)} onChangeText={(txt) => setSearch(txt)} placeholder={`Search here`} data={filteredList} /> */}
                <View>
                

        <ModalNative
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          visible={isDropdownVisible}
          backdropColor='rgba(0, 0, 0, 0.3)'
          onBackdropPress={() => {setDropdownVisible(false);setGroupSearch("")}}
        >
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalContent]}>
            <View style={[style.alignSelfEnd,style.mb5]}>
            <AntDesign onPress={() =>{setDropdownVisible(false);setGroupSearch("")}} name='closecircle' size={26} color={COLORS.LIGHT_PRIMARY}/>
            </View>
              <TextInput
                style={[styles.searchInputStyle,style.mtb5,style.pH10]}
                placeholder="Search groups"
                placeholderTextColor={COLORS.LIGHTGREY}
                onChangeText={setGroupSearch}
                value={groupSearch}
              />
              {filteredGroupItems && filteredGroupItems.length > 0 ?
              <FlatList
              data={filteredGroupItems}
              keyExtractor={(item) => item.value}
              renderItem={({ item,index }) => (
                <TouchableOpacity
                  style={[ { backgroundColor: index % 2 === 0 ? COLORS.WHITE : "#EDEDED",color:index % 2 === 0 ?  "#EDEDED" :COLORS.WHITE },
                    styles.listItem,
                    item.value === selectedGroup && styles.activeItem,
                   
                  ]}
                  onPress={() => {
                    setSelectedGroupChanged(false)
                    if (item.value !== selectedGroup) {
                      setIsLoading(true);
                      setSelectedGroup(item.value);
                      setSelectedGroupChanged(true)
                      setSelectedPrivatePost("");
                      setDropdownVisible(false);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.itemTextStyle,
                      item.value === selectedGroup && styles.activeItemText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            /> 
              : 
              <View style={[style.mtb20,style.centerBox]}> 
                <Text style={[style.grayText]}>No Groups Found</Text>
            </View>}
            </View>
          </View>
        </ModalNative>
      </View>
                </View>
                {isLodering ? 
                <View style={[style.contant, style.row, style.centerBox, style.centerItem,style.mt40]}>
                <ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} />
               </View> :
                
                        <View style={[style.mH10, style.mt5]}>
                            <View>
                                {isLoader ?
                                    <View style={[style.contant, style.row, style.centerBox, style.centerItem,style.mt40]}>
                                        <ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }}  size={'small'} />
                                    </View> :  selectedGroup === 'all' ? (
                                    <View style={[style.mtb10, styles.postBox]}>
                                    {filteredList && filteredList.length > 0 ? (
                                    <FlatList
                                    keyboardShouldPersistTaps={"handled"}
                                    data={filteredList}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItemPostsData}
                                    ListFooterComponent={renderFooter}
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    />)
                                    :
                                    (show && <View style={[style.contant, style.row, style.centerBox, style.centerItem,style.mt40]}>
                                      <ActivityIndicator style={style.mt40} theme={{ colors: { primary: COLORS.PRIMARY } }}  size={'small'} />
                                  </View>
                                    )}
                                    </View>) : 
                                    filteredGroupsData && filteredGroupsData.length > 0 ? (
                                    <FlatList
                                    keyboardShouldPersistTaps={"handled"}
                                    data={filteredGroupsData}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItemPostsData}
                                    ListFooterComponent={renderFooterGroups}
                                    refreshing={refreshingGrpups}
                                    onRefresh={handleRefresh}
                                    /> )
                                    :
                                   (show && <View style={[style.centerBox,style.centerItem,style.mt40]}>
                                      <Text style={[style.font16,style.mt40]}>No posts found</Text>
                                    </View>)}                         
                            </View>
                        </View>
                      }
                    </ScrollView>
                    </View>
            <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            onBackdropPress={() => setDropDownMoal(false)}
            isVisible={dropDownMoal}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.whiteLayout,style.borderRadius8]}>
               <View style={[style.row,style.centerBox,style.mtb10]}>
                <View style={[{flex:0.2,}]}>
                <AntDesign name='search1' size={20} color={COLORS.LIGHTGREY} style={[style.textCenter]}/>
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
                  {userAllGroupsData.filter((item)=> item?.groupName?.toLowerCase().includes(dropDownMoalSearch.toLocaleLowerCase())).length > 0 ? userAllGroupsData.filter((item)=> item?.groupName?.toLowerCase().includes(dropDownMoalSearch.toLocaleLowerCase())).map((item) => ( 
                    <TouchableOpacity style={[{marginVertical:normalize(7)},style.row,style.centerBox,style.between]} key={item.id} onPress={()=>handleSelectGroup(item)}>
                      <Text style={[style.font16,style.boldTxt]}>{item.groupName}</Text>
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
          <Modal visible={deleteModal} animationType="fade" transparent={true} onBackdropPress={()=>setDeleteModal(false)}>
          <View style={styles.modalBackground}>
            <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                    <TouchableOpacity onPress={()=>setDeleteModal(false)} style={{alignSelf:'flex-end'}}>
                    <AntDesign name="closecircle" size={25} color={COLORS.PRIMARY} />
                    </TouchableOpacity >
                    <View>
                        
                        <Text style={[style.textCenter,style.font20,style.mtb10,{color:COLORS.PRIMARY},style.boldTxt]}>Are you sure want to delete this post ?</Text>
                        <View style={[style.contentBetween,styles.mH,style.mt10]}>
                        <TouchableOpacity style={[style.button,style.whiteLayout,styles.widthScreen]} onPress={() => setDeleteModal(false)}>
                        <Text style={[style.buttonTxt,style.boldTxt,style.font16,style.primaryText,]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.button,style.primaryLayout,styles.widthScreen]} onPress={deletePostHandler}>
                            {loader ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} /> :
                        <Text style={[style.buttonTxt,style.boldTxt,style.font16,style.whiteText,]}>Yes</Text>}
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                </View>
                </View>
        </Modal>
        {commentImage && (
        <Modal visible={commentModal} transparent={true} onRequestClose={() => setCommentModal(false)}>
        <View style={[style.centerBox,style.contentBetween]}></View>
        <TouchableOpacity
          style={[styles.backButton,style.row,style.centerBox]}
          onPress={() => setCommentModal(false)}
        >
          <FontAwesome style={[style.mt3]} name="chevron-left" color={COLORS.WHITE} size={20} />
          <Text style={[style.font18,style.whiteText,style.mH10]}>Back</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton,style.row]} onPress={() => saveImageToGallery(commentImage)}>
        <Icon name="download" color={COLORS.WHITE} size={25}/>
        <Text style={[style.font18,style.whiteText,style.mH10]}>Save</Text> 
      </TouchableOpacity>
          <ImageViewer
            imageUrls={[{url:commentImage}]}
            onSave={() => saveImageToGallery(commentImage)}
            renderImage={(props) => (
              <Image {...props} style={{ ...props.style, resizeMode: 'center' }} />
            )}
          /> 
        </Modal>
        )}
        <Modal visible={isVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={[style.centerBox,style.contentBetween]}></View>
        <TouchableOpacity
          style={[styles.backButton,style.row,style.centerBox]}
          onPress={() => setModalVisible(false)}
        >
          <FontAwesome style={[style.mt3]} name="chevron-left" color={COLORS.WHITE} size={20} />
          <Text style={[style.font18,style.whiteText,style.mH10]}>Back</Text>
          
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton,style.row]} onPress={() => {
            if (currentImageUrl) {
              saveImageToGallery(currentImageUrl); // Save the current image
            }
          }}>
        <Icon name="download" color={COLORS.WHITE} size={25}/>
        <Text style={[style.font18,style.whiteText,style.mH10]}>Save</Text> 
      </TouchableOpacity>
          <ImageViewer
          index={currentImageIndex}
           onChange={handleImageChange} 
            imageUrls={selectedImages?.attachments.map((item) => ({ url: item.uploadUrl }))}
            onSave={() => {
              if (currentImageUrl) {
                saveImageToGallery(currentImageUrl); // Save the current image
              }
            }}
            renderImage={(props) => (
              <Image {...props} style={{ ...props.style, resizeMode: "center",}} />
            )}
          /> 
          {renderPaginationDots()}  
        </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              style={styles.modelUser}
              visible={isDeleteModal}
             onBackdropPress={() => setIsDeleteModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContents}>
                  <Text style={styles.modalText}>
                    Post deleted successfully.
                  </Text>
                </View>
              </View>
            </Modal>
          {isModalVisible && (
           <Likes
           onClose={() => setIsModalVisible(false)}
           item={viewLikes}/>
          )}
          {isCommentsVisible && (
           <Comments
           onClose={() => setIsCommentsVisible(false)}
           item={viewComments}
           filteredList={filteredList}
           selectedGroup={selectedGroup}
           setData={setData}
           filteredGroupsData={filteredGroupsData}
           setSelectedPrivatePost={setSelectedPrivatePost}/>
          )}
        </View>
    )
}
export default Post;

const styles = StyleSheet.create({
    postbtn: {
        width: normalize(70),
        height: normalize(33),
        borderColor: COLORS.LIGHT_PRIMARY,
        borderWidth: 1,
        borderRadius: 8,
        color: COLORS.WHITE,
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center',
    },
    postImg: {
        width: Dimensions.get("screen").width*1,
        height: Dimensions.get("screen").height * 0.4,
        justifyContent: "center",
        borderRadius:10,
    },
    imageContainer: {
      width: Dimensions.get('screen').width * 0.95,
      height:  Dimensions.get('screen').width *0.95,
      borderRadius: 10, // Optional: Add rounded corners
      overflow: 'hidden', // Ensures any overflow is hidden
    },
    image: {
      width: '100%',
      height: '100%',
    },
    pickedImage: {
        width: normalize(100),
        marginTop: normalize(10),
        height: normalize(120),
        resizeMode: "contain",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 8,
    },
    shadowBox: {
        borderRadius: 10,
        backgroundColor: "#FAFAFA",
        shadowOffset: {
            width: -2,
            height: 2,
        },
    },
    widthScreen:{
      width:Dimensions.get('screen').width * 0.25
    },
    postBox: {
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 1,
        borderColor: COLORS.WHITE
    },
    borderStyle: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
        borderRadius: normalize(6),
        paddingHorizontal: normalize(5),
        marginBottom: normalize(5),
        width: '100%',
        color: COLORS.BLACK,
        height: normalize(35),
    },
    iconSize: {
        width: normalize(20),
        height: normalize(20)
    },
    textSize: {
        fontWeight: '500',
        fontFamily: "Metropolis",
        lineHeight: 20,
        color:COLORS.BLACK
    },
    fontFamily: {
        fontFamily: "Metropolis"
    },
    postContainer: {
        borderRadius: 8
    },
    profileImg: {
        width: normalize(45),
        height: normalize(45),
        borderRadius: 50
    },
    senderImg: {
        width: normalize(35),
        height: normalize(35),
        borderRadius: 30
    },
    commentsenderImg: {
        width: normalize(30),
        height: normalize(30),
        borderRadius: 30
    },
    likedImg: {
      width: normalize(23),
      height: normalize(23),
      borderRadius: 30
  },
    inputStyle: {
        fontSize: normalize(14),
        fontFamily: 'Roboto-Regular',
        width: normalize(200),
        color: COLORS.BLACK,
        textDecorationLine: "none",
        borderWidth: 0.1,
        borderRadius: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderColor: '#EDEDED',
        alignItems: 'center',
        flexDirection: 'row',
        padding:normalize(5),
    },
    inputContainer: {
        flex: 1,
        borderWidth: 0.1,
        paddingHorizontal: 15,
        borderRadius: 30,
        borderColor: '#EDEDED',
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        flexDirection: 'row',
        height: normalize(45),
    },
    inputComments: {
        paddingHorizontal:15,
        borderRadius: 30,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: normalize(5)
    },
    pv8: {
        paddingVertical: 8
    },
    tablist: {
        paddingHorizontal: 4,
        paddingVertical: 5,
    },
    inputStyleisFocused: {
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        width:isTablet() ? Dimensions.get("screen").width*0.83 :normalize(220),
        height:normalize(45),
        color:COLORS.BLACK,
        paddingTop:Platform.OS === "ios" ? normalize(15) : normalize(10),
        backgroundColor:"#EDEDED",
        textDecorationLine:"none",
        textDecorationColor:"transparent", 
        borderRadius:30,
        paddingHorizontal:15,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        borderColor:'#EDEDED',
        overflow:'hidden',
        borderWidth:0
      },
      inputStyleFocused: {
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        width:isTablet() ? Dimensions.get("screen").width*0.89 : normalize(260),
        minHeight:normalize(50),
        color:COLORS.BLACK,
        backgroundColor:"#EDEDED",
        textDecorationLine:"none",
        textDecorationColor:"transparent", 
        borderRadius:30,
        borderTopRightRadius:30,
        borderTopLeftRadius:30,
        borderColor:'#EDEDED',
        paddingHorizontal:15,
        textDecorationLine: "none",
        borderWidth: 0.1,
        paddingTop:normalize(10),
        paddingBottom:normalize(10),
        padding:normalize(5),
      },
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
      uploadImage:{
        width:normalize(25),
        height:normalize(25),
        resizeMode:"contain"
      },
      uploadImageCom:{
        width:normalize(20),
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
      closeTextbox:{
        position:"absolute",
        zIndex:999
      },
      closeImageIcon:{
        marginBottom:140,
        marginLeft:-15
      },
      label: {
        fontSize: 16,
        marginBottom: 10,
      },
      dropdown: {
        height: normalize(35),
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor:COLORS.WHITE,
        color:COLORS.BLACK
      },
      dropdownContainer: {
        backgroundColor:COLORS.WHITE,
        color:COLORS.BLACK
      },
      itemTextStyle: {
        color:COLORS.BLACK
      },
      placeholderStyle: {
        fontSize: 16,
        color: COLORS.BLACK,
      },
      selectedTextStyle: {
        fontSize: 16,
        color:COLORS.BLACK
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:!isTablet() ? normalize(20) : normalize(0)
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxHeight: isTablet() ? "70%" :'50%',
      },
      listItem: {
        padding: normalize(10)
      },
      selectedTextStyle: { 
        color: 'black' 
      },
      itemTextStyle: {
        color: 'black' 
      },
      iconStyle: {
         marginHorizontal: 5 
      },
      activeItem: {
        backgroundColor: COLORS.PRIMARY,
      },
      activeItemText: {
        color: COLORS.WHITE,
      },
      searchInputStyle:{
        borderWidth:0.5,
        borderColor:COLORS.LIGHTGREY,
        backgroundColor:COLORS.WHITE,
        color:COLORS.BLACK,
        height:normalize(35)
      },
      dropDownInput: {
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        color:COLORS.BLACK,
        borderColor:'#EDEDED',
        borderRadius:0,
        backgroundColor:"transparent"
      },
      absoluteFill: {
        position:"absolute",
        left:"50%",
        top:"20%",
        zIndex:999
      },
      loader: {
        position: 'absolute',
        zIndex:1,
        marginTop:normalize(60)
      },
      paginationWidth:{
        color:COLORS.GREY,
      },
      paginationActiveStyle:{
        width:8,
        height:8,
        margin: normalize(5),
        color:COLORS.BLACK,
        backgroundColor:COLORS.LIGHTGREY
      },
      popContainer: {
        position: 'relative',
      },
      arrow: {
        position: 'relative',
        borderTopColor: 'white',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
      },
     menuContainer:{
      position:'absolute', 
      right: Dimensions.get('screen').width * 0.05, 
      width: Dimensions.get('screen').width * 0.3,
      height: Dimensions.get('screen').width * 0.15,
      borderRadius:10,
      padding:0, 
      backgroundColor: 'white',
      zIndex: 999, 
    },
    modelUser: {
      width: 300,
      height: 500
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContents: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      elevation: 5,
    },
    modalText: {
      color:COLORS.BLACK,
      fontSize:normalize(14),
      fontWeight:"600",
      lineHeight:30,
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 10
    },
    backButton: {
      position: 'absolute',
      top: 80, 
      left: 20, 
      zIndex: 1,
    },
    saveButton: {
      position: 'absolute',
      top: 80, 
      right: 20, 
      zIndex: 1,
    },
    highlight: {
      backgroundColor: COLORS.LIGHTGREY,
      color: "#000",
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
  },
  popupText: {
      color: 'black',
  },
  p3:{
    padding:5
  },
  paginationOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperContainer: {
    position: 'relative',
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    zIndex: 1,
    borderRadius:30,
    height:Dimensions.get('screen').height * 0.025,
    backgroundColor:COLORS.OFFWHITE,
    display:"flex",
    alignItems:"center"
  },
  width190:{
    width:Dimensions.get("screen").width*0.48
  },
  modalPaginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 1,
    borderRadius:30,
    backgroundColor:COLORS.OFFWHITE
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 8,
    backgroundColor: COLORS.GREY,
  },
  activeDot: {
    backgroundColor: COLORS.BLACK, // active dot color
  },
})
