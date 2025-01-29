import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { CometChatAvatar } from "@cometchat/chat-uikit-react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import COLORS from "../../../../styles/theme/color";
import { normalize } from "../../../../styles/utilities/dimentions";

const GroupListItemComponent = ({ group, onPress }) => {
  const groupIcon = group?.getIcon() ? { uri: group.getIcon() } : undefined;
  const groupName = group?.getName();
  const membersCount = group?.getMembersCount();
  const isPublic = group?.getType() === "public";

  const viewStyleGrp: StyleProp<ViewStyle> = {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderRadius: 10,
    margin: 2,
  };
  return (
    <TouchableOpacity style={viewStyleGrp} onPress={() => onPress(group)}>
      <CometChatAvatar style={styles.avatar} image={groupIcon} name={groupName} />
      <View style={styles.details}>
        <View style={styles.nameContainer}>
          <Text style={styles.groupName}>{groupName}</Text>
          {isPublic && <MaterialIcons name="public" size={normalize(16)} color={COLORS.PRIMARY} />}
        </View>
        <Text style={styles.membersText}>Members: {membersCount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  avatar: {
    width: 40,
    height: 40,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupName: {
    fontWeight: "bold",
    color: "black",
    flexShrink: 1, // Prevents text overflow issues
  },
  membersText: {
    color: "#667",
    fontSize: 14,
  },
});

export default React.memo(GroupListItemComponent);
