import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import COLORS from '../../../../styles/theme/color';
import FastImage from 'react-native-fast-image';
import style from '../../../../styles/style';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";

const RenderGroupInfoUsersComponent = ({ item ,selectedGroup,userRoleInGroup,loggedInUserID,showScopeDropDown,changeUserScopeHandler,actionHandler,loggedInUser}) => {
    const isOwner = selectedGroup?.getOwner() === item.uid;
    const groupOwner = selectedGroup?.getOwner() === loggedInUserID;
    const isAdmin = userRoleInGroup?.toLowerCase() === "admin";
    const isModerator = userRoleInGroup?.toLowerCase() === "moderator";
    const isParticipant = userRoleInGroup?.toLowerCase() === "participant";

    const showActionButton = ((groupOwner && !isOwner) || (isAdmin && item.scope !=='admin') || (isModerator && item.scope ==='participant')) && loggedInUserID !== item.uid

    return (
      <View style={styles.userItem}>
        <View style={{marginRight: 10,backgroundColor: COLORS.DARK_PRIMARY,justifyContent: "center",alignItems: "center",borderRadius: 50,height: 40,width: 40,}}>
          {item.avatar ? (
            <FastImage
              source={{ uri: item.avatar }}
              style={styles.memberImage}
            />
          ) : (
            <FontAwesome5 name="user" size={25} solid color="#ffffff" />
          )}
          {item.status === "available" && (
            <View style={styles.isOnline}/>
          )}
        </View>
        
        <Text style={styles.username}>
          {item.uid === loggedInUser.id ? "You" : item.name}
        </Text>

      {showScopeDropDown && <TouchableOpacity
          style={[style.row, style.centerBox,styles.coloumnGap5 ]}
          disabled={!showActionButton}
          onPress={() => changeUserScopeHandler(item)}
        >
          <Text style={[style.font14, style.textCapitalize]}>
            {isOwner ? "Owner" : item.scope}
          </Text>
          {showActionButton && (
            <Entypo name="chevron-thin-down" size={15} color="#000" />
          )}
        </TouchableOpacity>}
        
    
          {!isParticipant &&<TouchableOpacity
            style={[{ width: 30, marginLeft: 10, padding: 5 }, style.row, style.centerItem,!showActionButton &&{opacity:0.3}]}
            onPress={() => actionHandler(item,showScopeDropDown ? 'ban' :'unban')}
            disabled={!showActionButton}
          >
            <Entypo name="dots-three-vertical" size={18} color={COLORS.BLACK} />
          </TouchableOpacity>}
      
      </View>
    );
  };

export default RenderGroupInfoUsersComponent
const styles=StyleSheet.create({
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
      coloumnGap5: {
        columnGap: 5,
      },
      memberImage: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
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
})