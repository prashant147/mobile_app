import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import Modal from "react-native-modal";
import COLORS from "../../styles/theme/color";
import MembersContext from "../Members/MembersContext";
import style from "../../styles/style";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  deleteSOAMemberFromGroupHandler,
  deleteSOAGroupHandler,
  leaveSOAMemberFromGroupHandler,
} from "../../services/CometUtils";
import { leaveGroup } from "../../services/api/auth";

const LeaveOrDeleteGroupModal = ({
  show,
  setShow,
  selectedGroup,
  type,
  setSelectedGroup,
  setSelectedGroupInfo,
  setShowListModal,
}) => {
  const { loggedInUser, accessToken } = useContext(MembersContext);

  const deleteGroupHandler = async () => {
   await deleteSOAGroupHandler(selectedGroup.guid, accessToken);
    setShow(false);
    setSelectedGroup(null);
    setSelectedGroupInfo(null);
  };
  const leaveGroupHandler = async () => {
    CometChat.leaveGroup(selectedGroup.guid).then(
      (hasLeft) => {
        console.log("Group left successfully:", hasLeft);
        leaveSOAMemberFromGroupHandler(
          selectedGroup.guid,
          loggedInUser.id,
          accessToken
        );
      },
      (error) => {
        console.log("Group leaving failed with exception:", error);
      }
    );
    setShow(false);
    setSelectedGroup(null);
    setSelectedGroupInfo(null);
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
          {type === "leave" ? (
            <View>
              {selectedGroup && selectedGroup?.owner === loggedInUser.id ? (
                <View>
                  <Text style={[style.font16, style.boldTxt]}>
                    Transfer Ownership
                  </Text>
                  <Text style={[style.font16, style.mtb10]}>
                    You are the group owner, please transfer the ownership to a
                    member before leaving the group
                  </Text>
                  <View
                    style={[
                      style.row,
                      { columnGap: 10, justifyContent: "flex-end" },
                    ]}
                  >
                    <TouchableOpacity onPress={() => setShow(false)}>
                      <Text style={[style.font16, style.primaryText]}>
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {setShow(false);setTimeout(() => {
                      setShowListModal(true)
                    }, 500)}}>
                      <Text style={[style.font16, style.primaryText]}>
                        CONFIRM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={[style.font16, style.boldTxt]}>
                    Please Confirm
                  </Text>
                  <Text style={[style.font16, style.mtb10]}>
                    Are you sure you want to leave the group?
                  </Text>
                  <View
                    style={[
                      style.row,
                      { columnGap: 10, justifyContent: "flex-end" },
                    ]}
                  >
                    <TouchableOpacity onPress={() => setShow(false)}>
                      <Text style={[style.font16, style.primaryText]}>
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={leaveGroupHandler}>
                      <Text style={[style.font16, style.primaryText]}>
                        CONFIRM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={[style.font16, style.boldTxt]}>Please Confirm</Text>
              <Text style={[style.font16, style.mtb10]}>
                Are you sure you want to delete?
              </Text>
              <View
                style={[
                  style.row,
                  { columnGap: 10, justifyContent: "flex-end" },
                ]}
              >
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={[style.font16, style.primaryText]}>CANCEL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteGroupHandler}>
                  <Text style={[style.font16, style.primaryText]}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default LeaveOrDeleteGroupModal;
