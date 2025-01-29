import React, { useEffect, useState, useMemo, useCallback, memo, useRef } from 'react';
import { View, Text } from 'react-native';
import { 
  CometChatConversations, 
  CometChatConversationUtils 
} from '@cometchat/chat-uikit-react-native';
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import moment from 'moment';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { EmptyStateView, fetchAndStorePreferences, GetLoadingStateView, getStoredPreferences } from './CometVariables';

const CometchatConversationsComponents = ({ handleConversationPress }) => {
  const preferencesRef = useRef(null);
  console.log('re rendered conversations');
  

  useEffect(() => {
    const loadPreferences = async () => {
      const storedPreferences = await getStoredPreferences();
      if (storedPreferences) {
        preferencesRef.current = storedPreferences;
      } else {
        const fetchedPreferences = await fetchAndStorePreferences();
        preferencesRef.current = fetchedPreferences;
      }
    };

    loadPreferences();
  }, []);

  const isConversationMuted = (conversation) => {
    if (!preferencesRef.current) return { isMutedGroup: false, isMutedUser: false };

    const { mutedGuids, mutedUids } = preferencesRef.current;

    if (conversation.getConversationType() === 'group') {
      return { isMutedGroup: mutedGuids.hasOwnProperty(conversation.getConversationWith().guid.toString()), isMutedUser: false };
    }
    if (conversation.getConversationType() === 'user') {
      return { isMutedGroup: false, isMutedUser: mutedUids.hasOwnProperty(conversation.getConversationWith().uid.toString()) };
    }

    return { isMutedGroup: false, isMutedUser: false };
  };

  const generateDateString = useCallback((conversation) => {
    const lastMessage = CometChatConversationUtils.getLastMessage(conversation);
    const conversationWith = conversation.getConversationWith();
    const timeStamp = (lastMessage?.updatedAt || conversationWith?.createdAt || conversationWith?.lastActiveAt) ?? 0;

    const dateString = moment(timeStamp * 1000).calendar(null, {
      sameDay: "h:mm A",
      lastDay: "[Yesterday]",
      lastWeek: "ddd",
      sameElse: "MMM DD, YYYY",
    });

    const { isMutedGroup, isMutedUser } = isConversationMuted(conversation);

    return (
      <View style={[style.row, style.centerBox]}>
        {isMutedGroup && <FontAwesome name="bell-slash" size={16} color="gray" style={[style.mH10]} />}
        {isMutedUser && <FontAwesome name="bell-slash" size={16} color="gray" style={[style.mH10]} />}
        <Text style={style.font14}>{dateString}</Text>
      </View>
    );
  }, []);

  return (
    <CometChatConversations
      onItemPress={handleConversationPress}
      title=""
      hideSubmitIcon
      conversationsStyle={{ backgroundColor: "#f3f3f3" }}
      listItemStyle={{ backgroundColor: "#f3f3f3" }}
      badgeStyle={{ backgroundColor: COLORS.PRIMARY }}
      LoadingStateView={GetLoadingStateView}
      emptyStateText="No chats found"
      EmptyStateView={EmptyStateView}
      datePattern={generateDateString}
    />
  );
};

export default memo(CometchatConversationsComponents);
