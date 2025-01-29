import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import COLORS from '../../../../styles/theme/color'
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const RenderGroupUsersTansferComponent = ({item,transferOwnerShipHandler,loggedInUser}) => {
  return (
    <TouchableOpacity style={styles.userItem} onPress={()=>transferOwnerShipHandler(item)}>
    <View style={{marginRight: 10,backgroundColor: COLORS.DARK_PRIMARY,justifyContent: "center",alignItems: "center",borderRadius: 50,height: 40,width: 40,}}>
      {item.avatar ? (
        <FastImage
          source={{ uri: item.avatar }}
          style={[styles.memberImage]}
        />
      ) : (
        <FontAwesome5 name="user" size={25} solid color="#ffffff" />
      )}
      {item.status === "available" && (
        <View style={[styles.isOnline]}/>
      )}
    </View>
    <Text style={styles.username}>
      {item.uid === loggedInUser.id ? "You" : item.name}
    </Text>

  </TouchableOpacity>
  )
}

export default RenderGroupUsersTansferComponent
const styles = StyleSheet.create({
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
      isOnline: {
        height: 12,
        width: 12,
        borderRadius: 20,
        backgroundColor: COLORS.GREEN,
        position: "absolute",
        bottom: 0,
        right: 0,
      },
      username: {
        flex: 1,
        fontSize: 14,
        marginRight: 10,
        color: COLORS.BLACK,
        fontWeight: "bold",
      },
})