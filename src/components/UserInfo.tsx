import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import style from '../styles/style';
import { scaleWidth } from '../styles/utilities/dimentions';
import COLORS from '../styles/theme/color';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

interface UserInfoProps {
  isDark?:boolean
} 
 
const UserInfo: React.FC<UserInfoProps> = ({isDark=false}:any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();
  //onPress={()=>setIsModalVisible(!isModalVisible)}
  return (
    <View style={{position:'relative'}}>
      <TouchableOpacity style={[style.row,isDark?styles.isDarkbox:styles.box]} onPress={()=>navigation.navigate("Profile")}>
          <Image style={[{width:70,height:70,marginBottom:5},style.mr10]} source={require("../assets/UserInfo.png")} resizeMode='contain'></Image>
          <View style={[style.contant]}>
              <Text style={styles.user}>Jack Sparrow</Text>
              <Text style={styles.userRole}>Admin</Text>
          </View>
          {/* <Image style={{height:10}}  source={require("../assets/Vector.png")} resizeMode='contain'></Image> */}
      </TouchableOpacity>
      <Modal
        animationType="none"
        style={styles.modalBox}
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
           <TouchableOpacity style={[styles.modalContainer,style.row,isDark?styles.isDarkbox:styles.box]} onPress={()=>{
            setIsModalVisible(!isModalVisible);
            }}>
              <View style={[style.contant,style.row,style.pH20,style.pV20,{alignContent:'center',alignItems:'center'}]}>
                  <Text style={[styles.user,style.contant]}>Profile</Text>
                  <Icon name="user-o" style={style.mr10} size={20} color={COLORS.WHITE} />
              </View>
              
          </TouchableOpacity>
      </Modal>
    </View>
  );
};
// transparent={true}
const styles = StyleSheet.create({
    modalBox:{

    },
    modalContainer:{
     position:'absolute',
     width:(Dimensions.get("screen").width - 180) / 3,
     right:scaleWidth(0),
     top:55,
     paddingVertical:10,
     backgroundColor:COLORS.LIGHT_PRIMARY,
    },
    isDarkbox:{
      borderColor:COLORS.LIGHT_PRIMARY,
      backgroundColor:COLORS.LIGHT_PRIMARY,
      borderWidth:1,
      borderRadius:10,
      marginHorizontal:10,
      alignContent:'center',
      alignItems:'center'
    },
    box:{
        borderColor:COLORS.WHITE,
        borderWidth:1,
        borderRadius:10,
        marginHorizontal:10,
        marginVertical:20,
        alignContent:'center',
        alignItems:'center'
    },
    user:{
        fontSize:scaleWidth(20),
        fontFamily:'Roboto-Regular',
        color:COLORS.WHITE,
        fontWeight:'bold'
    },
    userRole:{
        fontSize:scaleWidth(12),
        fontFamily:'Roboto-Regular',
        color:COLORS.YELLOW
    }
 })
export default UserInfo;

