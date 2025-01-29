import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CometChatAvatar } from "@cometchat/chat-uikit-react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import style from "../../../styles/style";
import { normalize } from "../../../styles/utilities/dimentions";
import { sliceString } from "../../../styles/utilities/variables";


const CustomHeaderComponent = ({user,group,onBackHandler,groupDetailsHandler,userDetailsHandler}) => {
    const image = user ? user.getAvatar() : group?.getIcon();
    const name = user ? user.getName() : group?.getName();

    return (
      <View style={[style.primaryLayout,style.row,style.centerBox,style.pH20,style.pV20,style.mb5]}>
        <TouchableOpacity onPress={onBackHandler}>
          <AntDesign name="arrowleft" size={normalize(20)} color={"white"} />
        </TouchableOpacity>
        <View style={[style.row, style.mH10, style.centerBox]}>
          <CometChatAvatar image={{ uri: image }} name={name} />
          <View style={[style.mH10]}>
            <Text style={[styles.chatName]}>{sliceString(name,20)}</Text>
            {group && (
              <Text style={[styles.colorWhite]}>
                {group.getMembersCount()} members
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.mlAuto]}
          onPress={() =>group ? groupDetailsHandler(group, "notshow") : userDetailsHandler(user)}>
          <Feather name="info" size={normalize(20)} color={"white"} />
        </TouchableOpacity>
      </View>
    );
  };

const styles = {
  chatName: {
    color: "white",
    fontSize: 18,
  },
  colorWhite: {
    color: "white",
  },
  mlAuto: {
    marginLeft: "auto",
  },
};

export default CustomHeaderComponent;
