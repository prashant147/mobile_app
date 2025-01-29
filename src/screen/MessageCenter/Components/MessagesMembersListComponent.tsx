import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import COLORS from '../../../styles/theme/color';
import style from '../../../styles/style';
import { sliceString } from '../../../styles/utilities/variables';
import { getAllMembersFav } from '../../../services/api/auth';

const MessagesMembersListComponent = ({ startConversationHandler, userLoaderId,hasFetched,membersList,setMembersList }) => {
  const [searchValue, setSearchValue] = useState('');
  const [membersListLoader, setMembersListLoader] = useState(false);

  const fetchSOAMembersHandler = async () => {
    if (hasFetched.current) return; // Prevent multiple calls

    try {
      setMembersListLoader(true);
      const token = await AsyncStorage.getItem("accessToken");
      const response = await getAllMembersFav(token);
      if (response.status === 200) {
        setMembersList(response.data);
        hasFetched.current = true; // Mark as fetched
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMembersListLoader(false);
    }
  };

  useEffect(() => {
    fetchSOAMembersHandler();
  }, []);

  const filteredMembers = useMemo(() => {
    return searchValue === ""
      ? membersList
      : membersList.filter((e) =>
          `${e.firstName} ${e.lastName} ${e.boatName}`
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );
  }, [searchValue, membersList]);

  const renderUsersList = ({ item }) => (
    <TouchableOpacity onPress={() => startConversationHandler(item)} style={styles.userItem}>
      <View style={[styles.avatar]}>
        {item.type === "group" ? (
          <MaterialIcons name="groups" size={30} color={"#ffffff"} />
        ) : item.profileUrl ? (
          <Image source={{ uri: item.profileUrl }} style={[styles.memberImage]} />
        ) : (
          <FontAwesome5 name="user" size={25} solid color={"#ffffff"} />
        )}
      </View>
      <Text style={styles.username}>
        {sliceString(`${item.firstName} ${item.lastName}${item.boatName ? ` - ${item.boatName}` : ""}`, 25)}
      </Text>
      {item.type !== "group" && (
        <TouchableOpacity style={styles.sendButton} onPress={() => startConversationHandler(item)}>
          {item.id === userLoaderId ? <ActivityIndicator color={COLORS.WHITE} size={"small"} /> : <FontAwesome name="send" size={16} color="white" />}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[style.contant, style.pH10]}>
      {membersListLoader ? (
        <View style={[style.contant, style.row, style.centerBox, style.centerItem]}>
          <ActivityIndicator color={COLORS.PRIMARY} size={"large"} />
        </View>
      ) : (
        <>
          <View style={[style.row, style.mH10]}>
            <TextInput
              placeholder="Search"
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
              style={styles.input}
              placeholderTextColor={"black"}
            />
          </View>
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUsersList}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            style={style.mt10}
          />
        </>
      )}
    </View>
  );
};

export default React.memo(MessagesMembersListComponent);

const styles = {
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  avatar: {
    marginRight: 7,
    backgroundColor: COLORS.DARK_PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  memberImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  sendButton: {
    backgroundColor: COLORS.DARK_PRIMARY,
    padding: 10,
    borderRadius: 30,
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    color: "black",
    flex: 1,
  },
};
