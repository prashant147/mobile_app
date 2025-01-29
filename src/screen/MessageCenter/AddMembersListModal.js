import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
  } from "react-native";
  import React, { useEffect, useMemo, useState } from "react";
  import style from "../../styles/style";
  import COLORS from "../../styles/theme/color";
  import AntDesign from "react-native-vector-icons/AntDesign";
  import { ActivityIndicator } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";

  const AddMembersListModal = ({
    showModal,
    cancelHandler,
    // search,
    // setSearch,
    data,
    selectedItems,
    renderItem,
    title,
    addHandler,
    loader
  }) => {
    const isFocused = useIsFocused()
    const [search,setSearch]=useState('')
    useEffect(()=>{
      setSearch('')
    },[isFocused])
    const filteredData = useMemo(() => {
      if (!search) return data;
      return data.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, data]);
    const onBackHandler =()=>{
      cancelHandler()
      setSearch('')
    }
    return (
      <View>
        <Modal visible={showModal} animationType="slide">
          <View style={[style.contant, style.mt40]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onBackHandler} style={styles.backButton}>
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

            
        {filteredData && filteredData.length > 0 ? (
          <FlatList
          data={filteredData}
          keyExtractor={(item) => item.uid.toString()}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          extraData={selectedItems}
        />
        ) : (
          <View style={styles.noUsersFound}>
            <Text style={styles.noUsersText}>No users found</Text>
          </View>
        )}
            {selectedItems && selectedItems.length > 0 && (
              <TouchableOpacity onPress={addHandler} style={styles.addButton}>
                {loader ? <ActivityIndicator color={COLORS.WHITE} size={"small"} /> :
                <AntDesign name="arrowright" size={20} color="white" />}
              </TouchableOpacity>
            )}
          </View>
        </Modal>
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

  export default AddMembersListModal;
  