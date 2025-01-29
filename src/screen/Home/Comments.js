import React, { useEffect, useState, useContext } from "react";
import { View,Text,StyleSheet, Dimensions,TouchableOpacity, ScrollView,Image,Keyboard,TextInput, KeyboardAvoidingView,Platform,PermissionsAndroid,Alert,Modal } from "react-native";
import ModalNative from "react-native-modal";
import style from "../../styles/style";
import FastImage from "react-native-fast-image";
import { normalize } from "../../styles/utilities/dimentions";
import AntDesign from "react-native-vector-icons/AntDesign";
import COLORS from "../../styles/theme/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from 'react-native-image-crop-picker';
import Config from 'react-native-config';
import s3 from "../../services/aws-config";
import Icons from 'react-native-vector-icons/Ionicons';
import Clipboard from "@react-native-clipboard/clipboard";
import { ActivityIndicator } from 'react-native-paper';
import { addPostComment,getPostById,deleteComment } from "../../services/api/auth";
import MembersContext from "../Members/MembersContext";
import moment from "moment";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import  ImageCompressor  from 'react-native-compressor';
import RNFS from 'react-native-fs';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import Icon from 'react-native-vector-icons/Feather';
import ImageViewer from "react-native-image-zoom-viewer";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { checkPermissions, permissionAlert } from "../../styles/utilities/variables";

const Comments = ({item,onClose,setData,selectedGroup,filteredList,setSelectedPrivatePost,filteredGroupsData}) => {

    const token = AsyncStorage.getItem('accessToken');
    const [postsData,setPostsData] = useState([]);
    const [commentDescription, setCommentDescription] = useState("");
    const [commentDescriptionErr, setCommentDescriptionErr] = useState("");
    const [comment, setComment] = useState("");
    const [sendLoader, setSendLoader] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [selectedCommentImage, setSelectedCommentImage] = useState(null);
    const [blobCommentImage, setBlobCommentImage] = useState("");
    const [loadingComments, setLoadingComments] = useState([]);
    const [isImageLodering, setIsImageLodering] = useState(false);
    const {loggedInUser} = useContext(MembersContext); 
    const [loading, setLoading] = useState(false);
    const [isVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState(null);

    useEffect(() => {
        const getComments = async() => {
          try {
            const response = await getPostById(item?.id,token)
            if(response.status === 200){
              setPostsData(response.data)
             
            }
          } catch (error) {
            console.log(error)
          }
        }
        getComments()
      },[])

      const handleImagePress = (uri) => {
        setSelectedImages(uri);
        setModalVisible(true);
      };

      const addCommentHandler = async (item) => {
        setCommentDescriptionErr("")
        Keyboard.dismiss()
        let isValid = true;
        const payload = {
            "referenceId": item?.id,
            "content": commentDescription,
            "imageUrl": selectedCommentImage
        }
        if (commentDescription === "" && !selectedCommentImage) {
            setCommentDescriptionErr('required')
            isValid = false;
        }
        if (isValid) {
            try {
                setSendLoader(true)
                setUpdateSuccess(false)
                const response = await addPostComment(payload, token);
                if (response.status === 200) {
                  const updatedPostResponse = await getPostById(item?.id, token);
                if (updatedPostResponse.status === 200) {
                    setPostsData(updatedPostResponse.data);
                    if(selectedGroup === 'all'){
                        const updatedPost = filteredList && filteredList.map(post => post.id ===item.id ?updatedPostResponse.data : post )
                        setData(updatedPost)
                    }
                    else{
                      const updatedPost = filteredGroupsData && filteredGroupsData.map(post => post.id ===item.id ?updatedPostResponse.data : post )
                      setSelectedPrivatePost(updatedPost)
                    }
                }
                
    
                    setUpdateSuccess(true)
                    setSendLoader(false)
                    setComment(item)
                    setCommentDescription("")
                    setSelectedCommentImage(null)
                    setBlobCommentImage("")
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    const selectCommentImage = async() => {     
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      }   
        ImagePicker.openPicker({
          mediaType:'photo',
          cropping: false,
          cropperActiveWidgetColor:"#FFFFFF"
        }).then(async (image) => {
          const result = await ImageCompressor.Image.compress(image.path,{
            quality:0.8
          });
          const fileContent = await fetch(result);
          const blob = await fileContent.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
          const blobUri = reader.result;
          setBlobCommentImage(blobUri);
         };
         reader.readAsDataURL(blob);
          if (result) {
            const fileName = result.split('/').pop();
            setIsImageLodering(true);
            const params = {
              Bucket: Config.BUCKET_NAME,
              Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
              Body: blob,
            }
            s3.upload(params, (err, data) => {
              if (err) {
                console.error("Error uploading image:", err);
                setIsImageLodering(false);
              } else {
                setSelectedCommentImage(`${Config.DIRECTORY_URL}/${data.key}`)
                setIsImageLodering(false);
              }
            });
          }
        });
    
    };

    const deleteCommentHandler = async(selectedPos,item) => {
        try {
          setLoadingComments([...loadingComments, item.id]);
            setUpdateSuccess(false)
            const response = await deleteComment(item.id,token);
            if(response.status === 200){
              const updatedPostResponse = await getPostById(postsData.id, token);
              if (updatedPostResponse.status === 200) {
                  setPostsData(updatedPostResponse.data);
                  if(selectedGroup === 'all'){
                    const updatedPost = filteredList && filteredList.map(post => post.id ===postsData.id ?updatedPostResponse.data : post )
                    setData(updatedPost)
                }
                else{
                  const updatedPost = filteredGroupsData && filteredGroupsData.map(post => post.id ===postsData.id ?updatedPostResponse.data : post )
                  setSelectedPrivatePost(updatedPost)
                }
              }
                setUpdateSuccess(true)
                setLoadingComments(loadingComments.filter(id => id !== item.id));
                setComment(selectedPos)
            }
        } catch (error) {
            console.error(error);
        }
      }

      const dateFormat =(date)=>{
        return moment(date).format('MMM DD, YYYY')
      }
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
            const fileName = imageUri.split('/').pop();
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

    return(
      <View>
        <ModalNative style={styles.modal} isVisible={true} onBackdropPress={onClose} animationIn={'slideInUp'} animationOut={'slideOutDown'}> 
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modalContent]}>
                <View style={[style.row,style.centerBox]}>
                <TouchableOpacity onPress={onClose} style={[styles.backIcon,style.mB20]}>
              <AntDesign name="arrowleft" size={25} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <Text style={[style.font16,style.boldTxt,style.mtb20]}>Comments</Text>
            </View>
            <View style={[styles.inputComments,style.OffWhiteLayout, style.contentBetween, style.mB15,style.pH10,style.mH15]}>
              <TextInput
               style={[styles.inputStyle,style.font16]}
               placeholder={"Add comment..."}
               placeholderTextColor={COLORS.GREY}
               autoCorrect={false}
               underlineColor='transparent'
               cursorColor={COLORS.GREY}
               multiline
               autoFocus={false}
               activeUnderlineColor='transparent'
               value={commentDescription}
               onChangeText={(txt) => setCommentDescription(txt)}
               />  
               <View style={[style.row]}>
               <TouchableOpacity style={[style.mH10]} onPress={selectCommentImage}>
               <Image style={[styles.uploadImageCom,style.centerItem,style.mt10]} source={require("../../assets/uploadImage.png")} alt=''/>
               </TouchableOpacity>
              <TouchableOpacity onPress={() => addCommentHandler(item)} disabled={sendLoader} style={[style.commentBtn,style.row,style.centerItem,style.centerBox,style.mright]}>
                {sendLoader ?
                <ActivityIndicator theme={{ colors: { primary: COLORS.DARK_PRIMARY } }} /> 
                :
                <Icons style={[style.mL10]} name='send-sharp' color={COLORS.DARK_PRIMARY} size={23} />}
              </TouchableOpacity>
            </View>
            </View>
            <ScrollView>
            <View style={[style.mH15]}>           
              
            {blobCommentImage && (
                  <View style={[style.centerBox, style.centerItem, style.row,style.mB10]}>
                     <Image source={{ uri: blobCommentImage}} resizeMode='contain' style={styles.pickedImage} onLoadStart={() => setLoading(true)}
                      onLoadEnd={() => setLoading(false)} />
                     {isImageLodering && (
                    <ActivityIndicator size="small" color={COLORS.LIGHT_PRIMARY} style={styles.loader} />
                    )}
                    <TouchableOpacity onPress={() => {setSelectedCommentImage(null), setBlobCommentImage("")}} style={[styles.closeImageIcon]}>
                      <AntDesign name='closecircle' size={26} color={COLORS.LIGHT_PRIMARY} />
                    </TouchableOpacity>
                  </View>
                )}
                
                {postsData?.groupMessageComments && postsData?.groupMessageComments.length > 0 ? (
                     postsData?.groupMessageComments?.map((comment, index) => (
                  <View style={[style.contentBetween,style.centerBox]}>
                  <View style={[style.row,style.mtb5]}>
                      {comment?.senderProfileUrl ? (
                          <FastImage source={{ uri: comment?.senderProfileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }} style={[styles.commentsenderImg]} resizeMode={FastImage.resizeMode.cover}/>
                      ) : (
                          <Image style={[styles.commentsenderImg]} source={require("../../assets/avatarImage.png")} alt="img" />
                      )}
                      <View style={style.mH10}>
                      <Text style={[style.font13,]}>{comment?.senderName}</Text>
                      <TouchableOpacity>
                      {comment?.content && <Text selectable={true}style={[style.font14,style.commentsWidth]}>{comment?.content}</Text>}
                      </TouchableOpacity>
                          {comment?.imageUrl && 
                          <TouchableOpacity onPress={() =>handleImagePress(comment?.imageUrl)}>
                           <FastImage source={{ uri: comment?.imageUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable }} style={[styles.pickedImage,style.mb5]} resizeMode={FastImage.resizeMode.cover}/>
                           </TouchableOpacity>}
                          <Text style={[style.font12, style.grayText]}>{dateFormat(comment?.creationTimestamp)}</Text>
                      </View>
                  </View>
                  {loggedInUser?.id === comment?.senderId &&   
                  <TouchableOpacity onPress={() => deleteCommentHandler(postsData,comment)}>
                   {loadingComments.includes(comment.id) ? 
                  <ActivityIndicator size={20} theme={{ colors: { primary: COLORS.DARK_PRIMARY } }} />
                    :
                  <MaterialIcon
                   name='delete'
                   size={23}
                   color={COLORS.DARK_PRIMARY}
                   />}
                   </TouchableOpacity>}
                  </View>
                     )
                )):(
                    <View style={[style.contant,style.centerBox,style.centerItem,style.mt30]}>
                     {blobCommentImage ? null : <Text style={[style.font14]}>No comments</Text>}
                    </View>
                )}
               
                </View>
                
            </ScrollView>
            </View>
        </KeyboardAvoidingView>
        {selectedImages && (
                  <Modal style={styles.modalone} visible={isVisible}  onBackdropPress={() => setModalVisible(false)} animationIn={'slideInUp'} animationOut={'slideOutDown'}>
                  <TouchableOpacity
                    style={[styles.backButton,style.row,style.centerBox]}
                    onPress={() => setModalVisible(false)}
                  >
                    <FontAwesome style={[style.mt3]} name="chevron-left" color={COLORS.WHITE} size={20} />
                    <Text style={[style.font18,style.whiteText,style.mH10]}>Back</Text>
                    
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.saveButton,style.row]} onPress={() => saveImageToGallery(selectedImages)}>
                  <Icon name="download" color={COLORS.WHITE} size={25}/>
                  <Text style={[style.font18,style.whiteText,style.mH10]}>Save</Text> 
                </TouchableOpacity>
                    <ImageViewer
                      imageUrls={[{ url: selectedImages }]}
                      onSave={() => saveImageToGallery(selectedImages)}
                    />   
                  </Modal>
                )}
        </ModalNative>
     
        </View>
    )
}
export default Comments;

const styles = StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalone:{
      margin:0
    },
    modalContent: {
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      height:400
    },
    likedImg:{
        width:normalize(35),
        height:normalize(35),
        borderRadius:30
    },
    backIcon:{
        width: 35,
        height: 35,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop:20
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
    inputComments: {
        paddingHorizontal:15,
        borderRadius: 30,
        backgroundColor: '#EDEDED',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: normalize(5)
    },
    uploadImageCom:{
        width:normalize(20),
        height:normalize(20),
        resizeMode:"contain"
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
      loader: {
        position: 'absolute',
        zIndex:1,
        marginTop:normalize(60)
      },
      closeImageIcon:{
        marginBottom:140,
        marginLeft:-15
      },
      commentsenderImg: {
        width: normalize(30),
        height: normalize(30),
        borderRadius: 30
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
})