import React, { useEffect, useState, useContext } from "react";
import style from "../../styles/style";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Keyboard,
} from "react-native";
import Menu from "../../routes/Menu";
import DeviceInfo from "react-native-device-info";
import Icon from "react-native-vector-icons/FontAwesome";
import { normalize } from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import {
  addPostComment,
  deleteComment,
  getPostById,
  likePostById,
} from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { checkPermissions, dateFormat, permissionAlert } from "../../styles/utilities/variables";
import { ActivityIndicator } from "react-native-paper";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Icons from "react-native-vector-icons/Ionicons";
import MembersContext from "../Members/MembersContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FastImage from "react-native-fast-image";
import Entypo from "react-native-vector-icons/Entypo";
import Clipboard from "@react-native-clipboard/clipboard";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-crop-picker";
import ImageCompressor from "react-native-compressor";
import Config from "react-native-config";
import s3 from "../../services/aws-config";
import SwiperFlatList from "react-native-swiper-flatlist";
import Likes from "./Likes";

const PostDetails = ({ route }) => {
  const { loggedInUser } = useContext(MembersContext);
  const [selectedPost, setSelectedPost] = useState([]);
  const isTablet = DeviceInfo.isTablet();
  const [isLoader, setLoader] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const token = AsyncStorage.getItem("accessToken");
  const navigation = useNavigation();
  const [commentDescription, setCommentDescription] = useState("");
  const [commentDescriptionErr, setCommentDescriptionErr] = useState("");
  const [isHighlighted, setIsHighlighted] = useState(null);
  const [likeSuccess, setLikeSuccess] = useState(false);
  const [blobCommentImage, setBlobCommentImage] = useState("");
  const [loadingComments, setLoadingComments] = useState([]);
  const [coordinate, setCoordinate] = useState({});
  const [sendLoader, setSendLoader] = useState(false);
  const [selectedCommentImage, setSelectedCommentImage] = useState(null);
  const [isImageLodering, setIsImageLodering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewLikes, setViewLikes] = useState(null); 

  const handleImagePress = (uri) => {
    setSelectedImages(uri);
    setModalVisible(true);
  };

  const OpenLikes =async (item) => {
    setViewLikes(item);
    setIsModalVisible(true);
  }

  const copyToClipboard = (item) => {
    Clipboard.setString(item?.content);
    setIsHighlighted(item.id);
    setTimeout(() => {
      setIsHighlighted(null);
    }, 2000);
  };

  useEffect(() => {
    if (route && route.params) {
      handlePress(route.params.id);
    }
  }, [route]);

  const handlePress = async () => {
    setLoader(true);
    try {
      const response = await getPostById(route.params.id, token);
      if (response.status === 200) {
        setSelectedPost(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setSelectedPost(null);
    }
  };

  const handlePressLike = async (item) => {
    if (likeSuccess) return;
    setLikeSuccess(true);
    try {
      const response = await likePostById(item.id);
      if (response.status === 200) {
        const updatedPostResponse = await getPostById(selectedPost.id, token);
        if (updatedPostResponse.status === 200) {
          setSelectedPost(updatedPostResponse.data);
        }
        setLikeSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setLikeSuccess(false);
    }
  };

  const selectCommentImage = async () => {
    const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      }
    setIsImageLodering(true);
    ImagePicker.openPicker({
      mediaType: "photo",
      cropping: false,
      cropperActiveWidgetColor: "#FFFFFF",
    }).then(async (image) => {
      const result = await ImageCompressor.Image.compress(image.path, {
        quality: 0.8,
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
        const fileName = result.split("/").pop();

        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
          Body: blob,
        };
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading image:", err);
            setIsImageLodering(false);
          } else {
            setSelectedCommentImage(`${Config.DIRECTORY_URL}/${data.key}`);
            setIsImageLodering(false);
          }
        });
      }
    });
  };

  const addCommentHandler = async (item) => {
    console.log("loooooo", payload);
    setCommentDescriptionErr("");
    Keyboard.dismiss();
    let isValid = true;
    const payload = {
      referenceId: item.id,
      content: commentDescription,
      imageUrl: selectedCommentImage,
    };
    if (commentDescription === "" && !selectedCommentImage) {
      setCommentDescriptionErr("required");
      isValid = false;
    }
    if (isValid) {
      try {
        setSendLoader(true);
        setUpdateSuccess(false);
        const response = await addPostComment(payload, token);
        if (response.status === 200) {
          const updatedPostResponse = await getPostById(item.id, token);
          if (updatedPostResponse.status === 200) {
            setSelectedPost(updatedPostResponse.data);
          }
          setUpdateSuccess(true);
          setSendLoader(false);
          setSelectedCommentImage(null), setBlobCommentImage("");
          setCommentDescription("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const deleteCommentHandler = async (selectedPos, item) => {
    try {
      setLoadingComments([...loadingComments, item.id]);

      const response = await deleteComment(item.id, token);
      if (response.status === 200) {
        const updatedPostResponse = await getPostById(selectedPost.id, token);
        if (updatedPostResponse.status === 200) {
          setSelectedPost(updatedPostResponse.data);
        }
        setLoadingComments(loadingComments.filter((id) => id !== item.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBack = () => {
    if (route.params?.path) {
      navigation.navigate(route.params.path);
    } else {
      navigation.navigate("Home");
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[style.contant]}>
      <TouchableOpacity
        key={index}
        onPress={() => handleImagePress(item.uploadUrl)}
        style={[styles.imageContainer]}
      >
        <FastImage
          source={{
            uri: item.uploadUrl,
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
      {selectedImages && (
        <Modal
          visible={isVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={[styles.backButton, style.row, style.centerBox]}
            onPress={() => setModalVisible(false)}
          >
            <AntDesign name="back" color={COLORS.WHITE} size={30} />
            <Text style={[style.font18, style.whiteText, style.mH10]}>
              Back
            </Text>
          </TouchableOpacity>
          <ImageViewer imageUrls={[{ url: selectedImages }]} />
        </Modal>
      )}
    </View>
  );

  return (
    <View style={[style.contant]}>
      <View>
        <View style={[style.sidepanelcolor]}>
          <Menu selectIndex={15}></Menu>
        </View>
      </View>
      <View style={[style.contant, style.pH20, style.pt20]}>
        <View style={[style.row, style.mt10]}>
          {
            <TouchableOpacity style={style.row} onPress={onClickBack}>
              <Icon
                name="chevron-left"
                size={normalize(15)}
                style={[style.mr10, style.mt2]}
                color={COLORS.PRIMARY}
              />
              <Text style={[style.font16, style.boldTxt, style.primaryText]}>
                Back
              </Text>
            </TouchableOpacity>
          }
        </View>
        <KeyboardAwareScrollView
          enableAutomaticScroll={true}
          resetScrollToCoords={{ x: 0, y: 0 }}
          extraScrollHeight={120}
          scrollEnabled={true}
        >
          {isLoader ? (
            <View style={[style.contentCenter, style.mt40, style.centerItem]}>
              <ActivityIndicator
                style={[style.mt40]}
                theme={{ colors: { primary: COLORS.PRIMARY } }}
                size={"small"}
              />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedPost ? <View style={[style.borderRadius8, style.mtb20]}>
                <View style={[style.contant]}>
                  <View style={[style.contentBetween]}>
                    <View style={[style.row]}>
                      {selectedPost && (
                        <FastImage
                          source={
                            selectedPost.senderProfileUrl
                              ? {
                                  uri: selectedPost.senderProfileUrl,
                                  priority: FastImage.priority.high,
                                  cache: FastImage.cacheControl.immutable,
                                }
                              : require("../../assets/avatarImage.png")
                          }
                          style={styles.senderImg}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      <View>
                        <Text
                          style={[
                            style.font16,
                            style.boldTxt,
                            style.mH10,
                            styles.fontFamily,
                            style.BlackbuttonTxt,
                            style.mt3,
                          ]}
                        >
                          {selectedPost?.senderName}
                        </Text>
                        <View style={[style.row, style.mH10, style.mt2]}>
                          {selectedPost?.groupName === "Public" ? (
                            <Entypo
                              name="globe"
                              style={style.mt2}
                              size={16}
                              color={COLORS.GREY}
                            />
                          ) : (
                            <FontAwesome
                              name="group"
                              style={style.mt2}
                              size={16}
                              color={COLORS.GREY}
                            />
                          )}
                          <Text
                            style={[
                              style.font14,
                              style.mH5,
                              styles.fontFamily,
                              style.grayText,
                              style.mt2,
                            ]}
                          >
                            {selectedPost.groupName}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={[style.row]}>
                      <Text style={[style.font15, style.grayText, style.mt3]}>
                        {dateFormat(selectedPost?.creationTimestamp)}
                      </Text>
                    </View>
                  </View>
                  <View style={[style.column, style.mb5]}>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(selectedPost)}
                    >
                      <Text
                        style={[
                          style.font16,
                          style.textSize,
                          style.mH10,
                          style.fontFamily,
                          style.BlackbuttonTxt,
                          style.mt10,
                          selectedPost.id === isHighlighted && styles.highlight,
                        ]}
                      >
                        {selectedPost?.content}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {selectedPost?.mediaUrl && (
                    <View style={[styles.imageContainer]}>
                      <FastImage
                        source={{
                          uri: selectedPost?.mediaUrl,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }}
                        style={[styles.image]}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                  )}

                  <SwiperFlatList
                    index={-1}
                    paginationStyle={styles.mB40}
                    paginationDefaultColor={"#fff"}
                    showPagination={
                      selectedPost?.attachments?.length > 1 ? true : false
                    }
                    paginationActiveColor={"#fff"}
                    paginationStyleItem={[styles.paginationActiveStyle]}
                    paginationStyleItemInactive={[styles.paginationWidth]}
                    paginationAccessibilityLabels={true}
                    data={selectedPost?.attachments || []}
                    renderItem={renderItem}
                  />
                  <View style={[style.contentBetween, style.mB10]}>
                    <View style={[style.row, style.mH10, style.mtb10]}>
                      <TouchableOpacity
                        disabled={likeSuccess}
                        style={[style.mt2]}
                        onPress={() => handlePressLike(selectedPost)}
                      >
                        {selectedPost?.isLiked === false ? (
                          <AntDesign
                            name="hearto"
                            size={26}
                            color={COLORS.LIGHT_PRIMARY}
                          />
                        ) : (
                          <AntDesign
                            name="heart"
                            size={26}
                            color={COLORS.RED}
                          />
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity style={[style.row, style.mH20]}>
                        {selectedPost?.commentCount === 0 ? (
                          <FontAwesome
                            name="comment-o"
                            size={26}
                            color={COLORS.LIGHT_PRIMARY}
                          />
                        ) : (
                          <FontAwesome
                            name="comment"
                            size={26}
                            color={COLORS.LIGHT_PRIMARY}
                          />
                        )}
                        <Text
                          selectable={true}
                          style={[
                            style.boldTxt,
                            style.font15,
                            style.primaryText,
                            style.mt5,
                            style.mH5,
                          ]}
                        >
                          {selectedPost?.commentCount === 0
                            ? " "
                            : selectedPost?.commentCount === 1
                            ? "1"
                            : `${selectedPost?.commentCount}`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={[style.contentBetween, style.mt5]}>
                      <View style={[style.row, style.mH10]}>
                        {selectedPost?.recentLikesDtos &&
                          selectedPost?.recentLikesDtos
                            .slice(0, 3)
                            .map((items, index) => (
                              <View style={[style.row]}>
                                {items?.profileUrl && (
                                  <FastImage
                                    key={index}
                                    source={{
                                      uri: items?.profileUrl,
                                      priority: FastImage.priority.high,
                                      cache: FastImage.cacheControl.immutable,
                                    }}
                                    style={[styles.likedImg, style.mL10]}
                                    resizeMode={FastImage.resizeMode.contain}
                                  />
                                )}
                              </View>
                            ))}
                        <TouchableOpacity onPress={() => OpenLikes(selectedPost)}>
                          <Text
                            style={[
                              style.boldTxt,
                              style.font15,
                              style.primaryText,
                              style.mt7,
                              style.mH5,
                            ]}
                          >
                            {selectedPost?.likeCount === 0
                              ? " "
                              : selectedPost?.likeCount === 1
                              ? "1 Like"
                              : `${selectedPost?.likeCount} Likes`}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={[style.mH5]}>
                    <View
                      style={[
                        styles.inputComments,
                        style.lightGreyLayout,
                        style.contentBetween,
                        style.mB15,
                        style.pH10,
                      ]}
                    >
                      <TextInput
                        style={[styles.inputStyle, style.font16]}
                        placeholder={"Add comment..."}
                        placeholderTextColor={COLORS.GREY}
                        autoCorrect={false}
                        underlineColor="transparent"
                        cursorColor={COLORS.GREY}
                        multiline
                        autoFocus={false}
                        activeUnderlineColor="transparent"
                        value={commentDescription}
                        onChangeText={(txt) => setCommentDescription(txt)}
                      />
                      <View style={[style.row, style.mL10]}>
                        <TouchableOpacity
                          style={[style.mH10]}
                          onPress={selectCommentImage}
                        >
                          <Image
                            style={[
                              styles.uploadImageCom,
                              style.centerItem,
                              style.mt10,
                            ]}
                            source={require("../../assets/uploadImage.png")}
                            alt=""
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => addCommentHandler(selectedPost)}
                          disabled={sendLoader}
                          style={[
                            style.commentBtn,
                            style.row,
                            style.centerItem,
                            style.centerBox,
                            style.mL10,
                            style.mH5,
                          ]}
                          onLayout={(event) => {
                            const layout = event.nativeEvent.layout;
                            setCoordinate((prev) => ({
                              ...prev,
                              [selectedPost.key]: layout.y,
                            }));
                          }}
                        >
                          {sendLoader ? (
                            <ActivityIndicator
                              size={20}
                              theme={{
                                colors: { primary: COLORS.DARK_PRIMARY },
                              }}
                            />
                          ) : (
                            <Icons
                              name="send-sharp"
                              color={COLORS.DARK_PRIMARY}
                              size={23}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    {blobCommentImage && (
                      <View
                        style={[
                          style.centerBox,
                          style.centerItem,
                          style.row,
                          style.mB10,
                        ]}
                      >
                        <Image
                          source={{ uri: blobCommentImage }}
                          resizeMode="contain"
                          style={styles.pickedImage}
                          onLoadStart={() => setLoading(true)}
                          onLoadEnd={() => setLoading(false)}
                        />
                        {isImageLodering && (
                          <ActivityIndicator
                            size="small"
                            color={COLORS.LIGHT_PRIMARY}
                            style={styles.loader}
                          />
                        )}
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedCommentImage(null),
                              setBlobCommentImage("");
                          }}
                          style={[styles.closeImageIcon]}
                        >
                          <AntDesign
                            name="closecircle"
                            size={26}
                            color={COLORS.LIGHT_PRIMARY}
                          />
                        </TouchableOpacity>
                      </View>
                    )}

                    {selectedPost?.groupMessageComments?.map(
                      (comment, index) => (
                        <View style={[style.contentBetween, style.centerBox]}>
                          <View style={[style.row, style.mtb5]}>
                            {comment?.senderProfileUrl ? (
                              <FastImage
                                source={{
                                  uri: comment?.senderProfileUrl,
                                  priority: FastImage.priority.high,
                                  cache: FastImage.cacheControl.immutable,
                                }}
                                style={[styles.commentsenderImg]}
                                resizeMode={FastImage.resizeMode.cover}
                              />
                            ) : (
                              <Image
                                style={[styles.commentsenderImg]}
                                source={require("../../assets/avatarImage.png")}
                                alt="img"
                              />
                            )}
                            <View style={style.mH10}>
                              <Text style={[style.font13]}>
                                {comment?.senderName}
                              </Text>
                              {comment?.content && (
                                <Text
                                  style={[style.font14, style.commentsWidth]}
                                >
                                  {comment?.content}
                                </Text>
                              )}
                              {comment?.imageUrl && (
                                <FastImage
                                  source={{
                                    uri: comment?.imageUrl,
                                    priority: FastImage.priority.high,
                                    cache: FastImage.cacheControl.immutable,
                                  }}
                                  style={[styles.pickedImage, style.mb5]}
                                  resizeMode={FastImage.resizeMode.cover}
                                />
                              )}
                              <Text style={[style.font12, style.grayText]}>
                                {dateFormat(comment?.creationTimestamp)}
                              </Text>
                            </View>
                          </View>
                          {loggedInUser?.id === comment?.senderId && (
                            <TouchableOpacity
                              onPress={() =>
                                deleteCommentHandler(selectedPost, comment)
                              }
                            >
                              {loadingComments.includes(comment.id) ? (
                                <ActivityIndicator
                                  size={20}
                                  theme={{
                                    colors: { primary: COLORS.DARK_PRIMARY },
                                  }}
                                />
                              ) : (
                                <MaterialIcon
                                  name="delete"
                                  size={23}
                                  color={COLORS.DARK_PRIMARY}
                                />
                              )}
                            </TouchableOpacity>
                          )}
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View> 
            :
            <View style={[style.row,style.centerItem,style.centerBox,style.mt40]}>
              <Text style={[style.font16]}>This post is no longer available.</Text>
            </View>  
            }
            </ScrollView>
          )}
        </KeyboardAwareScrollView>
      </View>
      {isModalVisible && (
           <Likes
           onClose={() => setIsModalVisible(false)}
           item={viewLikes}/>
          )}
    </View>
  );
};
export default PostDetails;
const styles = StyleSheet.create({
  postbtn: {
    width: normalize(70),
    height: normalize(33),
    borderColor: COLORS.LIGHT_PRIMARY,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.WHITE,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  postImg: {
    width: "100%",
    marginTop: normalize(10),
    height: normalize(280),
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  pickedImage: {
    width: normalize(100),
    marginTop: normalize(10),
    height: normalize(120),
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff",
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
  postBox: {
    borderRadius: 10,
    paddingTop: 5,
    paddingBottom: 1,
    borderColor: COLORS.WHITE,
  },
  borderStyle: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(6),
    paddingHorizontal: normalize(5),
    marginBottom: normalize(5),
    width: "100%",
    color: COLORS.BLACK,
    height: normalize(35),
  },
  iconSize: {
    width: normalize(20),
    height: normalize(20),
  },
  textSize: {
    fontWeight: "600",
    fontFamily: "Metropolis",
    lineHeight: 20,
  },
  fontFamily: {
    fontFamily: "Metropolis",
  },
  postContainer: {
    borderRadius: 8,
  },
  profileImg: {
    width: normalize(45),
    height: normalize(45),
    borderRadius: 50,
  },
  commentsenderImg: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: 30,
  },
  inputStyle: {
    fontSize: normalize(14),
    fontFamily: "Roboto-Regular",
    width: normalize(220),
    color: COLORS.BLACK,
    textDecorationLine: "none",
    borderWidth: 0.1,
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: "#EDEDED",
    alignItems: "center",
    flexDirection: "row",
    padding: normalize(5),
  },
  inputStyleFocused: {
    fontSize: normalize(14),
    fontFamily: "Roboto-Regular",
    width: normalize(260),
    color: COLORS.BLACK,
    backgroundColor: "#EDEDED",
    textDecorationLine: "none",
    borderRadius: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderColor: "#EDEDED",
  },
  inputContainer: {
    flex: 1,
    borderWidth: 0.1,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderColor: "#EDEDED",
    backgroundColor: "#EDEDED",
    alignItems: "center",
    flexDirection: "row",
    height: normalize(45),
  },
  inputComments: {
    paddingHorizontal: 15,
    borderRadius: 30,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    flexDirection: "row",
    marginTop: normalize(10),
  },
  senderImg: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: 30,
  },
  fontFamily: {
    fontFamily: "Metropolis",
  },
  backButton: {
    position: "absolute",
    top: 80,
    left: 20,
    zIndex: 1,
  },
  highlight: {
    backgroundColor: COLORS.LIGHTGREY,
    color: "#000",
  },
  imageContainer: {
    width: Dimensions.get("screen").width * 0.95,
    height: Dimensions.get("screen").width * 0.95,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  likedImg: {
    width: normalize(23),
    height: normalize(23),
    borderRadius: 30,
  },
  uploadImageCom: {
    width: normalize(20),
    height: normalize(20),
    resizeMode: "contain",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
    marginTop: normalize(60),
  },
  closeImageIcon: {
    marginBottom: 140,
    marginLeft: -15,
  },
  paginationWidth: {
    width: normalize(5),
    height: normalize(5),
    marginTop: -10,
    color: COLORS.WHITE,
  },
  paginationActiveStyle: {
    width: 10,
    height: 10,
    marginBottom: 5,
    marginTop: -13,
    color: COLORS.WHITE,
  },
  mB40: {
    marginBottom: normalize(40),
  },
});