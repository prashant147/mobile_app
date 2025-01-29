import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler
} from "react-native";
import React, { useEffect, useState } from "react";
import { normalize } from "../../styles/utilities/dimentions";
import style from "../../styles/style";
import DeviceInfo from "react-native-device-info";
import Menu from "../../routes/Menu";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import COLORS from "../../styles/theme/color";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCrewApplications,
  addMembersAsFavorite,
} from "../../services/api/auth";
import { ActivityIndicator } from "react-native-paper";
import { Switch } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
const MyApplications = ({ route }) => {
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation();
  const [myApplicationData, setMyApplicationData] = useState<any>(null);
  const token = AsyncStorage.getItem("accessToken");
  const [modalVisible, setModalVisible] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState({});
  const [loader, setLoader] = useState(false);
  const [setid, setId] = useState("");
  const [membersFavSwitch, setMembersFavSwitch] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
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

  const handleNavigateToDetails = async (id: any) => {
    const filteredData = myApplicationData.filter((item) => item.id === id);
    //console.log(filteredData)
    const adId =await AsyncStorage.getItem('advertisementId')
    navigation.navigate("ApplicationDetails", {
      applicationId: id, advertisementId:adId,
    });
  };


  const selectFavMember = async (item: any) => {
    try {
      const response = await addMembersAsFavorite(item.member?.id, token);
      if (response.status === 200) {
        let application = myApplicationData.map((item1:any) => {
          if(item1.id === item.id){
            item1.favorite = !item1.favorite;
          }
          return item1;
        });
        setMyApplicationData(application)
        // Retrieve the advertisementId from AsyncStorage
        AsyncStorage.getItem('advertisementId')
          .then((ID) => {
           
            if (ID) {
              getApplicationByAdvertisement(ID);
            }
          })
          .catch(error => {
            console.error('Error getting advertisement id:', error);
          });
      }
    } catch (error) {
      console.error("error", error);
    }
  };




  useFocusEffect(
    React.useCallback(() => {
    if (route && route.params) {
      
      const id = route.params.id;
      AsyncStorage.setItem('advertisementId', id)
        .then(() => {
       
          getApplicationByAdvertisement(id);
        })
        .catch(error => {
          console.error('Error setting advertisement id:', error);
        });
    }

    return () => {
    
      if (!isMounted) {
        AsyncStorage.removeItem('advertisementId')
          
      }
    };
    
  }, [route]));



  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('advertisementId')
        .then(id => {
         
          if (id) {
            getApplicationByAdvertisement(id);
          }
        })
        .catch(error => {
          console.error('Error fetching advertisement id:', error);
        });

      // Set isMounted to false when the component loses focus
      return () => setIsMounted(false);
    }, [])
  );

  const getApplicationByAdvertisement = async (AdvertisementId: string) => {
    try {
      setLoader(true);
      const response = await getCrewApplications(AdvertisementId);
      if (response.status === 200) {
        if (response.data) {
          //console.warn(JSON.stringify(response.data) )

          if (response.data[0].message != null) {
            setMyApplicationData(null);
          } else {
            setMyApplicationData(response.data);
          }
        } else {
          setMyApplicationData(null);
        }
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };
  useEffect(() => {
    let timeout: any;
    if (modalVisible) {
      timeout = setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible]);

  const toggleModal = (index) => {
    setModalVisible(!modalVisible);
    setIsRequestSent({
      ...isRequestSent,
      [index]: true,
    });
  };


  const renderMyApplications = ({ item, index }) => (
    <View style={styles.renderapplication}>
      <TouchableOpacity onPress={() => handleNavigateToDetails(item?.id)}>
        <Image
          source={item?.member?.profileUrl ? { uri: item?.member?.profileUrl } :require("../../assets/avatarImage.png")}
          style={styles.img}
        />
      </TouchableOpacity>
      
      <View style={[style.contant,style.centerItem]}>
        <View>
          <Text style={styles.nameTitleStyle}>MEMBER NAME</Text>
          <TouchableOpacity style={style.row} onPress={() => handleNavigateToDetails(item?.id)}>
            <Text style={[styles.nameTitleTextStyle,style.primaryText]}>{item?.member?.firstName} {item?.member?.lastName}</Text>
          </TouchableOpacity>

          <Text style={[styles.nameTitleStyle, style.mt10]}>QUALIFICATION</Text>
          <View style={style.row}>
            <Text style={[style.font14,style.primaryText]}>
              {item?.member?.oceanOrWorldClass
                ? item?.member?.oceanOrWorldClass.replace(/_/g, ' ')
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "flex-end" }}
          onPress={() => selectFavMember(item)}
        >
          <AntDesign
            name={item?.member?.favorite ? "heart" : "hearto"}
            size={normalize(20)}
            color={COLORS.GREEN}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleNavigateToDetails(item?.id)}>
          <Text style={[style.primaryText, style.mt20,style.font16]}>View More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[style.contant]}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          {!isTablet && <View style={style.sidepanelcolor}>
          <Menu selectIndex={7} />
          </View>}
        </View>
      </View>
      {!isTablet && (
        <View
          style={[
            style.contant,
            style.pH10,
            style.mtb20
          ]}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={[style.row, style.centerBox]}
              onPress={() => navigation.navigate("Crew")}
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
                Back
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              marginTop: 30,
            }}
          >
            <View>
              <Text style={[style.font14, style.boldTxt]}>
                View Applications
              </Text>
            </View>

            <View style={[style.row, style.centerBox, { marginTop: -8 }]}>
              <Text style={{ paddingRight: 10 }}>Fav</Text>
              <Switch
                onValueChange={() => setMembersFavSwitch(!membersFavSwitch)}
                value={membersFavSwitch}
                trackColor={{ false: "#767577", true: COLORS.PRIMARY }}
                thumbColor={COLORS.WHITE}
              />
            </View>
          </View>
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
              {myApplicationData === null ? (
                <View style={[style.centerItem, style.centerBox, style.mt40]}>
                  <Text>No Applications Found</Text>
                </View>
              ) : (
                <FlatList
                  data={
                    membersFavSwitch
                      ? myApplicationData.filter((e) => e.member.favorite)
                      : myApplicationData
                  }
                  renderItem={renderMyApplications}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};
export default MyApplications;

const styles = StyleSheet.create({
  renderapplication:{
    flexDirection: "row", 
    padding: 10,
    marginTop: 20 
  },
  img:{ 
    width: 90, 
    height: 90, 
    marginRight: 10 ,
    borderRadius:8
  },
  container: {
    flex: 1,
    marginTop: normalize(5),
  },
  leftColumn: {
    flex: 2,
    flexDirection: "column",
  },
  line: {
    borderTopWidth: 1,
    borderColor: COLORS.LINE,
    paddingVertical: normalize(5),
  },
  profileImg: {
    width: normalize(65),
    height: normalize(65),
    borderRadius: 8,
    resizeMode: "contain",
  },
  nameTitleStyle: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  nameTitleTextStyle: {
    color: COLORS.BLACK,
    fontSize: normalize(12),
    fontWeight: "600",
    lineHeight: 20,
    maxWidth: 150,
  },
  memberTitleText: {
    color: COLORS.LIGHT_BLACK,
    fontSize: normalize(12),
    lineHeight: 25,
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
    borderColor: COLORS.PRIMARY,
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
  modelUser: {
    width: 300,
    height: 500,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
});
