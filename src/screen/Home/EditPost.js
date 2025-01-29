import React, { useEffect, useState,useRef } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, Keyboard } from "react-native";
import style from "../../styles/style";
import Menu from "../../routes/Menu";
import { normalize } from "../../styles/utilities/dimentions";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getPostById, updatePost } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import COLORS from "../../styles/theme/color";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { dateFormat } from "../../styles/utilities/variables";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SwiperFlatList from 'react-native-swiper-flatlist';
import { TextInput } from "react-native-paper";
import { isTablet } from "react-native-device-info";
import { ActivityIndicator } from 'react-native-paper';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EditPost = ({ route }) => {
  const navigate = useNavigation();
  const token = AsyncStorage.getItem('accessToken');
  const [selectedPost, setSelectedPost] = useState(null);
  const [content, setContent] = useState("");
  const [contentErr, setContentErr] = useState("");
  const [loader, setLoader] = useState(true);
  const [saveLoader, setSaveLoader] = useState(false);
  const inputRef = useRef(null);

  const renderItem = ({ item, index }) => (
    <View style={[style.contant]}>
      <View key={index} style={[styles.imageContainer]}>
        <FastImage
          source={{ uri: item.uploadUrl, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    </View>
  );

  useEffect(() => {
    if (route && route.params) {
      handlePress(route.params.id)
    }
  }, [route])

  const handlePress = async (item) => {
    setLoader(true)
    try {
      const response = await getPostById(item, token)
      if (response.status === 200) {
        setSelectedPost(response.data)
        setContent(response?.data?.content)
        setLoader(false)
      }
    } catch (error) {
      console.log(error);
      setLoader(false)
    }
  }

  const savePostHandler = async () => {
    setContentErr("")
    let isValid = true;
    if (content === "") {
      setContentErr('Please write something')
      isValid = false;
    }
    const payload = {
      content: content
    }
    if (isValid) {
      try {
        setSaveLoader(true)
        const response = await updatePost(route.params.id, payload, token);
        if (response.status === 200) {
          setSaveLoader(false)
          navigate.navigate("Posts", { resetPost: true })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <View style={[style.contant]}>
      <View>
        <View style={style.sidepanelcolor}>
          <Menu selectIndex={15} style={style.sidepanelcolor} />
        </View>
      </View>
      <View
        style={[
          style.contant,
          style.pH20,
          style.pt20
        ]}>
       
        {loader ? <View style={[style.contentCenter, style.mt40, style.centerItem]}>
          <ActivityIndicator style={[style.mt40]} theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'} />
        </View> :
        <View>
             <View style={[style.contentBetween]} onTouchStart={() => Keyboard.dismiss()}>
            <TouchableOpacity style={[style.row,style.mt10]} onPress={() => {navigate.navigate("Posts", { resetPost: true })}}>
              <Icon name="chevron-left" size={normalize(15)} style={[style.mr10, style.mt3]} color={COLORS.PRIMARY} />
              <Text style={[style.font16, style.boldTxt, style.primaryText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[style.primaryLayout,style.borderRadius5,styles.w150]} onPress={savePostHandler}>
            {saveLoader ? <ActivityIndicator theme={{ colors: { primary: 'white' } }} style={[style.mtb5]}/>  :
                  <Text style={[style.font16, style.p10, style.whiteText,style.centerBox,style.centerItem,style.textCenter]}>Save</Text>}
                </TouchableOpacity>
        </View>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={true} extraScrollHeight={150} keyboardShouldPersistTaps={'handled'}>
            <View style={[style.borderRadius8, style.mtb20]}>

              <View>
                <View style={[style.contentBetween]}>
                  <View style={[style.row]}>
                    {selectedPost && (
                      <FastImage source={selectedPost.senderProfileUrl ? { uri: selectedPost.senderProfileUrl, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable } : require("../../assets/avatarImage.png")} style={styles.senderImg} resizeMode={FastImage.resizeMode.cover} />
                    )}
                    <View>
                      <Text style={[style.font16, style.boldTxt, style.mH10, styles.fontFamily, style.BlackbuttonTxt, style.mt3,styles.width190]}>{selectedPost?.senderName}</Text>
                      <View style={[style.row, style.mH10, style.mt2]}>
                        {selectedPost?.groupName === "Public" ?
                          <Entypo name="globe" style={style.mt2} size={16} color={COLORS.GREY} /> :
                          <FontAwesome name="group" style={style.mt2} size={16} color={COLORS.GREY} />}
                        <Text style={[style.font14, style.mH5, styles.fontFamily, style.grayText, style.mt2]}>{selectedPost?.groupName}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[style.row]}>
                    <Text style={[style.font15, style.grayText, style.mt3]}>{dateFormat(selectedPost?.creationTimestamp)}</Text>
                  </View>
                </View>
                <TextInput style={[style.font16,style.fontFamily,style.mt10,styles.textUnderLine,styles.inputStyleFocused]}
                autoFocus={true}
                underlineColor='transparent'
                contentStyle={{ textDecorationLine: "none" }}
                cursorColor={COLORS.BLACK}
                multiline={true}
                value={content}
                caretHidden={false}
                numberOfLines={10}
                scrollEnabled={true}
                onChangeText={(txt) => { setContent(txt); setContentErr("") }}
                activeUnderlineColor='transparent'
                selectionColor={COLORS.PRIMARY}/>

                {contentErr && <Text style={[style.textDanger]}>{contentErr}</Text>}
                {selectedPost?.mediaUrl && (
                  <View style={[styles.imageContainer]}>
                    <FastImage source={{ uri: selectedPost?.mediaUrl, priority: FastImage.priority.high, cache: FastImage.cacheControl.immutable }} style={[styles.image]} resizeMode={FastImage.resizeMode.cover} />
                  </View>
                )}

                <SwiperFlatList
                  index={-1}
                  paginationStyle={styles.mB40}
                  paginationDefaultColor={"#fff"}
                  showPagination={selectedPost?.attachments?.length > 1 ? true : false}
                  paginationActiveColor={"#fff"}
                  paginationStyleItem={[styles.paginationActiveStyle]}
                  paginationStyleItemInactive={[styles.paginationWidth]}
                  paginationAccessibilityLabels={true}
                  data={selectedPost?.attachments || []}
                  renderItem={renderItem}
                />
              </View>
            </View>
            </KeyboardAwareScrollView>
          </View>
        }
      </View>
    </View>
  )
}
export default EditPost;
const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,

    height: 400
  },
  senderImg: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: 30
  },
  w150: {
    width: Dimensions.get('screen').width * 0.2
  },
  postImg: {
    width: Dimensions.get("screen").width * 1,
    height: Dimensions.get("screen").height * 0.4,
    justifyContent: "center",
    borderRadius: 10,
  },
  imageContainer: {
    width: Dimensions.get('screen').width * 0.90,
    height: Dimensions.get('screen').width * 0.90,
    borderRadius: 10, // Optional: Add rounded corners
    overflow: 'hidden', // Ensures any overflow is hidden
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textUnderLine: {
    textDecorationLine: "none",
    textDecorationColor: "transparent",
    backgroundColor: "transparent"
  },
paginationWidth:{
  width:normalize(5),
  height:normalize(5),
  marginTop: -10,
  color:COLORS.WHITE
},
mB40:{
  marginBottom:normalize(10)
},
paginationActiveStyle:{
  width:10,
  height:10,
  marginBottom:5,
  marginTop:-13,
  color:COLORS.WHITE
},
width190:{
  width:190
},
inputStyleFocused: {
  fontSize:normalize(14),
  fontFamily:'Roboto-Regular',
  width:Dimensions.get("screen").width*0.89,
  minHeight:normalize(20),
  color:COLORS.BLACK,
  backgroundColor:"#EDEDED",
  textDecorationLine:"none",
  textDecorationColor:"transparent", 
  borderRadius:20,
  borderTopRightRadius:20,
  borderTopLeftRadius:20,
  borderColor:'#EDEDED',
  textDecorationLine: "none",
  borderWidth: 0.1,
  padding:normalize(5),
  maxHeight: 200,
  marginBottom:10,
  flex: 1 
},
})