import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions, Keyboard, StyleSheet } from "react-native";
import {
  CometChatImageBubble,
  CometChatFileBubble,
  CometChatAudioBubble,
  CometChatVideoBubble,
  FileBubbleStyleInterface,
} from "@cometchat/chat-uikit-react-native";
import { normalize } from "../../../styles/utilities/dimentions";
import { customDateSeparatorPattern } from "./CometVariables";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { sliceString } from "../../../styles/utilities/variables";
import style from "../../../styles/style";

const CustomBubbleView =({ message }) => {
  const isKeyboardOpen = useRef(false); // Using ref to store keyboard state

  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      isKeyboardOpen.current = true;
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      isKeyboardOpen.current = false;
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);


  let fileStyle: FileBubbleStyleInterface = {
    backgroundColor: "transparent",
    titleFont: { fontSize: normalize(14) },
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case CometChat.MESSAGE_TYPE.TEXT:
        return <Text style={[style.font16]}>{isKeyboardOpen ? sliceString(message.data.text,60) : message.data.text}</Text>;
      case CometChat.MESSAGE_TYPE.IMAGE:
        return (
          <CometChatImageBubble
            imageUrl={{ uri: message.data.url }}
            style={styles.threadMedia}
          />
        );
      case CometChat.MESSAGE_TYPE.AUDIO:
        return (
          <CometChatAudioBubble
            audioUrl={message.data.url}
            title={message.data.name}
          />
        );
      case CometChat.MESSAGE_TYPE.VIDEO:
        return (
          <CometChatVideoBubble
            videoUrl={message.data.url}
            style={styles.threadMedia}
          />
        );
      case CometChat.MESSAGE_TYPE.FILE:
        return (
          <CometChatFileBubble
            fileUrl={message.data.url}
            style={fileStyle}
            title={message.data.name}
          />
        );
      case CometChat.MESSAGE_TYPE.CUSTOM:
        return <Text style={[style.font14]}>Custom message</Text>;
      case "extension_poll":
        return (
          <View>
            <Text style={[style.font18]}>
              {sliceString(message.data.text, 15)}
            </Text>

            {message.metadata?.["@injected"]?.extensions?.polls?.results?.options && 
              Object.entries(message.metadata?.["@injected"]?.extensions?.polls?.results?.options).map(([key, option]) => (
                <View key={key} style={[styles.threadPollOptions, style.row, style.between]}>
                  <Text style={[style.font16]}>
                    {sliceString(option.text, 10)}
                  </Text>
                  <Text style={[style.font16]}>
                    {sliceString(option.count, 10)}
                  </Text>
                </View>
              ))}
            <Text style={[style.font16]}>
              {message.metadata?.["@injected"]?.extensions?.polls?.results?.total} people voted
            </Text>
          </View>
        );
      default:
        return <Text style={[style.font14]}>Unsupported message type</Text>;
    }
  };
  const isTextOrAudioOrFile =
  message.type === CometChat.MESSAGE_TYPE.TEXT ||
  message.type === CometChat.MESSAGE_TYPE.AUDIO ||
  message.type === CometChat.MESSAGE_TYPE.FILE ||
  message.type === "extension_poll";

  const isImage = message.type === CometChat.MESSAGE_TYPE.IMAGE;
  const isText = message.type === CometChat.MESSAGE_TYPE.TEXT;
  const isPoll = message.type === 'extension_poll';
  return (
    <View style={[ isTextOrAudioOrFile && styles.messageBg,{
        maxWidth: isImage ? Dimensions.get('screen').width * 0.3 :
        isText ?Dimensions.get('screen').width * 0.7  : normalize(180)},isKeyboardOpen &&isPoll &&{height:Dimensions.get('screen').width * 0.3} ]}
    >
        {renderMessageContent()}
        <Text style={[style.font12,style.row,style.mt3,style.alignSelfEnd]}>{customDateSeparatorPattern(message.sentAt)}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
    messageBg:{
        backgroundColor: '#f5f5f5', 
        padding: 5 ,
        borderRadius:8
      },
    threadMedia:{
        borderRadius:8,
        height: Dimensions.get('screen').width * 0.35,
        width: Dimensions.get('screen').width * 0.35,
      },
      threadPollOptions:{
        marginVertical:normalize(5),
        backgroundColor:'white',
        borderRadius:5,
        padding:normalize(5)
      },
});

export default CustomBubbleView;
