import { ActivityIndicator, Text, View } from "react-native";
import COLORS from "../../../styles/theme/color";
import style from "../../../styles/style";
import moment from "moment";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCometPushNotificationPreferences } from "../../../services/CometUtils";


const STORAGE_KEY = 'comet_notification_preferences';

export const fetchAndStorePreferences = async () => {
  try {
    const response = await getCometPushNotificationPreferences();
    const preferences = {
      mutedGuids: response?.['user-settings']?.chat?.muted_guids || {},
      mutedUids: response?.['user-settings']?.chat?.muted_uids || {},
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return preferences;
  } catch (err) {
    console.error('Error fetching notification preferences:', err);
    return null;
  }
};

export const updateStoredPreferences = async (type, uids, guids, timestamp) => {
    console.log('timestamp',timestamp);
    
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let preferences = storedData ? JSON.parse(storedData) : { mutedGuids: {}, mutedUids: {} };
  
      if (type === 'mute') {
        if (guids) {
          guids.forEach(guid => preferences.mutedGuids[guid] = new Date(Number(timestamp)).toISOString());
        }
        if (uids) {
          uids.forEach(uid => preferences.mutedUids[uid] = new Date(Number(timestamp)).toISOString());
        }
      } else if (type === 'unmute') {
        if (guids) {
          guids.forEach(guid => delete preferences.mutedGuids[guid]);
        }
        if (uids) {
          uids.forEach(uid => delete preferences.mutedUids[uid]);
        }
      }
  
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      console.log('Updated Local Preferences:', preferences);
      return preferences;
    } catch (err) {
      console.error('Error updating stored preferences:', err);
    }
  };
  

export const getStoredPreferences = async () => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (err) {
    console.error('Error retrieving stored preferences:', err);
    return null;
  }
};

export const clearStoredPreferences = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing stored preferences:', err);
  }
};


export const GetLoadingStateView = () => {
    return (
        <View style={[style.contant, style.row, style.centerBox, style.centerItem]}>
            <ActivityIndicator color={COLORS.PRIMARY} size={"large"} />
        </View>
    );
};
export const EmptyStateView = () => {
    return (
        <View style={[style.contant, style.row, style.centerBox, style.centerItem]}>
            <Text style={[style.font18]}>No chats found </Text>
        </View>
    );
};
export const EmptyGroupsStateView = () => {
    return (
        <View style={[style.contant, style.row, style.centerBox, style.centerItem]}>
            <Text style={[style.font18]}>No groups found </Text>
        </View>
    );
};

export const generateMessageDateString = (message: CometChat.BaseMessage): any => {
    const timeStamp = message['sentAt'];
    return moment(timeStamp * 1000).calendar(null, {
        sameDay: "h:mm A",         // Today
        lastDay: "[Yesterday]",   // Yesterday
        lastWeek: "ddd",          // Last week
        sameElse: "MMM DD, YYYY",   // Everything else
    });
};
export const customDateSeparatorPattern = (date: number) => {
    return moment(date * 1000).calendar(null, {
        sameDay: "h:mm A",         // Today
        lastDay: "[Yesterday]",   // Yesterday
        lastWeek: "ddd",          // Last week
        sameElse: "MMM DD, YYYY",   // Everything else
    });
}