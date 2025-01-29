import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import COLORS from '../../../../styles/theme/color'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

const RenderAddMembersComponents = ({item,handleSelectMembers,selectedItems}) => {
  return (
    <TouchableOpacity onPress={() => handleSelectMembers(item)} style={styles.userItem} >
    <View
      style={[styles.addMemberListImage]}>
      {item.avatar ? (
        <FastImage source={{ uri: item.avatar }} style={[styles.memberImage]}/>
      ) : (
        <FontAwesome5 name="user" size={25} solid color={"#ffffff"} />
      )}
    </View>
    <Text style={styles.username}>{item.name}</Text>
    {selectedItems.includes(item.uid) && (
      <View style={[styles.addMemberSendBtn]}
      >
        <AntDesign name="check" size={20} color={COLORS.WHITE} />
      </View>
    )}
  </TouchableOpacity>
  )
}

export default RenderAddMembersComponents
const styles = StyleSheet.create({
    addMemberListImage: {
        marginRight: 10,
        backgroundColor: COLORS.DARK_PRIMARY,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        height: 40,
        width: 40,
      },
      userItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: 10,
        paddingHorizontal: 20,
      },
      memberImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
      },
      addMemberSendBtn: {
        height: 30,
        width: 30,
        backgroundColor: COLORS.GREEN,
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      username: {
        flex: 1,
        fontSize: 14,
        marginRight: 10,
        color: COLORS.BLACK,
        fontWeight: "bold",
      },
})