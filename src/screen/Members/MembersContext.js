import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MembersContext = createContext();

export const MembersProvider = ({ children }) => {
  const [hideChatbot, setHideChatbot] = useState(false);
  const [hideChatbotMember, setHideChatbotMember] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [loggedInUser, setLoggedInUser] = useState([]);
  const [loggedInUserUpdate, setLoggedInUserUpdate] = useState(false);
  const [messageCenter, setMessageCenter] = useState(false);
  const [status, setStatus] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [notUpdate, setNotUpdate] = useState(false);
  const [dateformatter,setDateFormatter] = useState(null)
  const [notificationCount,setNotificationCount] = useState(null)
  const [msgUnreadCount,setMsgUnreadCount] = useState(null)
  const [msgUnreadCountUpdate,setMsgUnreadCountUpdate] = useState(false)
  const [userTimeZone,setUserTimeZone] = useState('America/New_York')
  const [applicationRole,setApplicationRole] = useState('')
  const [internetStatus,setInternetStatus] = useState(true)
  const [chatMessage,setChatMessage] = useState(null)
  const [postsCount,setPostsCount] = useState(null)
  const [ChatData,setChatData] = useState(null)
  const [loggedInUserID,setLoggedInUserID] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getaccessTokenData = await AsyncStorage.getItem("accessToken");
        const getStatusTokenData = await AsyncStorage.getItem("userStatus");
        const getTimeZoneData = await AsyncStorage.getItem("timeZone");
        const getUserRole = await AsyncStorage.getItem("applicationRole");
        const getUserId = await AsyncStorage.getItem('userId');

        if (getaccessTokenData) {
          setAccessToken(getaccessTokenData);
        }
        if (getStatusTokenData) {
          setStatus(getStatusTokenData);
        }
        if (getTimeZoneData) {
          setUserTimeZone(getTimeZoneData);
        }
        if (getUserRole) {
          setApplicationRole(getUserRole);
        }
        if (getUserId){
          setLoggedInUserID(getUserId)
        }
      } catch (error) {
        console.error("Error retrieving ", error);
      }
    };

    fetchData();
  }, []);




  return (
    <MembersContext.Provider value={{dateformatter,setDateFormatter,
    setHideChatbot,hideChatbot,setHideChatbotMember,notUpdate,setNotUpdate,hideChatbotMember,accessToken,
    loggedInUser,setLoggedInUser,setLoggedInUserUpdate,loggedInUserUpdate,setMessageCenter, messageCenter,
    status,selectedMenu, setSelectedMenu,setAccessToken,ChatData,setChatData,msgUnreadCount,setMsgUnreadCount,notificationCount,setNotificationCount,userTimeZone,setUserTimeZone,setMsgUnreadCountUpdate,msgUnreadCountUpdate,applicationRole,setApplicationRole,internetStatus,setInternetStatus,chatMessage,setChatMessage,postsCount,setPostsCount,loggedInUserID,setLoggedInUserID}}>
      {children}
    </MembersContext.Provider>
  );
};

export default MembersContext;
