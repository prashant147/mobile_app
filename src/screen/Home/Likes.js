import React, { useEffect, useState } from "react";
import { View,Text,StyleSheet, Dimensions,TouchableOpacity, ScrollView,Image } from "react-native";
import Modal from "react-native-modal";
import style from "../../styles/style";
import FastImage from "react-native-fast-image";
import { normalize } from "../../styles/utilities/dimentions";
import AntDesign from "react-native-vector-icons/AntDesign";
import COLORS from "../../styles/theme/color";
import { getPostById } from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Likes = ({item,onClose}) => {
  const token = AsyncStorage.getItem('accessToken');
  const [postsData,setPostsData] = useState([])

  useEffect(() => {
    const getLikes = async() => {
      try {
        const response = await getPostById(item?.id,token)
        if(response.status === 200){
          setPostsData(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getLikes()
  },[])
    return(
      
        <Modal style={styles.modal} isVisible={true} onBackdropPress={onClose} animationIn={'slideInUp'} animationOut={'slideOutDown'}> 
             <View style={[styles.modalContent]}>
                <View style={[style.row,style.centerBox]}>
                <TouchableOpacity onPress={onClose} style={[styles.backIcon,style.mB20]}>
              <AntDesign name="arrowleft" size={25} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <Text style={[style.font16,style.boldTxt,style.mtb20]}>Likes</Text>
                </View>
                <ScrollView>
             {postsData?.recentLikesDtos && postsData?.recentLikesDtos.map((items, index) => (
                <View style={[style.row,style.pH20,style.mtb10]}>
                  {items?.profileUrl ?
                  <FastImage key={index} source={{uri: items?.profileUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable}} style={[styles.likedImg]} resizeMode={FastImage.resizeMode.cover}/>
                  :
                  <Image style={[styles.likedImg]} source={require("../../assets/avatarImage.png")}/>
                  }
                  <Text style={[style.mt10,style.mH10,style.boldTxt,style.font16]}>{items.name}</Text>
                </View>))}
                </ScrollView>

        </View>
        </Modal>
    )    
}
export default Likes;

const styles = StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
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
    }
})