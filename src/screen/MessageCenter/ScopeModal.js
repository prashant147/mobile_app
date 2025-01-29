import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import COLORS from "../../styles/theme/color";
import style from "../../styles/style";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { changeSOAGroupUserScopeHandler } from "../../services/CometUtils";
import MembersContext from "../Members/MembersContext";
import { changeGroupUserScope } from "../../services/api/auth";

const ScopeModal = ({
  show,
  setShow,
  user,
  group,
  groupMembers,
  setGroupMembers,
  userScopeInGroup,
}) => {
  const { accessToken } = useContext(MembersContext);
  const [userScope, setUserScope] = useState("");
  const groupRoles = [
    { value: "moderator", label: "Moderator" },
    { value: "participant", label: "Participant" },
  ];
  if (userScopeInGroup === "admin") {
    const admin = { value: "admin", label: "Admin" };
    groupRoles.unshift(admin);
  }
  useEffect(() => {
    setUserScope(user.scope);
  }, [user]);
   const changeMemberScopeHandler = async (item) => {
  try {
    setUserScope(item);
    let scope = null;
      if (item === "admin") {
        scope = 'ADMIN';
      } else if (item === "moderator") {
        scope = 'MODERATOR';
      } else {
        scope = 'PARTICIPANT';
      }
    const filteruser = groupMembers.map((member) =>
      member.uid === user.uid ? { ...member, scope: item } : member
    );    
    const response = await changeGroupUserScope(group.guid, user.uid, scope,accessToken);
  if(response.status === 200){   
    setGroupMembers(filteruser);
    setShow(false);
  }
  } catch (error) {
    setGroupMembers(groupMembers);
        setShow(false);
        console.log("Group member scopped changed failed", error);
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
          <Text
            style={[style.font18, style.textCenter, style.boldTxt, style.mB10]}
          >
            Change Scope
          </Text>
          {groupRoles.map((item) => {
            return (
              <TouchableOpacity
                style={[
                  item.value === userScope && { backgroundColor: "#B0B0B0" },
                  style.pV20,
                ]}
                onPress={() => changeMemberScopeHandler(item.value)}
              >
                <Text
                  style={[
                    style.font16,
                    style.textCenter,
                    item.value === userScope && { fontWeight: "bold" },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    </View>
  );
};

export default ScopeModal;
