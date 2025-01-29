import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import React from "react";
import style from "../../styles/style";
import COLORS from "../../styles/theme/color";
import AntDesign from "react-native-vector-icons/AntDesign";

const MembersListModal = ({
  showModal,
  cancelHandler,
  search,
  setSearch,
  data,
  selectedItems,
  renderItem,
  title,
  addHandler,
}) => {
  return (

        <View style={[style.contant, style.mt10]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={cancelHandler} style={styles.backButton}>
              <AntDesign name="arrowleft" size={25} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              value={search}
              onChangeText={(text) => setSearch(text)}
              style={styles.textInput}
              placeholderTextColor={"black"}
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch("")}
                style={styles.clearButton}
              >
                <AntDesign name="close" size={25} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          {((search === "" && data && data.length > 0) ||
            (search &&
              data.filter((e) =>
                `${e.name}`.toLowerCase().includes(search.toLowerCase())
              ).length > 0)) && (
            <FlatList
              data={
                search === ""
                  ? data
                  : data.filter((e) =>
                      `${e.name}`.toLowerCase().includes(search.toLowerCase())
                    )
              }
              keyExtractor={(item) => item.uid}
              renderItem={renderItem}
              style={styles.flatList}
            />
          )}
          {((search === "" && data && data.length === 0) ||
            (search &&
              data.filter((e) =>
                `${e.name}`.toLowerCase().includes(search.toLowerCase())
              ).length === 0)) && (
            <View style={styles.noUsersFound}>
              <Text style={[style.font18]}>No users found</Text>
            </View>
          )}
          {selectedItems && selectedItems.length > 0 && (
            <TouchableOpacity onPress={addHandler} style={styles.addButton}>
              <AntDesign name="arrowright" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

  );
};

const styles = StyleSheet.create({
  modalHeader: {
    ...style.row,
    ...style.mt20,
    ...style.centerBox,
  },
  backButton: {
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  titleText: {
    ...style.primaryText,
    ...style.boldTxt,
    ...style.font20,
    ...style.mH10,
  },
  searchContainer: {
    ...style.row,
    ...style.mtb10,
    ...style.mH10,
    ...style.centerBox,
    ...style.between,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
 
  },
  textInput: {
    flex: 1,
    color: COLORS.BLACK,
  },
  clearButton: {
    flex: 0.1,
    height: "100%",
    ...style.row,
    ...style.centerBox,
    ...style.centerItem,
  },
  flatList: {
    ...style.mt10,
    paddingBottom: 100,
  },
  noUsersFound: {
    ...style.row,
    ...style.centerBox,
    ...style.centerItem,
    ...style.contant,
  },
  addButton: {
    position: "absolute",
    backgroundColor: COLORS.PRIMARY,
    width: 50,
    height: 50,
    bottom: 30,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});

export default MembersListModal;
