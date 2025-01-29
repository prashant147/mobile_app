import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import style from "../../styles/style";
import {
  scaleHeight,
  scaleWidth,
  normalize,
} from "../../styles/utilities/dimentions";
import COLORS from "../../styles/theme/color";
import DeviceInfo from "react-native-device-info";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useContext, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import Icons from "react-native-vector-icons/FontAwesome";
import RenderInput from "../BecomeMember/RenderInput";
import MembersContext from "../Members/MembersContext";
import { volunteerSubmitForm } from "../../services/api/auth";
import ModalNative from "react-native-modal";
import WebView from "react-native-webview";
import { ActivityIndicator } from "react-native-paper";
import moment from "moment";
import crashlytics from '@react-native-firebase/crashlytics';
import { TimeZoneDateHandler, TimeZoneTimeHandler } from "../../styles/utilities/variables";

interface AwardsUserInfoProps {
  selectAward: any;
  openInfo: any;
  showMore: any;
  setShowMore: any;
  setUpdateSuccess: any;
}

const DATA = [
  {
    id: "1",
    image: require("../../assets/news22.png"),
    heading: "POWERBOAT  SHOW",
    timeSlots: ["11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM", "09:00 PM"],
    desc: "Tested with UI",
  },
  // Add more data items as needed
];
let newsImage = require("../../assets/news22.png");
const isTablet = DeviceInfo.isTablet();
const DetailsScreen: React.FC<AwardsUserInfoProps> = ({
  selectAward,
  openInfo,
  showMore,
  setShowMore,
  setUpdateSuccess,
}) => {
  const { loggedInUser, accessToken,userTimeZone } = useContext(MembersContext);
  const renderItem = ({ item }: any) => (
    <View style={[isTablet ? styles.itemContainer : styles.emptyContainer]}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <Text
          style={[
            isTablet ? style.font20 : style.font14,
            style.primaryText,
            style.boldTxt,
            style.mtb10,
          ]}
        >
          {item.heading}
        </Text>
        <Text style={[isTablet ? style.font20 : style.font14, style.boldTxt]}>
          {item.desc}
        </Text>
        <View style={styles.timeSlotsContainer}>
          {item.timeSlots.map((time, index) => (
            <View key={index} style={styles.timeSlot}>
              <Text style={styles.timeSlotText}>{time}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const navigation = useNavigation();
  const [form, setForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [exp, setExp] = useState("");
  const [qua, setQua] = useState("");
  const [loader, setLoader] = useState(false);
  const [mobileNo, setMobileNo] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setFirstName(loggedInUser.firstName);
      setLastName(loggedInUser.lastName);
      const primaryEmail = loggedInUser?.emailAddress?.find(
        (item) => item.type === "PRIMARY"
      );
      const primaryPhone = loggedInUser?.phoneNumbers?.find(
        (item) => item.type === "PRIMARY"
      );
      setWorkEmail(primaryEmail?.email);
      setMobileNo(primaryPhone?.phoneNumber);
      setQua(loggedInUser?.metadata?.oceanOrWorldClassQualification);
      setShowSuccessModal(false);
      setLoader(false);
    }, [])
  );

  const submitHandler = async () => {
    const payload_data = {
      eventId: showMore.id,
      sailingExperience: exp,
      volunteer: true,
    };
    setUpdateSuccess(false);
    setLoader(true);
    try {
      const response = await volunteerSubmitForm(payload_data, accessToken);
      if (response.status === 200) {
        setLoader(false);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          setShowMore(null);
          setUpdateSuccess(true);
        }, 2000);
      }
    } catch (error) {
      crashlytics().log(error );
      setLoader(false);
      setUpdateSuccess(true);
      console.error(error);
    }
  };

  const wrappedHtml = `
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
      <style>
          body { font-size: ${14}px; }
      </style>
  </head>
  <body>
      ${showMore?.description}
  </body>
  </html>
`;
  return (
    <ScrollView>
      <View style={[style.contant]}>
        <View >
          <View style={[style.contant,  style.mtb10]}>
            {!form && showMore && (
              <View>
                <View
                  style={[
                   styles.emptyContainer,style.row
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={
                      showMore.eventsMediasUrl
                        ? { uri: showMore.eventsMediasUrl }
                        : require("../../assets/news2.png")
                    }
                    style={[styles.image,style.contant]}
                  />
                  <View style={[styles.flex,style.mH10]}>

                    <Text
                      style={[
                        isTablet ? style.font24 : style.font16,
                        style.primaryText,
                        style.boldTxt,
                        style.mtb10,
                      ]}
                      >
                      {showMore.name}
                    </Text>
                    <View style={[style.row,style.centerBox]}>
                  <View style={[style.mr10]}>
                    <Text style={[style.font12]}>{TimeZoneDateHandler(showMore?.startDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12]}>{TimeZoneTimeHandler(showMore?.startDateTime,userTimeZone)}</Text>
                  </View>
                  <View>
                    <Text style={[style.font12]}>{TimeZoneDateHandler(showMore?.endDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12]}>{TimeZoneTimeHandler(showMore?.endDateTime,userTimeZone)}</Text>
                  </View>
                </View>
                      </View>
                </View>
                <View style={[style.contant,style.mt10]}>
                  <View>
                    <WebView
                      source={{ html: wrappedHtml }}
                      javaScriptEnabled={true} // Enable JavaScript for iframe interactions
                      domStorageEnabled={true} // Enable DOM storage for iframe functionality (if needed)
                      style={[
                        {
                          height: Dimensions.get("screen").height * 0.48,
                          backgroundColor: "transparent",
                        },
                      ]}
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      allowsZoom={false}
                    />
                    {/* <Text style={styles.details}>
                {showMore.description}
                </Text> */}
                  </View>

                  {moment(showMore.endDateTime).isSameOrBefore(moment()) ? (
                    <TouchableOpacity
                      style={[style.button, style.mtb10, { borderRadius: 8 }]}
                      disabled={true}
                    >
                      <Text style={styles.input}>Event Completed</Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      {showMore?.participants?.find(
                        (item) => item.id === loggedInUser.id
                      )=== undefined ? (
                        <TouchableOpacity
                          style={[
                            style.button,
                            style.mtb10,
                            { borderRadius: 8 },
                            style.primaryLayout,
                          ]}
                          onPress={() => setForm(true)}
                        >
                          <Text style={[styles.input, style.whiteText]}>
                            Volunteer Now
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            style.button,
                            style.mtb10,
                            { borderRadius: 8 },
                          ]}
                          disabled={true}
                        >
                              {showMore.type === 'EVENT' ? (showMore?.participants?.find((item) => item.id === loggedInUser.id) &&
                                <Text style={styles.input}>Registered</Text>) :
                                (showMore?.participants?.find((item) => item.id === loggedInUser.id)?.approved ?
                                  <Text style={styles.input}>Registered</Text> :
                                  <Text style={styles.input}>Pending</Text>)

                              }
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            )}
            {form && (
              <View style={styles.textContainer}>
                <Text
                  style={[
                    isTablet ? style.font20 : style.font16,
                    style.boldTxt,
                    style.primaryText,
                  ]}
                >
                  Volunteer Form
                </Text>

                <View style={styles.containerForm}>
                  <RenderInput
                    name={"First Name"}
                    placeholder={"First Name"}
                    value={firstName}
                    setValue={setFirstName}
                    readOnly={true}
                  />
                  <RenderInput
                    name={"Last Name"}
                    placeholder={"Last Name"}
                    value={lastName}
                    setValue={setLastName}
                    readOnly={true}
                  />
                  <RenderInput
                    name={"Email"}
                    placeholder={"Enter Email"}
                    value={workEmail}
                    setValue={setWorkEmail}
                    readOnly={true}
                  />
                  <RenderInput
                    name={"Mobile Number"}
                    placeholder={"Enter Mobile Number"}
                    value={mobileNo}
                    setValue={setMobileNo}
                    readOnly={true}
                  />
                  <RenderInput
                    name={"Qualifications"}
                    placeholder={"Enter Qualifications"}
                    value={qua}
                    setValue={setQua}
                    readOnly={true}
                  />
                  <RenderInput
                    name={"Sailing Experience"}
                    placeholder={"Enter Sailing Experience"}
                    value={exp}
                    setValue={setExp}
                  />
                  <Text
                    style={[
                      isTablet ? style.font16 : style.mH10,
                      { marginBottom: 10, color: COLORS.BLACK_50 },
                    ]}
                  >
                    This form is automatically collecting emails from all
                    respondents.
                  </Text>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      style={[
                        style.button,
                        style.primaryLayout,
                        style.mtb10,
                        styles.button,
                      ]}
                      onPress={submitHandler}
                    >
                      {loader ? (
                        <ActivityIndicator
                          color={COLORS.WHITE}
                          size={"small"}
                        />
                      ) : (
                        <Text
                          style={[
                            style.buttonTxt,
                            style.font16,
                            style.whiteText,
                            style.pH20,
                          ]}
                        >
                          Submit
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
      <ModalNative
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        isVisible={showSuccessModal}
        backdropColor="rgba(0, 0, 0, 0.3)"
      >
        <View style={[style.p20, style.whiteLayout, style.borderRadius8]}>
          <Text style={[style.font14, style.boldTxt, style.textCenter]}>
            You have registered successfully
          </Text>
        </View>
      </ModalNative>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  flex:{
    flex:1.5
  },
  details: {
    fontSize: scaleWidth(isTablet ? 16 : 12),
    color: COLORS.BLACK,
    marginBottom: 5,
    lineHeight: 24,
  },

  image: {
    width: "100%",
    height: normalize(80),
    borderRadius: 8,
  },
  content: {
    flex: 1,
    // marginLeft: 10,
    // padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },

  subHeading: {
    fontSize: 20,
  },

  button: {
    width: Dimensions.get("screen").width * 0.4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  timeSlot: {
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 5,
    margin: 5,
  },

  timeSlotText: {
    color: "#000",
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  emptyContainer: {},
  leftColumn: {
    flex: 2,
    flexDirection: "column",
  },
  rightColumn: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_PRIMARY,
    height: "100%",
    marginRight: 20,
  },
  input: {
    color: COLORS.PRIMARY,
    fontSize: normalize(12),
    // borderBottomColor:COLORS.GREEN,
    // borderBottomWidth:.5,
    // paddingTop:20,
    // marginTop:10
  },
  textContainer: {
    marginTop: 10,
  },
  containerForm: {
    flex: 1,
    borderTopColor: COLORS.GREEN,
    borderTopWidth: 0.5,
    paddingTop: 5,
    marginTop: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  borderWidth: {
    flex: 1,
    borderBottomColor: COLORS.LIGHTGREY,
    borderTopWidth: 0.5,
    width: "80%",
    marginLeft: 10,
    marginBottom: 10,
  },
});
export default DetailsScreen;
