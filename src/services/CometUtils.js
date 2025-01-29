import { CometChat } from "@cometchat/chat-sdk-react-native";
import {addMembersToGroup,changeGroupUserScope,deleteGroupById,deleteMemberFromGroup, leaveGroup, transferGroupOwnership,} from "./api/auth";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { updateStoredPreferences } from "../screen/MessageCenter/Components/CometVariables";

export const AppConstants = {
  appID: "261108fbd0d0709c",
  region: "us",
  authKey: "80ef8526907d1af329e0a337c1cf1cff810ca57f",
};

export const getLoggedInUserUnreadCount = async (setMsgUnreadCount,setMsgUnreadCountUpdate,setAppFocused) => {
  CometChat.getUnreadMessageCount().then((array) => {
      const groupUnreadCount = Object.values(array.groups).reduce((acc, count) => acc + count,0);
      const userUnreadCount = Object.values(array.users).reduce((acc, count) => acc + count,0);
      const totalUnreadCount = groupUnreadCount + userUnreadCount;
      setMsgUnreadCount(totalUnreadCount);
      setMsgUnreadCountUpdate(false);
      if(setAppFocused){
        setAppFocused(false)
      }

      if(Platform.OS === 'ios'){
        if (totalUnreadCount > 0 ) {
            PushNotificationIOS.setApplicationIconBadgeNumber(totalUnreadCount);
        }else{
            PushNotificationIOS.setApplicationIconBadgeNumber(0);

        }
    }else if (Platform.OS === 'android') {
      const deviceManufacturer = DeviceInfo.getBrand();          
      if(totalUnreadCount > 0 ){
          if (deviceManufacturer.toLowerCase() !== 'samsung') {
            PushNotification.setApplicationIconBadgeNumber(totalUnreadCount);
          }
            
        }else{
          if (deviceManufacturer.toLowerCase() !== 'samsung') {
            PushNotification.setApplicationIconBadgeNumber(0);
        }
      }
    }
    },
    (error) => {
      console.log("Error in getting message count", error);
    }
  );
};
export const getCometGroupById = async (GUID, setSelectedGroup) => {
  CometChat.getGroup(GUID).then(
    (group) => {
      console.log("Group details fetched successfully:", group);
      if (setSelectedGroup) {
        setSelectedGroup(group);
      }
    },
    (error) => {
      console.log("Group details fetching failed with exception:", error);
    }
  );
};
export const deleteSOAMemberFromGroupHandler = async (guid,uid,accessToken) => {
  try {
    const response = await deleteMemberFromGroup(guid, uid, accessToken);
    if (response.status === 200) {
      console.log("deleteMemberFromGroup", response.data);
    }
  } catch (error) {
    console.log("error deleteMemberFromGroup", error);
  }
};
export const leaveSOAMemberFromGroupHandler = async (guid,uid,accessToken) => {
  try {
    const response = await leaveGroup(guid, uid, accessToken);
    if (response.status === 200) {
      console.log("leaveSOAMemberFromGroupHandler", response.data);
    }
  } catch (error) {
    console.log("error leaveSOAMemberFromGroupHandler", error);
  }
};
export const deleteSOAGroupHandler = async (guid, accessToken) => {
  try {
    console.log("deleteGroupById Loading...");

    const response = await deleteGroupById(guid, accessToken);
    if (response.status === 200) {
      console.log("deleteGroupById", response.data);
    }
  } catch (error) {
    console.log("error deleteGroupById", error);
  }
};
export const changeSOAGroupUserScopeHandler = async (guid,uid,scopeChangedTo,accessToken) => {
  try {
    const response = await changeGroupUserScope(
      guid,
      uid,
      scopeChangedTo,
      accessToken
    );
    if (response.status === 200) {
      console.log("changeGroupUserScope", response.data);
    }
  } catch (error) {}
};

export const addSOAMembersToGroupHandler = async (guid, users, accessToken) => {
  try {
    const response = await addMembersToGroup(guid, users, accessToken);
    if (response.status === 200) {
      console.log("addMembersToGroup", response.data);
    }
  } catch (error) {
    console.log("addMembersToGroup error", error);
  }
};
export const transferSOAGroupOwnership = async (guid, user, accessToken) => {
  try {
    const response = await transferGroupOwnership(guid, user, accessToken);
    if (response.status === 200) {
      console.log("transferSOAGroupOwnership", response.data);
    }
  } catch (error) {
    console.log("transferSOAGroupOwnership error", error);
  }
};
export const getCometPushNotificationPreferences = async ()=>{
 return CometChat.callExtension('push-notification', 'GET', 'v2/user-settings', null).then(response => {
    console.log('getPushNotification Preferences Success',JSON.stringify(response));
    return response
  })
  .catch(error => {
      console.log('getPushNotification Preferences Error',JSON.stringify(error));
  });
  }

export const muteUnMuteCometPushNotifications = async (type,uids, guids, timestamp) => {
  
  const payload = {
    ...(uids && { "uids": uids }),
    ...(guids && { "guids": guids }),
    ...(type === 'mute' && {"timeInMS": timestamp})
  };
  
  try {
    const response = await CometChat.callExtension("push-notification", "POST", `v2/${type}-chat`, payload);
    console.log(`${type}d ${guids ? 'Group' : 'User'} Successfully`, response);
    
    await updateStoredPreferences(type, uids, guids, timestamp);
  } catch (error) {
    console.error(`${type} Error`, error);
  }
 
};
export const blockUnblockUser = async (type, memberId, setSelectedMember) => {
  const action = type === 'block' ? CometChat.blockUsers : CometChat.unblockUsers;
  
  return action([memberId]).then(
    list => {
      console.log(`users list ${type}ed`, { list });
      return CometChat.getUser(memberId).then(
        (user) => {
          setSelectedMember(user);
          return user;
        },
        (error) => {
          console.error("User fetching failed with error:", error);
          throw error; // Re-throw the error to be caught by the outer promise
        }
      );
    },
    error => {
      console.log(`${type}ing user fails with error`, error);
      throw error; // Re-throw the error to be caught by the outer promise
    }
  );
};
