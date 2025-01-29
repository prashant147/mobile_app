import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import COLORS from '../../styles/theme/color'
import { Image } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import MembersContext from "../Members/MembersContext";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getMember } from '../../services/api/auth'
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native'
import { AppConstants } from '../../services/CometUtils'
import Config from 'react-native-config'

const SplashScreen = () => {
    const{ accessToken,setHideChatbot,status,setLoggedInUser } = useContext(MembersContext);
    const navigation = useNavigation();
    const [tokenData, setTokenData] = useState(accessToken||'');
    const [statusData, setStatusData] = useState(status||'');

    useFocusEffect(
        React.useCallback(()=>{
          setHideChatbot(true);
        },[])
      )

      useFocusEffect(
        React.useCallback(()=>{
        const checkStatus = async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            const status = await AsyncStorage.getItem('userStatus');
            const userId = await AsyncStorage.getItem('userId');
            let username = null
            if (status === 'Active') {
              if(userId) {
                username = userId
              }else{
                let mem = await getMember('',accessToken);
                console.log("loggedInUser",JSON.stringify(mem.data.username) );
                 username = mem.data.id
              }
             
              try {       
                CometChatUIKit.login({uid:username,authToken:Config.AUTH_KEY})
               
                .then(user => {
                  console.log('login success',user);
                  navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                })
                .catch(err => {
                  console.log('login error',err);
                  CometChatUIKit.createUser({uid:username}).then(user =>{
                    console.log('create user',user);
                    CometChatUIKit.login({uid:username,authToken:Config.AUTH_KEY})
               
                .then(user => {
                  console.log('login success',user);
                  navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
                })
                .catch(err => {
                  console.log('login error',err);
                 
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                  });
                })
                  }).catch(err => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    });
                  })
                  
                })
    
              } catch (error) {
                console.error('not logged in');
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Main'}],
                });
              }
            } else {
              console.error('User status is not active:', status);
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          } catch (error) {
            console.error('Error while checking user status:', error);
          }
        };
        const timer = setTimeout(checkStatus, 2000);
        return () => clearTimeout(timer);
      }, [])); 


  return (
    <View style={styles.contianer}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
           
          }}>
          <Image source={require('../../assets/saltyDawgLogo.png')} style={styles.logo}/>
        </View>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
     contianer: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
      },
      logo:{
        width:350,
        height:180,
        resizeMode:'contain'
      }
})