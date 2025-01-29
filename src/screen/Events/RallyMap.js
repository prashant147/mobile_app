import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    PermissionsAndroid,
    Platform,
    Keyboard,
  } from "react-native";
  import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
  import style from "../../styles/style";
  import Menu from "../../routes/Menu";
  import BackIcon from "react-native-vector-icons/FontAwesome";
  import Entypo from "react-native-vector-icons/Entypo";
  import { normalize } from "../../styles/utilities/dimentions";
  import COLORS from "../../styles/theme/color";
  import { BackHandler } from "react-native";
  import { useFocusEffect, useNavigation } from "@react-navigation/native";
  import { Dimensions } from "react-native";
  import MembersContext from "../Members/MembersContext";
  import {
    getRallyLocation,
    getBoatByMMSI,
    getBoatRallyTrack,
  } from "../../services/api/auth";
  import { ActivityIndicator } from "react-native-paper";
  import moment from "moment";
  import ModalNative from "react-native-modal";
  import GetLocation from "react-native-get-location";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import {formatCoordinates} from "../../styles/utilities/variables";
  import MapView, { Marker, Callout, Polyline } from "react-native-maps";
  import RenderDropdown from "../BecomeMember/RenderDropdown";
  import MaterialIcons from "react-native-vector-icons/MaterialIcons";
  import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
  
  export default function RallyMap({ route }) {
    const navigation = useNavigation();
    const { accessToken, setSelectedMenu } =useContext(MembersContext);
    const [polylineCoords, setPolylineCoords] = useState([]);
    const [vesselsData, setVesselsData] = useState([]);
    const [boatsList, setBoatsList] = useState([]);
    const mapRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [VesselName, setVesselName] = useState("");
    const [rallyName, setRallyName] = useState("");
    const [boatModal, setBoatModal] = useState(false);
    const [boatModalMsg, setBoatModalMsg] = useState("");
    const [selectedBoat, setSelectedBoat] = useState(null);
    const markerRef = useRef(null);
    const [mapType, setMapType] = useState("satellite");
    const [region, setRegion] = useState(null);
  
    const toggleMapType = () => {
      setMapType((prevType) =>
        prevType === "satellite" ? "standard" : "satellite"
      );
    };
  
    const unixToHours = (unixTimestamp) => {
      if(moment(unixTimestamp).isValid()){
        return moment(unixTimestamp).fromNow();
      }else{
        return 'None'
      }
    };
    const requestLocationPermission = async () => {
      try {
        PermissionsAndroid;
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app requires access to your location.",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED && VesselName === '') {
          // Fetch current location when permission is granted
          fetchCurrentLocation();
        } else {
          console.error("location Location permission denied");
          // Handle the case when permission is denied
        }
      } catch (err) {
        console.warn(err);
      }
    };
    useFocusEffect(React.useCallback(()=>{
      if(VesselName === '' &&route && route.params && !route?.params?.marker ){        
        fetchCurrentLocation();
      }
    },[route,VesselName]))
    useFocusEffect(
      React.useCallback(() => {
        if (Platform.OS === "android") {
          requestLocationPermission();
        }
        if(route && route.params && route?.params?.marker){
          setVesselName(route?.params?.marker.YachtName)
        }
            if (route?.params?.rallyName) {
          setRallyName(route?.params?.rallyName);
        }
      }, [route])
    );
  
    const fetchCurrentLocation = async () => {
      setVesselName("");
      try {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 60000,
        });
        if (location && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500
          );
        }
      } catch (error) {
        const { code, message } = error;
        console.warn(code, message);
      }
    };
  
    useFocusEffect(
      React.useCallback(() => {
        const fetchLocation = async () => {
          const newRegion = {
            latitude: 37.034946,
            longitude: -76.360123,
            latitudeDelta: 7,
            longitudeDelta: 7,
          };
          setRegion(newRegion);
        };
        fetchLocation();
      }, [])
    );
  
  
    useEffect(() => {
      const backAction = () => {
        handlePressBack();
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        setSelectedMenu(14);
      }, [])
    );
  
    const handlePressBack = () => {
      navigation.navigate("Rallies",{item:route?.params?.item});
      setVesselName("");
    };
  
    useFocusEffect(
      React.useCallback(() => {
        const getData = async () => {
          let keyword = "";
          if (rallyName.toLowerCase().includes("downeast")) {
            keyword = "downeast2024";
          } else if (rallyName.toLowerCase().includes("caribbean")) {
            keyword = "fall2024";
          }else if (rallyName.toLowerCase().includes("january jump")) {
            keyword = "jump2025";
          }
          else if (rallyName.toLowerCase().includes("azores")) {
            keyword = "azores2025";
          }
  
          try {
            const response = await getRallyLocation(keyword);
            if (response.status === 200) {
              setBoatsList(response.data);
              const vesselData = response.data.map((item) => ({
                value: item.boatname,
                label: item.boatname,
              }));
              setVesselsData(vesselData);
              setLoading(false);
            }
          } catch (error) {
            console.error(error);
          }
        };
        if (
          rallyName.toLowerCase().includes("downeast") ||
          rallyName.toLowerCase().includes("caribbean") ||
          rallyName.toLowerCase().includes("january jump") ||
          rallyName.toLowerCase().includes("azores")
        ) {
          setTimeout(() => {
            getData();
          }, 2000);
        }
        if(route?.params?.reload){
          setLoading(true)
          setPolylineCoords([])
          markerRef.current?.hideCallout()
        }
      }, [rallyName, route?.params?.reload])
    );
  
    const getBoatDetails = async (marker) => {
      try {
        const response = await getBoatByMMSI(marker?.MMSI, accessToken);
        if (response.status === 200) {
          if (response?.data?.message === "Boat not found!") {
            setBoatModalMsg(
              "Unable to retrieve member details, MMSI ID is not updated."
            );
            setBoatModal(true);
            setTimeout(() => {
              setBoatModal(false);
            }, 3000);
          } else if (response?.data?.boatOwner) {
            navigation.navigate("MemberDetails", {
              id: response?.data?.boatOwner,
              path: "RallyMap",
              item: route?.params?.item,
              rallyName:route?.params?.rallyName,
              marker:marker
            });
          } else {
            setBoatModalMsg("No Boat Owner found");
            setBoatModal(true);
            setTimeout(() => {
              setBoatModal(false);
            }, 3000);
          }
        }
      } catch (error) {
        console.error("getBoatByMMSI Error", error);
  
        setBoatModalMsg(
          "Unable to retrieve member details, MMSI ID is not updated 123."
        );
        setBoatModal(true);
        setTimeout(() => {
          setBoatModal(false);
        }, 3000);
      }
    };
  
    const onMarkerClick = async (marker) => {
      setPolylineCoords([]);
      let keyword = "";
      if (rallyName.toLowerCase().includes("downeast")) {
        keyword = "downeast2024";
      } else if (rallyName.toLowerCase().includes("caribbean")) {
        keyword = "fall2024";
      }else if (rallyName.toLowerCase().includes("january jump")) {
        keyword = "jump2025";
      }else if (rallyName.toLowerCase().includes("azores")) {
        keyword = "azores2025";
      }
      const boatnameMMSI = `${marker.boatname.replace(/ /g, "_")}_${marker.MMSI}`;
      try {
        const response = await getBoatRallyTrack(
          keyword,
          boatnameMMSI,
          marker.MMSI
        );
        if (response.status === 200) {
          const coordinates = response.data.map((point) => ({
            latitude: parseFloat(point.p.lat),
            longitude: parseFloat(point.p.lon),
          }));
          setPolylineCoords(coordinates);
          setSelectedBoat(marker);
          setTimeout(() => {
            markerRef.current?.showCallout();
          }, 100);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    const getBoatLocation = (coords) => {
      if (coords && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.4,
            longitudeDelta: 0.4,
          },
          1000
        );
      }
    };
  
    const handleSearch = () => {
      Keyboard.dismiss();
      const searchList = boatsList?.filter((boat) =>
        boat.boatname?.toLowerCase().includes(VesselName?.toLowerCase())
      );
      if (Array.isArray(searchList) && searchList.length === 0) {
        Alert.alert("No Boat found !!!");
      }
      const selectedBoat = searchList[0];
      let coords = {
        latitude: searchList[0]?.position?.lat,
        longitude: searchList[0]?.position?.lon,
      };
      getBoatLocation(coords);
      onMarkerClick(selectedBoat);
      navigation.setParams({
        marker:null
      })
    };
    useEffect(() => {
      const timeOutSearch = setTimeout(() => {
        if (VesselName !== '') {
          Keyboard.dismiss();
          handleSearch();
        } else {
          Keyboard.dismiss();
          // zoomOut();
        }
      }, 1000);
      return () => clearTimeout(timeOutSearch);
    }, [VesselName])
  
    const memoizedCard = useMemo(() => {
      if (loading) {
        return (
          <View style={[style.mt40, style.contant]}>
            <ActivityIndicator
              color={COLORS.PRIMARY}
              size={"small"}
              style={[style.centerBox, style.mt40]}
            />
          </View>
        );
      } else {
        return (
          <View>
            <MapView
              ref={mapRef}
              region={region}
              style={styles.mapView}
              showsMyLocationButton={false}
              showsUserLocation={true}
              mapType={mapType}
              loadingEnabled={true}
            >
              {boatsList.length > 0 &&
                boatsList?.map((marker, index) => {
                  let boatImage;
                  if (marker?.distance > 0) {
                    boatImage = require("../../assets/svg/green_sailboat.png");
                  } else if (marker.last > 12 && marker.last < 13) {
                    boatImage = require("../../assets/svg/yellow_sailboat.png");
                  } else if (marker.last > 24) {
                    boatImage = require("../../assets/svg/red_sailboat.png");
                  } else if (marker.Watch == 1) {
                    boatImage = require("../../assets/svg/blue_sailboat.png");
                  } else if (marker?.distance === 0) {
                    boatImage = require("../../assets/svg/grey_anchor.png");
                  }
  
                  return (
                    <Marker
                      key={index}
                      ref={selectedBoat?.MMSI === marker.MMSI ? markerRef : null}
                      image={boatImage}
                      coordinate={{
                        latitude: marker?.position.lat,
                        longitude: marker?.position.lon,
                      }}
                      onPress={() => {
                        onMarkerClick(marker);
                      }}
                    >
                      {
                        <Callout onPress={() => getBoatDetails(marker)}>
                          <TouchableHighlight underlayColor="#dddddd">
                            <View style={styles.customView}>
                              <Text
                                style={[
                                  styles.valueCell,
                                  { fontSize: normalize(16) },
                                ]}
                              >
                                {marker.YachtName}
                              </Text>
                              <Text
                                style={[
                                  styles.valueCellName,
                                  { color: COLORS.BLACK },
                                ]}
                              >
                                {formatCoordinates(
                                  marker.position.lat,
                                  marker.position.lon
                                )}
                              </Text>
                              <Text
                                style={[
                                  styles.valueCellName,
                                  { color: COLORS.BLACK },
                                ]}
                              >
                                {marker.last} hrs since last report
                              </Text>
                              <Text
                                style={[
                                  styles.valueCellName,
                                  { color: COLORS.BLACK },
                                ]}
                              >
                                {marker.speed} kn / {marker.bearing} {"\u00B0T"}{" "}
                                last reported
                              </Text>
                              <Text
                                style={[
                                  styles.valueCellName,
                                  { color: COLORS.BLACK },
                                ]}
                              >
                                {marker.Length + "' " + marker.Model}
                              </Text>
                              {
                                <Text
                                  style={[
                                    styles.valueCellName,
                                    { color: COLORS.BLACK },
                                  ]}
                                >
                                  {"Last Update:" +
                                    (marker?.position?.time
                                      ? unixToHours(marker?.position?.time)
                                      : "Data not available")}
                                </Text>
                              }
                            </View>
                          </TouchableHighlight>
                        </Callout>
                      }
                    </Marker>
                  );
                })}
              {polylineCoords.length > 0 && (
                <Polyline
                  coordinates={polylineCoords}
                  strokeWidth={3}
                  strokeColor={mapType === "satellite" ? "yellow" : "blue"}
                />
              )}
            </MapView>
            {!loading && (
              <TouchableOpacity
                onPress={toggleMapType}
                style={[styles.satilliteLocation]}
              >
                {mapType === "satellite" ? (
                  <Entypo
                    style={[style.positionRel]}
                    name="globe"
                    size={25}
                    color={COLORS.LIGHTGREY}
                  />
                ) : (
                  <FontAwesome6Icon
                    style={[style.positionRel]}
                    name="satellite"
                    size={25}
                    color={COLORS.LIGHTGREY}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      }
    }, [
      loading,
      boatsList,
      selectedBoat,
      polylineCoords,
      route?.params?.rallyTabIndex,
      mapType,
    ]);
  
    return (
      <View style={style.contant}>
        <View style={[style.row]}>
          <View style={[{ flex: 2 }]}>
            <View style={style.sidepanelcolor}>
              <Menu selectIndex={14} />
            </View>
          </View>
        </View>
        <View style={[style.contant, style.pt10]}>
          <View>
            <View style={[style.row, style.mH10]}>
              <TouchableOpacity style={[style.row]} onPress={handlePressBack}>
                <BackIcon
                  name="chevron-left"
                  size={normalize(15)}
                  style={[style.mr10, style.mt3]}
                  color={COLORS.PRIMARY}
                />
                <Text style={[style.font16, style.boldTxt, style.primaryText]}>
                  Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
  
          <View style={style.contant}>
            {
              <View style={[style.contant, style.row, style.pH10]}>
                <ScrollView
                  style={[style.contant]}
                  showsVerticalScrollIndicator={false}
                >
                  <RenderDropdown
                    heading={"Find a boat"}
                    placeholder={"Select boat"}
                    search={false}
                    data={vesselsData}
                    value={VesselName}
                    onChange={(item) => setVesselName(item.label)}
                    selectedItem={VesselName}
                  />
                  <View
                    style={[style.contant, style.mB30, styles.mapViewSection]}
                  >
                    <View style={[styles.mapViewContainer, style.mt5]}>
                      {memoizedCard}
  
                      {Platform.OS !== "ios" && !loading && (
                        <TouchableOpacity
                          style={[styles.currentLocation]}
                          onPress={fetchCurrentLocation}
                        >
                          <MaterialIcons
                            style={style.positionRel}
                            name="my-location"
                            size={25}
                            color={COLORS.LIGHTGREY}
                          />
                        </TouchableOpacity>
                      )}
                      {Platform.OS !== "android" && !loading && (
                        <TouchableOpacity
                          style={[styles.currentLocation]}
                          onPress={fetchCurrentLocation}
                        >
                          <Ionicons
                            style={style.positionRel}
                            name="navigate-outline"
                            size={25}
                            color={COLORS.LIGHT_PRIMARY}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </ScrollView>
              </View>
            }
          </View>
        </View>
  
        <ModalNative
          animationIn={"zoomIn"}
          animationOut={"zoomOut"}
          isVisible={boatModal}
          backdropColor="rgba(0, 0, 0, 0.3)"
        >
          <View style={[style.p20, style.whiteLayout, style.borderRadius8]}>
            <Text style={[style.font14, style.boldTxt, style.textCenter]}>
              {boatModalMsg}
            </Text>
          </View>
        </ModalNative>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    msgIcon: {
      borderColor: COLORS.PRIMARY,
      marginTop: normalize(35),
    },
    ResFont: {
      fontSize: Dimensions.get("screen").width * 0.035,
      fontFamily: "Roboto-Regular",
      color: COLORS.BLACK,
    },
    userIcons: {
      width: normalize(35),
      height: normalize(35),
      borderWidth: 1.2,
      marginRight: normalize(15),
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      borderRadius: 5,
    },
    menuContainerCard: {
      flex: 2,
    },
    table: {
      borderColor: COLORS.BLACK,
      borderWidth: 0.5,
      paddingHorizontal: normalize(6),
      paddingVertical: normalize(10),
    },
    image: {
      height: normalize(60),
      width: normalize(80),
      borderRadius: 8,
    },
    mb50: {
      marginBottom: normalize(50),
    },
    card: {
      backgroundColor: "#2952A7",
      paddingVertical: normalize(10),
      paddingHorizontal: normalize(10),
      marginVertical: normalize(5),
      marginHorizontal: normalize(10),
      borderRadius: 8,
    },
    linkBtn: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.PRIMARY,
      borderWidth: 1,
      paddingHorizontal: normalize(5),
      paddingVertical: normalize(6),
      borderRadius: 4,
      marginVertical: normalize(5),
      width: normalize(100),
      height: normalize(35),
    },
    linkBtnComplete: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.PRIMARY,
      borderWidth: 1,
      paddingHorizontal: normalize(8),
      paddingVertical: normalize(6),
      borderRadius: 4,
      marginVertical: normalize(5),
      // width: normalize(120),
      height: normalize(35),
    },
    linkBtnRegistered: {
      justifyContent: "center",
      alignItems: "center",
      borderColor: COLORS.PRIMARY,
      borderWidth: 1,
      paddingHorizontal: normalize(5),
      paddingVertical: normalize(5),
      borderRadius: 4,
      marginVertical: normalize(5),
      width: normalize(100),
      height: normalize(35),
    },
    linkBtnText: {
      color: COLORS.WHITE,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
    },
    linkBtnTextRegistered: {
      color: COLORS.PRIMARY,
      fontSize: 14,
      fontFamily: "Roboto-Regular",
    },
    title: {
      fontWeight: "bold",
      alignSelf: "center",
      paddingVertical: 10,
    },
    root: {
      flex: 1,
      marginTop: 0,
      marginBottom: 0,
    },
    editor: {
      flex: 1,
      height: Dimensions.get("screen").height * 0.5,
    },
    nextBtn: {
      paddingHorizontal: normalize(15),
      paddingVertical: normalize(8),
      marginVertical: normalize(3),
      margin: normalize(3),
    },
    WebView: {
      height: 50,
      backgroundColor: "#2952A7",
    },
    descContainer: {
      // top:100,
      // position:'absolute',
      // zIndex:0,
      // width:'100%'
    },
    menuContainer: {
      position: "absolute",
      right: Dimensions.get("screen").width * 0.02,
      width: Dimensions.get("screen").width * 0.5,
      backgroundColor: "white",
      zIndex: 999,
    },
    mapView: {
      width: "100%",
      height: Dimensions.get("screen").height * 0.66,
      borderRadius: 20,
      marginBottom: 10,
    },
    map: {
      width: "100%",
      height: Dimensions.get("screen").height / 1.8,
      borderRadius: 20,
    },
    customView: {
      padding: 5,
      borderRadius: 10,
      backgroundColor: "white",
    },
    currentLocation: {
      position: "absolute",
      bottom: normalize(20),
      right: normalize(15),
      backgroundColor: COLORS.WHITE,
      padding: normalize(10),
      borderRadius: 10,
    },
    satilliteLocation: {
      position: "absolute",
      bottom: normalize(65),
      right: normalize(15),
      backgroundColor: COLORS.WHITE,
      padding: normalize(10),
      borderRadius: 10,
    },
    valueCell: {
      flex: 2,
      textAlign: "left",
      paddingHorizontal: 8,
      fontWeight: "600",
      color: COLORS.DARK_PRIMARY,
    },
    valueCellName: {
      flex: 2,
      textAlign: "left",
      paddingHorizontal: 8,
      color: COLORS.BLACK_50,
    },
    rallyNameStyle: {
      width: Dimensions.get("screen").width * 0.3,
    },
  });
  