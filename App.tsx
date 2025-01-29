import React, { useEffect, useState } from 'react';
import Navigation from './src/routes/Navigation';
import { Provider } from 'react-redux';
import { store } from './src/services/redux/store';
import { Dimensions, KeyboardAvoidingView, PermissionsAndroid, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import style from './src/styles/style';
import Scroll from "./src/components/ScrollText/scroll";
import {MembersProvider} from './src/screen/Members/MembersContext';
import { Keyboard } from 'react-native';
import COLORS from './src/styles/theme/color';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import { CometChatLocalize, CometChatUIEventHandler, CometChatUIKit, UIKitSettings } from '@cometchat/chat-uikit-react-native'
import { CometChat } from '@cometchat/chat-sdk-react-native';
import{AppConstants} from './src/services/CometUtils'
import Config from 'react-native-config';
import perf from "@react-native-firebase/perf"

const App: React.FC = () => {
// Initialize CometChat
const getPermissions = async () => {
  try {
    await messaging().requestPermission();
    console.log('Messaging permission granted');
    if (Platform.OS === 'android') {
         await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );


      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      const allPermissionsGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (allPermissionsGranted) {
        console.log('All permissions granted');
      } else {
        console.log('Some permissions were not granted');
      }
    }
  } catch (error) {
    crashlytics().log(error);
  }
};

useEffect(() => {
const callpermissions = async ()=>{
  await getPermissions();

}
callpermissions()
 
 
  CometChatUIKit.init({
    appId: Config.APP_ID,
    authKey: Config.AUTH_KEY,
    region: Config.REGION,
  })
    .then(() => {
      CometChatLocalize.setLocale("en");
      try{CometChat.setDemoMetaInfo(metaInfo)}catch(err){}
      if (CometChat.setSource) {
        CometChat.setSource('ui-kit', Platform.OS, 'react-native');
      }
    })
    .catch(() => {
      return null;
    });
    

}, []);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {
        crashlytics().log(error);
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      }
    );
    perf().setPerformanceCollectionEnabled(true)
    crashlytics().setCrashlyticsCollectionEnabled(true);
    crashlytics().log("Login");
    // Request permission for notifications (optional)
   

    // Clean up listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <Provider store={store}>
        <StatusBar animated={true} hidden={false} backgroundColor={COLORS.PRIMARY} />
      <MembersProvider>
        <SafeAreaView style={[style.contant,style.primaryLayout]}>
        
        <KeyboardAvoidingView
          style={[style.contant]}
          // behavior={Platform.OS=="ios"?"padding":'height'}
          keyboardVerticalOffset={0}
        >
          <Navigation isKeyboardOpen={isKeyboardOpen}/>
     
        </KeyboardAvoidingView>
      </SafeAreaView>
      </MembersProvider>
    </Provider>
  );
};

export default App;
