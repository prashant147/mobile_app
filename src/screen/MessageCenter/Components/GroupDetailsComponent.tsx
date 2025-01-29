import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import React from 'react'
import style from '../../../styles/style';
import { CometChatAvatar } from '@cometchat/chat-uikit-react-native';
import { normalize, scaleHeight } from '../../../styles/utilities/dimentions';
import COLORS from '../../../styles/theme/color';
import { muteUnMuteCometPushNotifications } from '../../../services/CometUtils';
import moment from 'moment';
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

const GroupDetailsComponent = ({closeGroupDetailsHandler,selectedGroup,groupDetailsHandler,userRoleInGroup,addMemberModalHandler,bannedMembersHandler,setMuteToggleGrp,muteToggleGrp,editGroupHandler,loggedInUser,leaveOrDeleteGroupHandler}) => {
  return (
    <View style={[style.contant, style.pV10, style.pH20, style.mt15]}>
    <View style={[style.row, style.centerBox]}>
      <TouchableOpacity onPress={closeGroupDetailsHandler}>
        <AntDesign name="close" size={25} color="#6851d6" />
      </TouchableOpacity>
      <Text style={[style.font20, style.pH20, style.boldTxt]}>Details</Text>
    </View>
    <View style={[style.row, style.centerBox, style.mt30]}>
      <CometChatAvatar
        image={{ uri: selectedGroup?.getIcon() }}
        name={selectedGroup?.getName()}
        style={{ height: 45, width: 45 }}
      />
      <Text style={[style.font16, style.boldTxt, style.mH10]}>
        {selectedGroup?.getName()}
      </Text>
    </View>
    <View style={[style.mt30, style.column, { rowGap: normalize(25) }]}>
      <TouchableOpacity style={[style.row, style.centerBox, style.between]} onPress={() => {groupDetailsHandler(selectedGroup, "show");}}>
        <Text style={[style.font16, style.boldTxt, style.mH10]}>View Members</Text>
        <Entypo name="chevron-thin-right" size={15} color="#000" />
      </TouchableOpacity>
      {userRoleInGroup?.toLowerCase() === "admin" && (
        <TouchableOpacity style={[style.row, style.centerBox, style.between]} onPress={addMemberModalHandler}>
          <Text style={[style.font16, style.boldTxt, style.mH10]}>Add Members</Text>
          <Entypo name="chevron-thin-right" size={15} color="#000" />
        </TouchableOpacity>
      )}
      {(userRoleInGroup?.toLowerCase() === "admin" ||
        userRoleInGroup?.toLowerCase() === "moderator") && (
        <TouchableOpacity style={[style.row, style.centerBox, style.between]} onPress={bannedMembersHandler}>
          <Text style={[style.font16, style.boldTxt, style.mH10]}>Banned Members</Text>
          <Entypo name="chevron-thin-right" size={15} color="#000" />
        </TouchableOpacity>
      )}
    </View>
    <View style={[styles.border]}/>
    <View>
      <View style={[style.mtb20]}>
        <Text style={[style.font14, { color: COLORS.GREY }]}>
          Notifications
        </Text>
        <View style={[style.row, style.centerBox, style.mt20, style.between]}>
          <Text style={[style.font16, style.boldTxt, style.mH10]}>
            Mute Notifications
          </Text>
          <Switch
            onValueChange={() => {
              setMuteToggleGrp((prev) => !prev);
              if (!muteToggleGrp) {
                muteUnMuteCometPushNotifications('mute',null,[selectedGroup?.getGuid()],moment().add(100, 'year').valueOf().toString())
              } else {
                muteUnMuteCometPushNotifications('unmute',null,[selectedGroup?.getGuid()],null)
              }
            }}
            value={muteToggleGrp}
            trackColor={{ false: "#767577", true: COLORS.PRIMARY }}
            thumbColor={COLORS.WHITE}
          />
        </View>
      </View>
      <Text style={[style.font14, { color: COLORS.GREY }]}>MORE</Text>
      <View style={[style.mt20, style.column, { rowGap: normalize(15) }]}>
        {(userRoleInGroup?.toLowerCase() === "admin" ||
          userRoleInGroup?.toLowerCase() === "moderator") && (
          <TouchableOpacity style={[style.row, style.centerBox]} onPress={editGroupHandler}>
            <Text style={[style.font16, style.boldTxt, style.mH10]}>
              Edit Group
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[style.row, style.centerBox]} onPress={() => leaveOrDeleteGroupHandler("leave")}>
          <Text style={[style.font16,style.boldTxt,style.mH10,styles.colorRed,]}>Leave Group</Text>
        </TouchableOpacity>
        {selectedGroup?.getOwner() === loggedInUser.id && (
          <TouchableOpacity style={[style.row, style.centerBox]} onPress={() => leaveOrDeleteGroupHandler("delete")}>
            <Text style={[style.font16,style.boldTxt,style.mH10,styles.colorRed,]}>Delete and Exit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
  )
}

export default GroupDetailsComponent
const styles = StyleSheet.create({
    colorRed: {
        color: "red",
      },
      border: {
        borderWidth: 0.2,
        borderColor: COLORS.GREY,
        marginVertical: scaleHeight(20),
      },
})