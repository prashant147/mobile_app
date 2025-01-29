import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { scaleHeight, scaleWidth,normalize } from "../styles/utilities/dimentions";
import { FlatList } from "react-native-gesture-handler";
import { useContext, useEffect, useState } from "react";
import COLORS from "../styles/theme/color";
import { Dialogflow_V2 } from 'react-native-dialogflow';
import style from "../styles/style";
import { isTablet } from "react-native-device-info";

import { useNavigation } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import MembersContext from "../screen/Members/MembersContext";

const ChatBot = () => {
    const {hideChatbot,setHideChatbot,loggedInUser } = useContext(MembersContext);
    const [messages, setMessages] = useState<any>([]);
    const [message, setMessage] = useState("");
    const navigation = useNavigation();
    const logo = require('../assets/logo.png');
    useEffect(() => {
        Dialogflow_V2.setConfiguration(
          'dialogflow-api-admin@central-catcher-735.iam.gserviceaccount.com',
          '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5/L2x88t1ESpZ\nEAxx/cpVbK/lncwoYMTkpkZR4g4Y3B0q5jh7HuNI3jHDX3TZA2SUkz/UTty6S2Vd\nTQM+mKQHrjNZ12diI/F2h61jGDJ8vZfmnk0yCgu0fwrB28Q3tv4EbS9Mq3i7avIZ\nntBrKB4+3NsrGcfMlCVB8oFQ3+0ISRyCCowsL1yNyiJy4mMbdtZsGy7iUgDhd9E9\nRN1UNR2iCYQzOkXVkSApirrDVENR6bVEl7b1umBUkjKOV4MqJf0dp8pPtMHfVo2J\nW+Kowcn7SE1KJCdlAklx3D109zKjcmoihuGAPfbGkvh9lpETCfDll8AWmsCsXyhE\npii8Bv4LAgMBAAECggEACZlFV7F5DFIAzoHpMoTiSWWyRPZ6OpHr93pWt2kkSHIr\nwIgLMtzVkXAuP01mOWusaDfv8Q7KONnP9xsUvMlMmzzerOyqCu2coP0VnL9QnmbR\nN8zEYn2+5ueGRZpdq8ZyS7Da4mkYcmEYR5bjs3QUQ4hLI2lRiiRnMS/JLsRadl/r\nhSeuC2+PzfSRpDO6Aos0vANzJSfjDhJsB3Oqym5Wmopp1ID+EFcPAtW07tFGimHi\nF+DB7mpd2y932DogjpQ7RzmlOmP/AIUFBZ6z8QzDNBZuNkaloxsbUJcWS9UxCbs5\nsz2RLYiPn6UThdIp2fAaTTPldOkaCXx12PjLyhNeaQKBgQD6ZADiU0Smd41UK3wW\nBob9iLpDSaz6qgVmQDihhGrZz9ryhbGhnVgc/RE+88ELKctBVo5vhoX29PxRu59S\n1rXsF7HyAVWZ95n4FCxokQkrWWiBwDH+39GNxRATcKEhu5VyJploER3qDT0KtbUi\nOMI9LqEijAh5aMX7+sRXBQmzpwKBgQC+J2HzR9QjZAqHh01ovNh9PUgB0+fKMxi+\n9efcL5NJu9pTfouZzNAiMDrVAbCIo2gpXt9JdwDSnN4h1iCnWp5sV+kLcV9tzSS9\nOI4x7krHL9dLn8eg6DvtoFq3olWlnK+GCg+aWbm1XXlQB+KrN+I2Wm7iGnyPX/f7\n6rg1jmI+/QKBgGLwMQk9Lds5Ujb4F8f8PEriQ/dinV9O32NP7RClajM21qUN/uqF\nadPKi438c0Md+JqQwSeAWF8E3s7M/F+XR7tKgZ3GuTRliglkr0eCR8VBRvI+J4M2\nnW8PdxK3ZnQV0y+P4P4mBVP+dyhMNI6ZLudODY3BF3gh1lmC9SINc4/xAoGAax3Y\nSalu0TjrzYjkjFnFQlehFpZ+fiLmj7wKjrimKeUOifZBQbRkkr3EhnVbMr2KUbPF\n6KaG6h2/7COpZVzg3XtwJigJb9seFRGk2G+55BcJGuq5E+V+zM+GCugBgzeOkN1e\nCL7+pDIxwmmOwJDMd33d9LSi8klHcru4ZUL+CSkCgYBMLPVrZfyeFtIl2l95A6Fb\nJ80FyfdR4CKUA/xUB8QgxalpbfPOY/mwgw2m+DmjJHKqkXtdT1Avgs66x7Eqmvu8\nIoNsFuPyU//Von+SmclbvnS2S+OyfH9L2bhEJGhCyW3p/oHkhDRr1YsFXyPgQUEk\nRLiegcuCGe+JgfLZtxsYvg==\n-----END PRIVATE KEY-----\n',
          'en-US', // Language code
          'central-catcher-735'
        );
      }, []);

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
        }
      };

      useEffect(() => {
        setHideChatbot(true)
      },[])

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
                  source={require("../assets/logo.png")}
                  style={styles.senderImage}
                />
              )}
    
              {item?.fromUser && (
                <View>
                {loggedInUser?.profileUrl ? (
                <Image
                  source={{ uri: loggedInUser?.profileUrl }}
                  style={styles.senderImage}
                /> 
              ) : (
                <Image
                  style={styles.senderImage}
                  source={require("../assets/avatarImage.png")}
                  alt="img"
                  />
              )}
                </View>
              )}
            </View>
          </View>
        );
      };

    return  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.modalContainer}>
                <View style={[styles.modalHeader,style.row]}>
                    <BackButton onPress={()=>{
                         setHideChatbot(true)
                        navigation.goBack();
                    }} color={COLORS.WHITE}></BackButton>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.headerText}>Dawg Bot</Text>
                </View>

                <View style={[styles.chatContainer,style.pt10]}>
    
                    <FlatList
                        data={messages}
                        style={style.contant}
                        renderItem={renderItem}
                    />

                </View>

                <View style={styles.modalContent}>
                    <View style={styles.modalFooter}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your message"
                            placeholderTextColor={COLORS.GREY}
                            onChangeText={text => setMessage(text)}
                            value={message}
                        />
                        <TouchableOpacity onPress={sendMessage}>
                            <Icon
                            name="send"
                            size={20}
                            color="#fff"
                            style={styles.sendButton}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
}
const styles = StyleSheet.create({
    senderImageContainer: {
        paddingHorizontal: 10,
      },
    
      leftAlign: {
        position: 'absolute',
        left: 5, 
        bottom: 10, 
      },
    
      rightAlign: {
        position: 'absolute',
        right:5, 
        bottom: 10,
      },
    
      senderImage: {
        width: normalize(40),
        height:normalize(40),
        borderRadius: 30,
      },
    userMessageText: {
        color: '#000',
        fontSize: 18,
        fontFamily:'Roboto-Regular',
        alignSelf: 'flex-start',
      },
    
      botMessageText: {
        color: '#000',
        fontSize: 18,
        fontFamily:'Roboto-Regular',
        alignSelf: 'flex-end',
      },
    userMessageContainer: {
        backgroundColor: '#f2f8ff',
        alignSelf: 'flex-start',
        marginBottom: 10,
        padding: scaleWidth(10),
        borderRadius: 5,
        marginLeft: 70,
        borderColor: '#ccc',
        borderWidth: 1,
      },
    botMessageContainer: {
        backgroundColor: '#f4f4f4',
        alignSelf: 'flex-end',
        marginBottom: 10,
    
        borderRadius: 5,
        marginRight: 70,
        padding: scaleWidth(10),
        borderColor: '#ccc',
        borderWidth: 1,
      },
    sendButton: {
        backgroundColor: '#0070F0',
        width:50,
        height:40,
        textAlign:'center',
        alignItems:'center',
        alignContent:'center',
        overflow: 'hidden',
        paddingTop:10,
        borderRadius:20,
      },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        padding: 10,
        marginRight: 10,
        color: '#000'
      },
    modalFooter: {
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    logo: {
        width: scaleWidth(50) ,
        height: scaleHeight(50),
        resizeMode: 'contain',
        marginRight:20,
        borderRadius:30
      }, 
    modalContainer:{
        flex:1,
        backgroundColor:COLORS.WHITE
    },
    modalHeader:{
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#435E78',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    headerText: {
        color: COLORS.WHITE,
        fontSize: 22,
        fontFamily:'Roboto-Regular',
        fontWeight: 'bold',
      },
    chatContainer:{
        flex:1,
        paddingHorizontal: 10,
        paddingBottom: 10,
        width:  '100%',
        backgroundColor: '#fff',
    },
    modalContent:{
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        width: '100%',
        marginBottom:40,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
});
export default ChatBot;