import { Dimensions, Linking, View } from "react-native"
import { useRef } from "react";
import style from "../../../styles/style"
import TabBox from "../../../components/TabBox";
import { btoa} from 'react-native-quick-base64';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { normalize } from "../../../styles/utilities/dimentions";
import WebView from "react-native-webview";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import COLORS from "../../../styles/theme/color";
import { getAllWebinars, getPastWebinars, getUpcomingWebinars, getWebinarById, registerWebinars } from "../../../services/api/auth";
import MembersContext from "../../Members/MembersContext";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import DeviceInfo from "react-native-device-info";
import { TouchableOpacity } from "react-native";
import { TimeZoneDateHandler, TimeZoneTimeHandler, dateFormat } from "../../../styles/utilities/variables";
import moment from "moment";
import BackIcon from 'react-native-vector-icons/FontAwesome';
import RenderInput from "../../BecomeMember/RenderInput";
import ModalNative from "react-native-modal";

interface EducationScreenProps {
    onSelect:any 
    selected:string
    selectedIndex:any
    webinarId:any
    webinarBackPath:any
    setwebinarBackPath:any
    setWebinarId:any
}
const EducationScreen: React.FC<EducationScreenProps> = ({selected,onSelect,selectedIndex,webinarId,webinarBackPath,setwebinarBackPath,setWebinarId}) => { 
  const navigation = useNavigation()
  const [educationDataHtml, setEducationDataHtml] = useState([]);
  const [webinarData, setWebinarData] = useState([]);
  const [webinarTab, setWebinarTab] = useState(0);
  const [selectedWebinarData, setSelectedWebinarData] = useState(null);
  const [webinarDataLoader, setWebinarDataLoader] = useState(false);
  const [educationDataHtmlLoader, setEducationDataHtmlLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { accessToken,loggedInUser,setHideChatbotMember, setHideChatbot,userTimeZone } = useContext(MembersContext);
  const isTablet = DeviceInfo.isTablet();
  useFocusEffect(React.useCallback(() => {
    fetchWebinars()
    fetchData();
  }, [selected,submitSuccess]));
  
  useEffect(()=>{
if(webinarTab === 0){
  setHideChatbot(false)
  setHideChatbotMember(false)
}else{
  setHideChatbot(true)
  setHideChatbotMember(true)

}
  },[webinarTab])
  const fetchData = async () => {
    try { 
      setEducationDataHtmlLoader(true)
      const response = await fetch('https://saltydawgsailing.cloudfirstgroup.com/wp-json/wp/v2/pages', {
        headers: {
          Authorization: 'Basic ' + btoa('admin@qennect.com' + ':' + 'qEnnect1@3$'),
        },
      });
      if (!response.ok) {
        setEducationDataHtmlLoader(false)
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if(response.status === 200){
        const getPrivacyPolicyData = data.filter(item => !item.slug.toLowerCase().includes('privacy') && !item.slug.toLowerCase().includes('home') ).sort((a, b) => {
          const sortKeyOne = a.title.rendered.toLowerCase();
          const sortKeyTwo = b.title.rendered.toLowerCase();
          // Move items containing 'sdsa' to the end
          if (sortKeyOne.includes('sdsa') && !sortKeyTwo.includes('sdsa')) {
            return 1; // 'a' comes after 'b'
          } else if (!sortKeyOne.includes('sdsa') && sortKeyTwo.includes('sdsa')) {
            return -1; // 'a' comes before 'b'
          } else {
            return 0; 
          }
        })
        setEducationDataHtml(getPrivacyPolicyData);
        setEducationDataHtmlLoader(false)
      }
      
    } catch (error) {
      setEducationDataHtmlLoader(false)
      console.error('Error fetching data:', error);
    }
    finally {
      setEducationDataHtmlLoader(false)
          }
  };
    
  useFocusEffect(
    React.useCallback(()=>{
      const getwebinarByIdHandler = async ()=>{
        try {
          if(webinarId){
            const response = await getWebinarById(webinarId,accessToken)
            setSelectedWebinarData(response.data)
            setWebinarTab(1);
            setWebinarId(null)
          }
        } catch (error) {
          console.error(error);
        }
      }
      getwebinarByIdHandler()

    },[webinarId])
  )
  const fetchWebinars = async () => {
    try {
      setWebinarDataLoader(true);
      if(selected ==="Webinars"){
        const response = await getUpcomingWebinars(accessToken);
        if (response.status === 200) {
          setWebinarData(response.data);
          setWebinarDataLoader(false);
        }
      }else{
        const response = await getPastWebinars(accessToken);
        if (response.status === 200) {
          setWebinarData(response.data);
          setWebinarDataLoader(false);
        }
      }
    } catch (error) {
      setWebinarDataLoader(false);
      console.error(error);
    }
  };
  // const tabData = educationDataHtml.map((item) => item.title.rendered);
  const tabData = ["About Education","2024 Webinars","Preparing for Offshore","SDSA Cruising Guide: Cuba"];
  useEffect(()=>{
    if(tabData){
      onSelect(tabData[0])
    }
  },[])
  

  
  const backBtnHandler =()=>{
    if(webinarBackPath){
      navigation.navigate(webinarBackPath)
      setwebinarBackPath(null)
      setWebinarTab(0)
    }else if(webinarTab === 2){
      setWebinarTab(1)
    }else if(webinarTab === 1){
      setWebinarTab(0)
    }
  }

  const getUri = (selected:any) => {
    switch (selected) {
      case "About Education":
        return "https://sdsa.memberclicks.net/about-education";
      // case "2024 Webinars":
      //   return "https://sdsa.memberclicks.net/2024-webinars";
      case "Access to Webinar Library":
        return "https://sdsa.memberclicks.net/access-to-webinar-library";
      case "Preparing for Offshore":
        return "https://sdsa.memberclicks.net/preparing-for-offshore-edu";
      case "SDSA Cruising Guide: Cuba":
        return "https://sdsa.memberclicks.net/sdsa-cruising-guide-cuba";
      default:
        // return "https://sdsa.memberclicks.net/about-education";
    }
  };

  const registerFormHandler = async ()=>{
    const data = selectedWebinarData?.webinarSeries.map(subItem =>{
        return subItem.id
      })
    const payload_data = {
      id:selectedWebinarData?.id,
      webinarSeries:null,
      "payment": {
        "firstName": "'",
        "lastName": "",
        "company": "",
        "creditCardNumber": "",
        "creditCardType": "",
        "cvv": "",
        "expirationMonth": "",
        "expirationYear": "",
        "addressDto": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "country": "",
          "city": "",
          "postalCode": "",
          "streetAddress1": "",
          "streetAddress2": "",
          "state": "",
          "isPrimary": true,
          "isPreferred": true,
          "isBillingAddress": true
        }
      }
    }
    try {
      setSubmitLoader(true)
      setSubmitSuccess(false)
      const response = await registerWebinars(payload_data,accessToken)
      if(response.status === 200){
        setSubmitSuccess(true)
        setSubmitLoader(false)
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false);
          setWebinarTab(0)
          setSelectedWebinarData(null)
        }, 2000);
        
        
      }
    } catch (error) {
      setSubmitLoader(false)
      setSubmitSuccess(false)
      console.error(error);
      
    }
  }
  const OpenUrlHandler = (item:any) => {
    Linking.canOpenURL(item?.webinarUrl).then((supported) => {
      if (supported) {
        Linking.openURL(item?.webinarUrl);
      } else {
        Linking.openURL(item.webinarUrl);
      }
    });
  };
  
    return (
      <View style={style.contant}>
        
          <View style={[style.contant]}>
            <TabBox
              data={tabData}
              selectedTab={selected}
              onTab={(tab: string) => onSelect(tab)}
              scrollEnabled={true}
            ></TabBox>
             {selected === "2024 Webinars" && 
              <View style={[style.contant]}>
                <Text style={[style.font16,style.boldTxt,style.textCenter,style.mt15]}>Members can access recordings below:</Text>
                <View style={[style.mt15,style.centerBox]}>
                
                <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]} onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/webinar-series---fall-2024-recordings",path:'Education',})}}>2024 Fall webinar recordings here</Text>
                  <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]} onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/webinar-series---winter-2024-recordings",path:'Education',})}}>2024 Winter/Spring webinar recordings here</Text>
                  <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]} onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/webinar-series---2023-fall-recordings",path:'Education',})}}>2023 Fall webinar recordings here</Text>
                  <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]} onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/webinar-series---2023-recordings",path:'Education',})}}>2023 Spring webinar series recordings here</Text>
                  <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]} onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/webinar-series---2022-fall-recordings",path:'Education',})}}> 2022 webinar series recordings here</Text>
                  <Text style={[style.mtb5,style.font16,styles.webinarsLinksStyle]}onPress={()=>{navigation.navigate('EducationWebview',{link:"https://sdsa.memberclicks.net/members-only---library-of-webinar-recordings--arh",path:'Education',})}}>2021 webinar recordings here</Text>
                  </View>
              </View>
              }
            {webinarDataLoader && educationDataHtmlLoader ? (
          <View
            style={[
              style.contant,
              style.row,
              style.centerBox,
              style.centerItem,
            ]}
          >
            <ActivityIndicator
              theme={{ colors: { primary: COLORS.PRIMARY } }}
              size={"small"}
            />
          </View>
        ) : (
            <ScrollView
              style={[style.contant]}
              showsVerticalScrollIndicator={false}
            >
              {/* {(selected === "Webinars" || selected === "Past Webinars") && (
                <View style={[style.contant]}>
                  {webinarTab === 0 && (
                    <View style={[style.contant]}>
                      <View>
                        {webinarData?.length > 0 ? webinarData.map((item) => (
                          <TouchableOpacity
                            style={[style.button, style.mt5, style.whiteLayout]}
                            onPress={() => {
                              setSelectedWebinarData(item);
                              setWebinarTab(1);
                            }}
                          >
                            <Text style={[style.primaryText]}>{item.name}</Text>
                          </TouchableOpacity>
                        )): (<View style={[style.contant,style.centerBox,style.centerItem,style.mt40]}>
                          <Text style={[style.font16]}>
                            No Webinars Found
                          </Text>
                        </View>) }
                      </View>
                    </View>
                  )}
                  {webinarTab === 1 && (
                    <View style={[style.contant]}>
                      <TouchableOpacity
                        style={[style.row]}
                        onPress={backBtnHandler}
                      >
                        <BackIcon
                          name="chevron-left"
                          size={normalize(15)}
                          style={[style.mt3, style.mr10]}
                          color={COLORS.PRIMARY}
                        />
                        <Text
                          style={[
                            isTablet ? style.font24 : style.font16,
                            style.boldTxt,
                            style.primaryText,
                          ]}
                        >
                          Back
                        </Text>
                      </TouchableOpacity>
                      <View style={[style.between]}>
                        <Text
                          style={[
                            style.font20,
                            style.boldTxt,
                            style.BlackbuttonTxt,
                            style.contant,
                            style.mt15,
                          ]}
                        >
                          {selectedWebinarData?.name}
                        </Text>

                        {moment(
                          selectedWebinarData?.webinarSeries[0]?.startDateTime
                        ).year() >= moment().year() ? (
                          <TouchableOpacity
                            style={[
                              style.button,
                              style.mtb10,
                              { width: "40%" },
                              selectedWebinarData?.isRegistered
                                ? style.whiteLayout
                                : style.primaryLayout,
                            ]}
                            onPress={() => setWebinarTab(2)}
                            disabled={selectedWebinarData?.isRegistered}
                          >
                            <Text
                              style={[
                                selectedWebinarData?.isRegistered
                                  ? style.primaryText
                                  : style.whiteText,
                              ]}
                            >
                              {selectedWebinarData?.isRegistered
                                ? "Registered"
                                : "Register"}
                            </Text>
                          </TouchableOpacity>
                        )
                      :( <TouchableOpacity
                        style={[
                          style.button,
                          style.mtb10,
                          , style.whiteLayout,styles.btnwidth
                        ]}
                        onPress={() => setWebinarTab(2)}
                        disabled={true}
                      >
                        <Text
                          style={[ style.primaryText
                            
                          ]}
                        >
                         Webinar Completed
                        </Text>
                      </TouchableOpacity>)
                      }
                      </View>
                      {selectedWebinarData && (
                        <View style={[style.mtb10]}>
                          {selectedWebinarData?.webinarSeries.map(
                            (webinar, index) => (
                              <View key={index} style={[style.row]}>
                                <View
                                  style={[
                                    style.contant,
                                    styles.headerCell,
                                    { borderLeftWidth: 0.7 },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      isTablet ? style.font14 : style.font12,style.primaryText
                                    ]}
                                  >
                                    {webinar.startDateTime ? TimeZoneDateHandler(webinar.startDateTime,userTimeZone) : 'TBD'}
                                  </Text>
                                </View>
                                <View
                                  style={[style.contant, styles.headerCell]}
                                >
                                  <Text
                                    style={[
                                      isTablet ? style.font14 : style.font12,,style.primaryText
                                    ]}
                                  >
                                    {webinar.startDateTime ? TimeZoneTimeHandler(webinar.startDateTime,userTimeZone) :''}
                                  </Text>
                                </View>
                                <View
                                  style={[style.contant, styles.headerCell]}
                                >
                                  <View style={style.contant}>
                                    <Text style={style.BlackbuttonTxt}>
                                      {webinar.name}
                                    </Text>
                                    <Text
                                      style={[style.BlackbuttonTxt, style.mt10]}
                                    >
                                      {webinar?.description}
                                    </Text>
                                  </View>
                                </View>
                                <View
                                  style={[
                                    style.contant,
                                    styles.headerCell,
                                    { borderRightWidth: 0.7 },
                                  ]}
                                >
                                {(moment(selectedWebinarData?.webinarSeries[0]?.startDateTime).year() >= moment().year() || selected ==="Webinars") ?
                                    (selectedWebinarData?.isRegistered ?
                                        (webinar.webinarUrl && webinar.webinarUrl !=='string' && webinar.webinarUrl !==null ? 
                                        <TouchableOpacity onPress={()=>OpenUrlHandler(webinar)}>
                                          <Text style={[style.font14,styles.recording]}>Recording Here</Text>
                                        </TouchableOpacity>
                                            :
                                        (<Text style={[isTablet ? style.font14 : style.font12]}>
                                            Coming Soon
                                          </Text>
                                        )
                                        ) :
                                      <Text style={[isTablet ? style.font14 : style.font12]}>
                                        Register for All Free for Salty Dawg MembersNon-Members pay $12 for this webinar
                                      </Text>
                                    )
                                  : 
                                    (webinar.webinarUrl && webinar.webinarUrl !=='string' && webinar.webinarUrl !==null && 
                                      <TouchableOpacity onPress={()=>OpenUrlHandler(webinar)}>
                                        <Text style={[style.font14,styles.recording]}>Recording Here</Text>
                                      </TouchableOpacity>
                                    )
                                }
                                </View>
                              </View>
                            )
                          )}
                        </View>
                      )}
                    </View>
                  )}
                  {webinarTab === 2 && (
                    <View style={[style.contant]}>
                      <TouchableOpacity
                        style={[style.row]}
                        onPress={backBtnHandler}
                      >
                        <BackIcon
                          name="chevron-left"
                          size={normalize(15)}
                          style={[style.mt3, style.mr10]}
                          color={COLORS.PRIMARY}
                        />
                        <Text
                          style={[
                            isTablet ? style.font24 : style.font16,
                            style.boldTxt,
                            style.primaryText,
                          ]}
                        >
                          Back
                        </Text>
                      </TouchableOpacity>
                      <View style={[style.between]}>
                        <Text
                          style={[
                            style.font20,
                            style.boldTxt,
                            style.BlackbuttonTxt,
                            style.contant,
                            style.mt15,
                          ]}
                        >
                          {selectedWebinarData?.name}
                        </Text>
                        <Text style={[style.font14, style.mtb10]}>
                          This series includes the following webinars
                        </Text>
                      </View>
                      {selectedWebinarData && (
                        <View style={[style.mtb10]}>
                          {selectedWebinarData?.webinarSeries.map(
                            (webinar, index) => (
                              <View key={index} style={[style.mtb10]}>
                                <Text style={[style.font16]}>
                                  {webinar.name}
                                </Text>
                                <Text style={[style.font14, style.mt3,style.primaryText]}>
                                  {webinar.startDateTime ? TimeZoneDateHandler(webinar.startDateTime,userTimeZone) :"TBD"}
                                </Text>
                                <Text style={[style.font14, style.mt3,style.primaryText]}>
                                  {webinar.startDateTime ?TimeZoneTimeHandler(webinar.startDateTime,userTimeZone) :''}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      )}
                      <View>
                        <RenderInput
                          name={"First Name"}
                          placeholder={"Enter First Name"}
                          value={loggedInUser.firstName}
                          readOnly={true}
                        />
                        <RenderInput
                          name={"Last Name"}
                          placeholder={"Enter Last Name"}
                          value={loggedInUser.lastName}
                          readOnly={true}
                        />
                        <RenderInput
                          name={"Email"}
                          placeholder={"Enter Email"}
                          value={
                            loggedInUser?.emailAddress?.filter(
                              (item) => item.type === "PRIMARY"
                            )[0]?.email
                          }
                          readOnly={true}
                        />
                      </View>
                      <Text style={[style.font14]}>
                        All webinars {selectedWebinarData?.name}*
                      </Text>
                      <View style={[style.row, style.centerBox]}>
                        <RadioButton.Android
                          color={COLORS.PRIMARY}
                          status={"checked"}
                        />
                        <Text style={[style.font14]}>Webinar Fees - $0.00</Text>
                      </View>
                      <TouchableOpacity
                        style={[style.button, style.mtb10, style.primaryLayout]}
                        onPress={registerFormHandler}
                      >
                        {submitLoader ? (
                          <ActivityIndicator
                            theme={{ colors: { primary: "white" } }}
                          />
                        ) : (
                          <Text style={[style.whiteText]}>Register</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}  */}
              {(
                <WebView
                  source={{ uri :getUri(selected)
                  }}
                  onLoadStart={() => setWebinarDataLoader(true)}
                    onLoadEnd={() => {setTimeout(() => {
                      setWebinarDataLoader(false) 
                    }, 1500);}}
                    onLoad={() => {setTimeout(() => {
                      setWebinarDataLoader(false) 
                    }, 1500);}}
                    onLoadProgress={() => setWebinarDataLoader(true)}
                  cacheEnabled={true}
                    originWhitelist={['*']}
                    useWebView2={true}
                    sharedCookiesEnabled={true}
                    useSharedProcessPool={true}
                    thirdPartyCookiesEnabled={true}
                    cacheMode='LOAD_CACHE_ELSE_NETWORK'
                    scalesPageToFit={true} 
                    javaScriptEnabled={true} // Enable JavaScript for iframe interactions
                    domStorageEnabled={true}
                  style={{
                    height: Dimensions.get("screen").height * 0.7,
                    backgroundColor: "transparent",
                    paddingBottom: 80,
                  }}
                  allowsMagnification={false} // Disable zooming
                  allowsZoom={false} // Disable zooming
                  useWebKit={false} // Use WebKit engine
                  injectedJavaScript={`
                          const meta = document.createElement('meta');
                          meta.setAttribute('name', 'viewport');
                          meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                          document.head.appendChild(meta);
                          // Disable text selection and copying
                          document.documentElement.style.webkitUserSelect='none';
                      `}
                  scrollEnabled={true}
                />
              )}
            </ScrollView>)}     
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
      </View>
    );

}
export default EducationScreen;
const styles = StyleSheet.create({
  recording:{
    textDecorationStyle:'solid',textDecorationLine:"underline",color:COLORS.PRIMARY
  },
  btnwidth:{ width: "60%" },
  headerCellBlue: {
    backgroundColor: COLORS.LIGHT_PRIMARY,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    borderColor: COLORS.BLACK,
    borderWidth: 0.5,
    padding: 5,
  },
  webinarsLinksStyle:{
    textDecorationStyle:'solid',
    textDecorationLine:"underline",
    color:COLORS.PRIMARY,
    fontWeight:'600'
  }
});