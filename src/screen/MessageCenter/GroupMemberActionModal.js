import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import Modal from "react-native-modal";
import style from "../../styles/style";
import COLORS from "../../styles/theme/color";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  deleteSOAMemberFromGroupHandler,
  getCometGroupById,
} from "../../services/CometUtils";
import MembersContext from "../Members/MembersContext";
import { deleteMemberFromGroup } from "../../services/api/auth";

const GroupMemberActionModal = ({
  show,
  setShow,
  user,
  group,
  setGroup,
  groupMembers,
  setGroupMembers,
  actionType,
}) => {
  const { accessToken } = useContext(MembersContext);

  const banGroupMemberHandler = async () => {
    CometChat.banGroupMember(group.guid, user.uid).then(
      (response) => {
        console.log("Member banned successfully:", response);
        const filteruser = groupMembers.filter((item) => item.uid !== user.uid);
        setGroupMembers(filteruser);
        setShow(false);
        getCometGroupById(group.guid, setGroup);
      },
      (error) => {
        console.log("Error banning member:", error);
      }
    );
  };
  const unBanGroupMemberHandler = async () => {
    CometChat.unbanGroupMember(group.guid, user.uid).then(
      (response) => {
        console.log("Member banned successfully:", response);
        const filteruser = groupMembers.filter((item) => item.uid !== user.uid);
        setGroupMembers(filteruser);
        setShow(false);
        getCometGroupById(group.guid, setGroup);
      },
      (error) => {
        console.log("Error banning member:", error);
      }
    );
  };
  const removeGroupMemberHandler = async () => {
    try {
      const filteruser = groupMembers.filter((item) => item.uid !== user.uid);
      const response =  await deleteMemberFromGroup(group.guid, user.uid, accessToken);
      if(response.status === 200){
        setGroupMembers(filteruser);
        setShow(false);
        getCometGroupById(group.guid, setGroup);
      }
    } catch (error) {
      console.log("Error removed member:", error);
    }
  };
  return (
    <View>
      <Modal
        isVisible={show}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        onBackdropPress={() => setShow(false)}
      >
        <View
          style={{
            padding: 20,
            backgroundColor: COLORS.WHITE,
            borderRadius: 8,
          }}
        >
          <TouchableOpacity
            style={[actionType === "ban" && style.mB10]}
            onPress={
              actionType === "ban"
                ? banGroupMemberHandler
                : unBanGroupMemberHandler
            }
          >
            <Text style={[style.font16, style.boldTxt, style.textCapitalize]}>
              {actionType} {user?.name}
            </Text>
          </TouchableOpacity>
          {actionType === "ban" && (
            <TouchableOpacity onPress={removeGroupMemberHandler}>
              <Text style={[style.font16, , style.boldTxt, { color: "red" }]}>
                Kick {user?.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default GroupMemberActionModal;
