import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { CometChatMessages } from "@cometchat/chat-uikit-react-native";
import style from "../../../styles/style";


const ChatDetailsComponent = ({
  user,
  group,
  onBack,
  selectedGroupMembers,
  selectedGroupIsAdminOnly,
  loggedInUser,
  messageListConfiguration,
  CustomHeaderComponent
}) => {
  return (
    <View style={[style.contant]}>
      <CometChatMessages
        {...(user ? { user } : { group })}
        messageHeaderConfiguration={{
          onBack,
        }}
        messageComposerConfiguration={{
          keyboardAvoidingViewProps: {
            behavior: Platform.OS === "ios" ? "padding" : "height",
          },
        }}
        MessageHeaderView={CustomHeaderComponent}
        hideMessageComposer={
          group && selectedGroupIsAdminOnly
            ? !selectedGroupMembers?.includes(loggedInUser.id)
            : false
        }
        messageListConfiguration={messageListConfiguration}
      />
      {group && selectedGroupIsAdminOnly && !selectedGroupMembers?.includes(loggedInUser.id) && (
        <Text style={[style.primaryText, style.textCenter, style.pV20, styles.font12]}>
          Only admins can send messages
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    font12:{
        fontSize:12
    }
})
export default ChatDetailsComponent;
