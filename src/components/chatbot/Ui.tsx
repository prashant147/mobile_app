import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import COLORS from '../../styles/theme/color';
import { scaleHeight, scaleWidth } from '../../styles/utilities/dimentions';

import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MembersContext from '../../screen/Members/MembersContext';
import crashlytics from '@react-native-firebase/crashlytics';

const isTablet = DeviceInfo.isTablet();
const ChatWidget = () => {
  const {hideChatbot,setHideChatbot } = useContext(MembersContext);
  const isMore = useSelector(state => state.isMore)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const logo = require('../../assets/logo.png');
  const navigation = useNavigation();


  const toggleModal = () => {
    setHideChatbot(true)
    navigation.navigate("ChatBot")
    /*
    if (isModalVisible) {
      setIsModalVisible(false);
    } else {
      setIsModalVisible(true);
    }
    */
  };
  const sendMessage = async () => {
    
    let mess = [...messages,{
      fromUser:true,
      text:message
    }];
    setMessage("")
    try {
      // Send user message to Dialogflow
      Dialogflow_V2.requestQuery(message,(result:any)=>{
        const botMessage = result.queryResult.fulfillmentText;
       
         mess = [...mess,{
          fromUser:false,
          text:botMessage
        }];
        setMessages(mess);
        // Scroll to the bottom of the ScrollView
        scrollViewRef.current?.scrollToEnd({ animated: true });
      },(err)=>{
        console.log("Error",err)
      });

  
    } catch (error) {
      console.error('Dialogflow error:', error);
      crashlytics().log(error);
    }
  };


  const renderItem = ({ item, index }: any) => {
    return (
      <View key={index}>
        <View
          style={
            item?.fromUser
              ? styles.botMessageContainer
              : styles.userMessageContainer
          }
        >
          <Text
            style={
              item?.fromUser ? styles.userMessageText : styles.botMessageText
            }
          >
            {item?.text}
          </Text>
        </View>
        <View
          style={[
            styles.senderImageContainer,
            item?.fromUser ? styles.rightAlign : styles.leftAlign,
          ]}
        >
          {!item?.fromUser && (
            <Image
              source={require("../../assets/logo.png")}
              style={styles.senderImage}
            />
          )}

          {item?.fromUser && (
            <Image
              source={require("../../assets/UserImg.png")}
              style={styles.senderImage}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <>
    <View style={[styles.container]}>
      {/* {
        !isMore && !hideChatbot && <TouchableOpacity style={[isTablet ? styles.ChatBot: styles.ChatBotMobile]} onPress={toggleModal}>
        <Image source={logo} resizeMode='contain' style={[styles.ChatBotLogo]} />
        <Text style={[isTablet?style.font16:style.font12,style.primaryText,style.boldTxt]}>Dawg Bot</Text> 
      </TouchableOpacity>
      } */}
     </View>
  
    </>
  );
};

const styles = StyleSheet.create({ 
  modalContainer:{

  },
  modalHeader:{

  },
  chatContainer:{

  },
  modalContent:{

  },
  container: {
    position: 'absolute',
    bottom: scaleHeight(isTablet?20:30),
    right: scaleWidth(20),
    zIndex: 1,
    borderWidth:0.5,
    borderRadius:100,
    borderColor:COLORS.PRIMARY
  },
  ChatBotLogo:{
    width:scaleWidth(45),
    height:scaleHeight(45),
  },
  ChatBot:{
    backgroundColor:"#fff",
    paddingHorizontal:15,
    paddingVertical:10,
    alignContent:'center',
    alignItems:'center',
    borderRadius:100,


    shadowColor: '#000',
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,

    // Specific to Android
    elevation: 10,

  },
  ChatBotMobile:{
    backgroundColor:"#fff",
    paddingHorizontal:12,
    paddingVertical:8,
    alignContent:'center',
    alignItems:'center',
    borderRadius:100,
    zIndex:1,

    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,

    // Specific to Android
    elevation: 10,

  },
  logo: {
    width: scaleWidth(50) ,
    height: scaleHeight(50),
    resizeMode: 'contain',
    backgroundColor:'#fff',
    marginRight:20
  },
});

export default ChatWidget;
