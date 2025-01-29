import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Keyboard,
} from "react-native";
import React from "react";
import style from "../../styles/style";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign"; // Added import
import FastImage from "react-native-fast-image";
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import RenderInput from "../BecomeMember/RenderInput";
import { Switch } from "react-native";

const CreateGroupModal = ({
  showModal,
  setAddMemberModal,
  setShowModal,
  cancelHandler,
  selectedImage,
  selectedImagePreview,
  setSelectedImagePreview,
  selectImageHandler,
  setLoading,
  isLoading,
  selectedImageErr,
  setSelectedImage,
  groupName,
  setGroupName,
  setGroupNameError,
  groupNameError,
  groupDes,
  setGroupDes,
  data,
  renderItem,
  createGroupHandler,
  createGroupLoader,
  showUsersList,
  Title,
  setAdminOnly,
  adminOnly,
  userRoleInGroup,
  groupDescError,
  setGroupDescError
}) => {
  return (
    <View>
      <Modal visible={showModal} animationType="slide">
        <View onTouchStart={() =>Keyboard.dismiss()} style={styles.popupContainer}>
          <View style={[style.row, style.mB15, style.centerBox]}></View>
          <View style={[styles.header, style.mB20]}>
            <View style={[style.row, style.centerBox, style.centerItem]}>
              {Title === "Create" && (
                <TouchableOpacity
                  onPress={() => {
                    setAddMemberModal(true);
                    setShowModal(false);
                  }}
                  style={[style.mr10]}
                >
                  <AntDesign
                    name="arrowleft"
                    size={25}
                    color={COLORS.PRIMARY}
                  />
                </TouchableOpacity>
              )}
              <Text
                style={[styles.popupTitle, style.font18]}
              >{`${Title} Group`}</Text>
            </View>
            <TouchableOpacity onPress={cancelHandler}>
              <AntDesign name="close" size={25} color="#000" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={[style.column, style.centerBox, style.centerItem]}>
              <View style={styles.imageContainer}>
                {selectedImagePreview ? (
                  <View>
                    <TouchableOpacity onPress={selectImageHandler}>
                      <FastImage
                        source={{
                          uri: selectedImagePreview,
                          priority: FastImage.priority.high,
                          cache: FastImage.cacheControl.immutable,
                        }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </TouchableOpacity>
                    {isLoading && (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={COLORS.WHITE} />
                      </View>
                    )}
                    {selectedImagePreview && !isLoading && (
                      <TouchableOpacity
                        onPress={() => {setSelectedImage(""),setSelectedImagePreview('')}}
                        style={styles.closeImageButton}
                      >
                        <AntDesign
                          name="closecircle"
                          size={25}
                          color={COLORS.LIGHT_PRIMARY}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.cameraIconContainer}
                    onPress={selectImageHandler}
                  >
                    <Entypo
                      name="camera"
                      size={normalize(20)}
                      color={"white"}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {selectedImageErr && (
                <Text style={[style.mt10, styles.errorText]}>
                  {selectedImageErr}
                </Text>
              )}
            </View>
            <RenderInput
              name="Group Name"
              placeholder="Enter Group Name"
              value={groupName}
              setValue={setGroupName}
              required={true}
              stylesProp={{ width: "98%" }}
              setValueError={setGroupNameError}
              valueError={groupNameError}
            />
          </View>
          <RenderInput
            name="Group Description"
            placeholder="Enter Group Description"
            value={groupDes}
            setValue={setGroupDes}
            stylesProp={{ width: "98%" }}
            setValueError={setGroupDescError}
            valueError={groupDescError}
            required={true}
            maxLength={255}
          />
          {groupDes.length >= 255 && <Text style={[style.textDanger]}>Character limit reached.</Text>}
          
         {((Title === 'Update' && userRoleInGroup === 'admin') || (Title === 'Create')) && <View style={[style.row,style.centerBox,style.mtb10]}>
            <Text style={[style.font18,style.primaryText,style.boldTxt,style.mH5]}>Admin only</Text>
          <Switch
              onValueChange={() => setAdminOnly(!adminOnly)}
              value={adminOnly}
              trackColor={{ false: '#767577', true: COLORS.PRIMARY }}
              thumbColor={COLORS.WHITE}
            />
          </View>}
          <View style={styles.groupListContainer}>
            {showUsersList && (
              <FlatList
                data={data}
                horizontal={true}
                renderItem={renderItem}
                keyExtractor={(item) => item.uid}
                contentContainerStyle={[style.pH20]}
                showsHorizontalScrollIndicator={true}
                style={styles.groupList}
              />
            )}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.nextBtn, { width: "45%" }]}
                onPress={cancelHandler}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, { width: "45%" }, isLoading && {opacity:0.6}]}
                onPress={createGroupHandler}
                disabled={isLoading || createGroupLoader}
              >
                {createGroupLoader ? (
                  <ActivityIndicator color={COLORS.WHITE} size={"small"} />
                ) : (
                  <Text style={styles.linkBtnText}>{Title}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 20,
    borderBottomColor: "#ccc",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    backgroundColor: COLORS.PRIMARY,
    height: 120,
    width: 120,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 120,
    width: 120,
    borderRadius: 80,
  },
  loadingContainer: {
    position: "absolute",
    top: 50,
    left: 50,
  },
  closeImageButton: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: "white",
    borderRadius: 20,
  },
  cameraIconContainer: {
    backgroundColor: COLORS.PRIMARY,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: normalize(12),
  },
  groupListContainer: {
    position: "relative",
    flex: 1,
    marginTop: 30,
  },
  groupList: {
    maxHeight: 90,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: normalize(5),
  },
  nextBtn: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 8,
    backgroundColor: "#f2f4f6",
  },
  createBtn: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(10),
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  cancelButtonText: {
    textAlign: "center",
    color: COLORS.BLACK,
  },
  linkBtnText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CreateGroupModal;
