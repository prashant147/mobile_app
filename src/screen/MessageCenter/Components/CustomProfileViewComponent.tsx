import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native'
import React from 'react'
import style from '../../../styles/style';
import { CometChatAvatar } from '@cometchat/chat-uikit-react-native';
import COLORS from '../../../styles/theme/color';
import { blockUnblockUser, muteUnMuteCometPushNotifications } from '../../../services/CometUtils';
import moment from 'moment';
import AntDesign from "react-native-vector-icons/AntDesign";
import { scaleHeight } from '../../../styles/utilities/dimentions';

const CustomProfileViewComponent = ({setSelectedMemberShow,selectedMember,setMuteToggleUser,muteToggleUser,setSelectedMember}) => {
  return (
    <View style={[style.contant, style.pV10, style.pH20, style.mt15]}>
    <View style={[style.row, style.centerBox]}>
      <TouchableOpacity
        onPress={() => {
          setSelectedMemberShow(null);
        }}
      >
        <AntDesign name="close" size={25} color="#6851d6" />
      </TouchableOpacity>
      <Text style={[style.font20, style.pH20, style.boldTxt]}>Details</Text>
    </View>

  <View style={[style.row, style.centerBox, style.mt30]}>
  <CometChatAvatar
        image={{ uri: selectedMember?.getAvatar() }}
        name={selectedMember?.getName()}
        style={{ height: 45, width: 45 }}
      />

  <View style={[style.mH10]}>
    <Text style={[style.font16, style.boldTxt]}>
      {selectedMember?.getName()}
    </Text>
    <Text style={{ color: "#667" }}>{selectedMember?.getStatus()}</Text>
  </View>
  </View>
  <View style={[styles.border]} />
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
              setMuteToggleUser((prev) => !prev);
              if (!muteToggleUser) {
                muteUnMuteCometPushNotifications('mute',[selectedMember?.getUid()],null,moment().add(100, 'year').valueOf().toString())
              } else {
                muteUnMuteCometPushNotifications('unmute',[selectedMember?.getUid()],null,null)
              }
            }}
            value={muteToggleUser}
            trackColor={{ false: "#767577", true: COLORS.PRIMARY }}
            thumbColor={COLORS.WHITE}
          />
        </View>
      </View>
      <Text style={[style.font14, { color: COLORS.GREY }]}>
          More
        </Text>
        <TouchableOpacity style={[style.row, style.centerBox,style.mt20]} onPress={() => {
          if(selectedMember.getBlockedByMe()){
              blockUnblockUser('unblock',selectedMember?.getUid(),setSelectedMember)
              
          }else{
              blockUnblockUser('block',selectedMember?.getUid(),setSelectedMember)
          }
          
        }}>
          <Text style={[style.font16,style.boldTxt,style.mH10,styles.colorRed,]}>{selectedMember.getBlockedByMe() ? 'Unblock User' :'Block User'}   </Text>
        </TouchableOpacity>

</View>
  )
}

export default CustomProfileViewComponent
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