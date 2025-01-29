import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  FlatList,
} from "react-native";
import style from "../../styles/style";
import DeviceInfo from "react-native-device-info";
import Menu from "../../routes/Menu";
import Icon from "react-native-vector-icons/Feather";
import COLORS from "../../styles/theme/color";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getAllMyCrewApplication,
  getInviteApplicants,
  acceptOrRejectInvitation,
  getApplicationsUndo,
} from "../../services/api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalize } from "../../styles/utilities/dimentions";
import { ActivityIndicator } from "react-native-paper";
import { BackHandler } from "react-native";
import TabBox from "../../components/TabBox";
import moment from "moment";
import { dateFormat } from "../../styles/utilities/variables";
import MembersContext from "../Members/MembersContext";

const MyApplicationsTabs = ({route}:any) => {
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const token = AsyncStorage.getItem("accessToken");
  const [invitationData, setInvitationData] = useState([]);
  const [requestData, setRequestData] = useState<any>();
  const [selectedTab, setSelectedTab] = useState("Applied Boats");
  const [updatedSuccess, setUpdateSuccess] = useState(false);
  let tabData = ["Applied Boats", "Invitations"];
  const {accessToken} = useContext(MembersContext);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Crew");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


  useFocusEffect(
    React.useCallback(()=>{
      getRequestData();
    },[])
  )

  useEffect(()=>{
    if(route?.params){
      setSelectedTab(route?.params?.tabIndex)
    }else{
      setSelectedTab('Applied Boats')
    }
      },[route])

  useEffect(() => {
    getRequestData();
  }, [selectedTab]);


  const getRequestData = async () => {
    try {
      setLoader(true);
      const response = await getAllMyCrewApplication(token);

      if (response.status === 200) {
        if (response.data[0]?.message === "No Applications Found for this User") {
          setRequestData([]);
          setLoader(false);
        } else {
          setRequestData(response.data);
          setLoader(false);
        }
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };


  useEffect(() => {
    getInvites();
  }, [updatedSuccess,selectedTab]);


  const getInvites = async () => {
    try {
      setLoader(true);
      const response = await getInviteApplicants(accessToken); 

      if (response.status === 200) {
        if (response.data[0]?.message === "No Records Found") {
          setInvitationData([]);
          setLoader(false);
        } else {
          setInvitationData(response.data);
          setLoader(false);
        }
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
    }
  };

  const acceptInvitation = async (item: any) => {
    try {
      setUpdateSuccess(false);
      const response = await acceptOrRejectInvitation(
        item.id,
        accessToken,
        "Accepted"
      );
      if (response.status === 200) {
        setUpdateSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectInvitation = async (item: any) => {
    try {
      setUpdateSuccess(false);
      const response = await acceptOrRejectInvitation(
        item.id,
        token,
        "Rejected"
      );
      if (response.status === 200) {
        setUpdateSuccess(true);
        // handleAcceptInvitationSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleUndoRequest = async(item:any) =>{
    try {
      const response = await getApplicationsUndo(item.id, token);
      if(response.status === 200){
      getRequestData();
       } 
    } catch (error) {
      console.error(error)
    }
  
  }
  const renderBoatPhoneList = ({ item, index }: any) => {
    return (
      <View style={style.between}>
        <View style={[styles.line, style.contentBetween]}>
          <View style={style.row}>
            {item?.imageUrl ? (
              <Image
                source={{ uri: item?.imageUrl }}
                style={[styles.profileImg, style.mt10]}
              />
            ) : (
              <Image
                style={[styles.profileImg, style.mt10]}
                source={require("../../assets/blue_sailboat.png")}
                alt="img"
              />
            )}
            <View>
              <View style={style.mt10}>
                <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                <Text numberOfLines={1} style={styles.nameTitleTextStyle}>
                  {item?.boatName}
                </Text>
              </View>
              <View>
                <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                <Text style={styles.nameTitleTextStyle}>
                  {item?.boats?.captain ? item?.boats?.captain : "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[style.row, style.between,style.mt5]}>
          <View>
            <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
            <Text style={styles.nameTitleTextStyle}>
              {item?.boats?.coOwner ? item?.boats?.coOwner : "N/A"}
            </Text>
          </View>
          <View>
            <Text style={styles.nameTitleStyle}>HOME PORT</Text>
            <Text style={styles.nameTitlePhoneTextStyle}>
              {item?.boats?.homePort ? item?.boats?.homePort : "N/A"}
            </Text>
          </View>
        </View>
        <View style={[style.row, style.mt10, style.between]}>
          <View>
            <Text style={styles.nameTitleStyle}>PHONE NO</Text>
            <Text style={styles.nameTitleTextStyle}>{item?.phoneNumber}</Text>
          </View>
          <View>
            <Text style={styles.nameTitlePhoneStyle}>EMAIL</Text>
            <Text numberOfLines={1} style={[styles.nameTitlePhoneTextStyle]}>
              {item?.email}
            </Text>
          </View>
        </View>
        <View style={[style.row, style.mt10, style.between]}>
          <View>
            <Text style={styles.nameTitleStyle}>CREW VACANCY</Text>
            <Text style={styles.nameTitleTextStyle}>{item?.crewVacancy}</Text>
          </View>
          <View>
            <Text style={styles.nameTitlePhoneStyle}>POSITION</Text>
            <Text style={styles.nameTitlePhoneTextStyle}>{item?.position}</Text>
          </View>
        </View>
        <View style={[style.row, style.mt10, style.between]}>
          <View>
            <Text style={styles.nameTitleStyle}>RALLY DATES</Text>
            <Text style={styles.nameTitleTextStyle}>
              {dateFormat(item?.rallyDate?.split(",")[0]) +
                "," +
                dateFormat(item?.rallyDate?.split(",")[1])}
            </Text>
          </View>
          <View>
            <Text style={styles.nameTitlePhoneStyle}>DIETRY RESTRICTION</Text>
            <Text style={styles.nameTitlePhoneTextStyle}>
              {item?.restrictions ? item?.restrictions : "N/A"}
            </Text>
          </View>
        </View>
        <View style={[style.row, style.mt10, style.between]}>
          <View>
            <Text style={styles.nameTitleStyle}>EXPENSE</Text>
            <Text style={styles.nameTitleTextStyle}>
              {item?.costOfCrewMember}
            </Text>
          </View>
        </View>
        <View style={[style.mt10, style.mB10]}>
          <Text style={styles.nameTitleStyle}>DESCRIPTION</Text>
          <View style={style.row}>
            <Text numberOfLines={2} style={[style.font16, { width: "80%" }]}>
              {item?.description}
            </Text>
          </View>
        </View>

        <View style={[style.centerItem, style.mB10]}>
          {!requestData.isInvited && (
            <TouchableOpacity
              style={style.button}
              onPress={() => handleUndoRequest(item)}
            >
              <Text>Undo</Text>
            </TouchableOpacity>
          )}

          {requestData.isAccepted && (
            <TouchableOpacity style={style.button}>
              <Text>Accepted</Text>
            </TouchableOpacity>
          )}

          {requestData.isRejected && (
            <TouchableOpacity style={style.button}>
              <Text>Rejected</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderInvitationdata = ({ item, index }: any) => {
    
    return (
      <View style={style.mB30}>
        <View style={style.mt10}>
          <Text style={[style.boldTxt,style.primaryText,]}>Invited you to join</Text>
          <View style={[style.row, style.mt10, styles.line]}>
            {item?.member?.profileUrl ? (
              <Image
                style={[styles.profileImage, style.mt10]}
                source={{ uri: item?.member?.profileUrl }}
                alt="img"
              />
            ) : (
              <Image
                style={[styles.profileImage, style.mt10]}
                source={require("../../assets/avatarImage.png")}
                alt="img"
              />
            )}

            <View style={[style.contentBetween]}>
              <View style={[style.mt10]}>
                <Text style={styles.nameTitleStyle}>CAPTAIN NAME</Text>
                <Text numberOfLines={1} style={[style.font18, style.primaryText]}>
                  {
                    `${item?.member?.firstName} ${item?.member?.lastName}`}
                </Text>

                <View style={[style.mt2]}>
                  <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                  <Text style={[style.font14, style.primaryText]}>
                    <Text>{item?.boats?.boatName ? item?.boats?.boatName : "N/A"}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[style.centerBox, style.centerItem, style.mH10, style.mt5]}
          >
            <View style={[style.row, style.contentBetween, style.mt5]}>
              {!item?.isAccepted && (
                <TouchableOpacity
                  style={[style.whiteLayout, styles.buttonRed, style.mH10]}
                  onPress={() => rejectInvitation(item)}
                >
                  <Text
                    style={[
                      style.primaryText,
                      style.textCenter,
                      { color: "red" },
                    ]}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[style.primaryLayout, styles.buttongreen]}
                onPress={() => acceptInvitation(item)}
                disabled={item?.status === "ACCEPTED"}
              >
                <Text style={[style.whiteText, style.textCenter]}>
                  {item?.isAccepted ? "Accepted" : "Accept"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[style.contant]}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          {!isTablet && <View style={style.sidepanelcolor}>
          <Menu selectIndex={7} />
          </View>}
        </View>
      </View>

      <View
        style={[
          style.contant,
          style.pH20,
          style.mtb20
        ]}
      >
        <View>
          <TouchableOpacity
            style={[style.row, style.centerBox]}
            onPress={() => navigation.navigate(route?.params?.path ?  route?.params?.path : "Crew")}
          >
            <Icon
              name="chevron-left"
              size={normalize(20)}
              color={COLORS.PRIMARY}
            />
            <Text
              style={[
                styles.memberTitleText,
                style.font16,
                style.boldTxt,
                style.primaryText,
              ]}
            >
              {`Back to ${route?.params?.path ? route?.params?.path :'Crew'}`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[style.mH10, style.mtb10]}>
          <TabBox
            data={tabData}
            selectedTab={selectedTab}
            onTab={(tab) => setSelectedTab(tab)}
          ></TabBox>
        </View>
        <View style={style.contant}>
          {selectedTab == "Applied Boats" && (
            <View>
              {loader ? (
                <View
                  style={[
                    style.contant,
                    style.row,
                    style.centerItem,
                    style.mt40,
                  ]}
                >
                  <ActivityIndicator
                    theme={{ colors: { primary: COLORS.PRIMARY } }}
                  />
                </View>
              ) : (
                <View>
                  {requestData && requestData.length > 0 ? (
                    <FlatList
                      data={requestData}
                      renderItem={renderBoatPhoneList}
                      showsVerticalScrollIndicator={false}
                    />
                  ) : (
                    <View
                      style={[style.centerItem, style.centerBox, style.mt40]}
                    >
                         <Text style={[style.font14, style.mt40]}>No Applied Boats.</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          {selectedTab == "Invitations" && (
            <View>
              {loader ? (
                <View
                  style={[
                    style.contant,
                    style.row,
                    style.centerItem,
                    style.centerItem,
                  ]}
                >
                  <ActivityIndicator
                    theme={{ colors: { primary: COLORS.PRIMARY } }}
                  />
                </View>
              ) : (
                <View>
                  {invitationData && invitationData.length > 0 ? (
                    <FlatList
                      data={invitationData}
                      renderItem={renderInvitationdata}
                      showsVerticalScrollIndicator={false}
                    />
                  ) : (
                    <View
                      style={[style.centerItem, style.centerBox, style.mt40]}
                    >
                      <Text style={[style.font14, style.mt40]}>
                      No Invitations Found.
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default MyApplicationsTabs;
const styles = StyleSheet.create({
  memberTitleText: {
    color: COLORS.LIGHT_BLACK,
    fontSize: normalize(12),
    lineHeight: 25,
  },
  profileImg: {
    width: normalize(65),
    height: normalize(65),
    borderRadius: 8,
    marginRight: 10,
    borderWidth:1,
    borderColor:COLORS.BORDERGREY,
    resizeMode: "contain",
  },
  profileImage: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "contain",
  },
  line: {
    borderTopWidth: 1,
    borderColor: COLORS.LINE,
  },
  nameTitleStyle: {
    color: COLORS.GREY,
    fontSize: normalize(10),
  },
  nameTitleTextStyle: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
    fontWeight: "600",
    lineHeight: 25,
    maxWidth: 200,
  },
  buttonRed: {
    justifyContent: "center",
    borderWidth: 0.2,
    borderColor: "red",
    backgroundColor: "#fff",
    padding: 10,
    height: 40,
    width: "50%",
  },

  buttongreen: {
    backgroundColor: "green",
    padding: 10,
    height: 40,
    width: "50%",
  },

  btnTextStyless: {
    color: COLORS.PRIMARY,
    fontSize: normalize(14),
    fontWeight: "600",
  },
  modelUser: {
    width: 300,
    height: 500,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust opacity here
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameTitlePhoneStyle: {
    color: COLORS.GREY,
    fontSize: normalize(10),
    textAlign: "right",
  },
  nameTitlePhoneTextStyle: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
    fontWeight: "600",
    lineHeight: 30,
    textAlign: "right",
  },
  btnStylessMobile: {
    borderWidth: 1,
    borderColor: "#8A97A4",
    backgroundColor: "#8A97A4",

    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    margin: normalize(5),
    borderRadius: normalize(4),
    height: normalize(30),
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  btnTextStyle: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: "600",
  },
  button:{
    borderColor:COLORS.PRIMARY,
    borderWidth:1,
    borderRadius:8,
    alignContent:'center',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:10
 },
});