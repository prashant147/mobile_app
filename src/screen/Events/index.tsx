import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import Header from '../../components/Header';
import DeviceInfo from 'react-native-device-info';
import { normalize, scaleWidth } from '../../styles/utilities/dimentions';
import UserInfo from '../../components/UserInfo';
import Icon from 'react-native-vector-icons/Feather';
import BackIcon from 'react-native-vector-icons/FontAwesome';
import MyLogs from './MyLogs';
import UpcommingEvents from './UpcommingEvents';
import Addevents from './Addevents';
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import LocationIcon from 'react-native-vector-icons/EvilIcons';
import UserIcon from 'react-native-vector-icons/AntDesign';
import Menu from '../../routes/Menu';
import dayjs from 'dayjs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { getAllEvents, getEventsFilter } from '../../services/api/auth';
import MembersContext from '../Members/MembersContext';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';
import { TimeZoneDateHandler, TimeZoneTimeHandler, dateFormat, sliceString } from '../../styles/utilities/variables';
import ModalNative from "react-native-modal";
import Hyperlink from 'react-native-hyperlink';
import WebView from 'react-native-webview';

const today = new Date(); // Get current date and time

// Events for today
const events = [
  {
    title: 'Meeting',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
    location: 'California Port',
    organizer: 'Jack Sparrow',
    description: 'From sailing sea to roaring soares the movement of cool bridge makes the sea...'
  },
  {
    title: 'Coffee break',
    start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 45),
    end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30),
    location: 'California Port',
    organizer: 'Jack Sparrow',
    description: 'From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors...'
  },
];

// Events for yesterday
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

events.push(
  {
    title: 'Lunch',
    start: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 12, 0),
    end: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 13, 0),
    location: 'California Port',
    organizer: 'Jack Sparrow',
    description: 'From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors...'
  }
);

// Events for tomorrow
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

events.push(
  {
    title: 'Training',
    start: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
    end: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0),
    location: 'California Port',
    organizer: 'Jack Sparrow',
    description: 'From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors...'
  }
);




const EventsScreen = ({item,route}: any) => {
  const { setChatData,setHideChatbotMember, setHideChatbot,accessToken ,loggedInUser,userTimeZone,setSelectedMenu} = useContext(MembersContext);
  const isTablet = DeviceInfo.isTablet();
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState(0);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [joinEvent, setJoinEvent] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [type, setType] = useState('year');
  const [viewType, setViewType] = useState("This Year");
  const [current, setCurrent] = useState(dayjs())
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [getUpcomingEventsData,setGetUpcomingEventsData] = useState([])
  const [getAllEventsData,setGetAllEventsData] = useState([])
  const [loader,setLoader] = useState(false)
  const [showModal,setShowModal] = useState(false)
  const [webViewHeight, setWebViewHeight] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      setSelectedMenu(4)
      if (selectedEvent) {
        setHideChatbot(true)
        setHideChatbotMember(true)
      } else {
        setHideChatbot(false)
        setHideChatbotMember(false)
      }
    }, [selectedEvent])
  )

  useEffect(() => {
    const backAction = () => {
      setSelectedEventId(null);
      setSelectedEvent(null);
      setActiveTab(0)
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      if(!route?.params?.item){
      setSelectedEvent(null)
      setSelectedEventId(null);
      }
      getEventsDataHandler()
      getAllEventsDataHandler()
    }, [route])
  );


  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentDate, setCurrentDate] = useState(moment());
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const start = moment(currentDate).startOf(type);
    setStartDate(start.format('YYYY-MM-DD'));

    const end = moment(currentDate).endOf(type);
    setEndDate(end.format('YYYY-MM-DD'));
  }, [currentDate]);

  useEffect(() => {
    const filteredData = getAllEventsData.filter(event => {
        const startDateTime = moment(event.startDateTime);
        const endDateTime = moment(event.endDateTime);
        const startDateMoment = moment(startDate);
        const endDateMoment = moment(endDate);

     
            return startDateTime.isBetween(startDateMoment, endDateMoment, undefined, '[)') ||
                endDateTime.isBetween(startDateMoment, endDateMoment, undefined, '(]') ||
                (startDateTime.isSameOrBefore(startDateMoment ,type) && endDateTime.isSameOrAfter(endDateMoment, type));
        
    });

    setFilteredEvents(filteredData);
}, [getAllEventsData, startDate, endDate, type]);


const goToCurrent =()=>{
  setCurrentDate(moment());
}
  const goToPrev = () => {
    setCurrentDate(moment(currentDate).subtract(1, type));
  };

  const goToNext = () => {
    setCurrentDate(moment(currentDate).add(1, type));
  };
  const getAllEventsDataHandler =async ()=>{
    setLoader(true)
    try{
      const response = await getAllEvents(accessToken)
      if(response.status===200){
        const sorted = response.data.sort((a, b) => {
          const dateA = new Date(a.startDateTime);
          const dateB = new Date(b.startDateTime);
          return dateA - dateB;
        })
        const filterEvents = sorted.filter(item => item.type ==='EVENT')
        setGetAllEventsData(filterEvents)
        setLoader(false)
      }
    }catch(error){
      console.error(error);
      setLoader(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
    if(route?.params?.item  && getAllEventsData){
      const filterEventId = getAllEventsData?.find((item) => item?.id === route?.params?.item)
      setSelectedEventId(route?.params?.item)
      setSelectedEvent(filterEventId)
    }
  },[route,getAllEventsData]))

  const getEventsDataHandler =async ()=>{
    try{
      const response = await getEventsFilter(accessToken,'upcoming')
      if(response.status===200){
        setGetUpcomingEventsData(response.data)
        
      }
    }catch(error){
      console.error(error);
    }
  }
  const handleEventPresss = (item: any) => {
    if(route?.params?.path){
      navigation.navigate(route?.params?.path)
    } else {
    setSelectedEventId(item?.id === selectedEventId?.id ? null : item.id);
    setSelectedEvent(item?.id === selectedEventId?.id ? null : item)
    setActiveTab(0)
    }
  };


  useEffect(() => {
    setActiveTab(0);
  }, [])

  const showPopover = (event: any) => {
    setPopoverAnchor(event.target);
    setPopoverVisible(true);
  };

  const hidePopover = () => {
    setPopoverVisible(false);
  };

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
    showPopover(event);
  };

 
 


  
  const renderEventItem = ({ item, index }: any) => {

    const getBackgroundColor = (id: any) => {
      const colors = [COLORS.BORDERGREY, COLORS.PRIMARY]; // Define colors here
      return colors[id % colors.length]; // Use modulo to ensure the index stays within the range of colors
    };
    return (
      <TouchableOpacity onPress={() => handleEventPresss(item)}>
        <View style={[style.pH10,{ backgroundColor: index % 2 === 0 ? COLORS.PRIMARY : COLORS.OFFWHITE, borderWidth: 1, borderColor: COLORS.WHITE ,paddingVertical:15}, style.borderRadius5,style.mB15]}>
          <View>
        
              <View>
                <View style={[style.contant,style.row,style.contentBetween,style.centerBox]}>
                <Text style={[style.font14, index % 2 === 0 ? style.whiteText : style.primaryText, style.boldTxt, style.centerBox]}>{sliceString(item?.name,40)}</Text>
                <View> 
                {item.participants?.find(item => item.id === loggedInUser.id) && <Text style={[style.contant,style.font14, index % 2 === 0 ?  style.primaryText : style.whiteText,{backgroundColor: index % 2 === 0 ?  COLORS.OFFWHITE : COLORS.PRIMARY },style.borderRadius5,style.p5]}>Registered</Text>}
                </View>
                </View>
                <View style={[style.row,style.contentBetween,style.centerBox]}>
                  <View style={[style.mtb10]}>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneDateHandler(item.startDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneTimeHandler(item.startDateTime,userTimeZone)}</Text>
                  </View>
                  <View style={[style.mH20]}>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneDateHandler(item.endDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneTimeHandler(item.endDateTime,userTimeZone)}</Text>
                  </View>
                </View>
      
     
            </View>
            <View style={[style.row,style.centerBox]}>
            { item.location && <View style={[style.row,{ borderColor: 'black' },style.centerBox]}>
                <LocationIcon name='location' size={20} color={index % 2 === 0 ? COLORS.WHITE : COLORS.PRIMARY} />
                <Text style={style.grayText}> {sliceString(item.location,20)}</Text>
              </View>}

            {item.organizerName &&  <View style={[style.row,style.mH10,style.centerBox]}>
                <UserIcon name='user' size={15} color={index % 2 === 0 ? COLORS.WHITE : COLORS.PRIMARY} />
                <Text style={style.grayText}> {sliceString(item.organizerName,15)}</Text>
              </View>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  const convertDateFormat = (dateString) => {
    const parsedDate = moment(dateString, 'YYYY-MM-DD');
    const currentYear = moment().year();
    const parsedYear = parsedDate.year();
    let formattedDate;
    if (parsedYear === currentYear) {
        formattedDate = parsedDate.format('DD MMM');
    } else {
        formattedDate = parsedDate.format('DD MMM YYYY');
    }
    
    return formattedDate;
};



  const renderScreens = (activeTab: number) => {
    switch (activeTab) {
      case 0:
        return <>
          <View style={[ style.contentBetween]}>
            
            {/* <TouchableOpacity
              onPress={() => setActiveTab(1)}
              style={[style.button, style.borderRadius8, { maxWidth: scaleWidth(200), marginLeft: 20 }]}>
              <Text style={[style.font14, style.primaryText]}>My Log</Text>
            </TouchableOpacity> */}
          </View>

          <View>
            <View style={[style.contentBetween]}>
              <View style={[style.row, { borderWidth: 1, backgroundColor: COLORS.PRIMARY, height: normalize(35) },style.borderRadius5]}>
                <TouchableOpacity style={[style.centerItem,style.borderRadius5, { backgroundColor: type == "week" ? COLORS.WHITE : COLORS.PRIMARY, paddingHorizontal: 10 ,paddingVertical:5}]} onPress={() => {
                  setType("week");
                  setViewType("This Week");
                  goToCurrent()
                }}>
                  <Text style={[style.font14, { color: type == "week" ? COLORS.PRIMARY : COLORS.WHITE }]}>Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.mH5, style.centerItem, style.borderRadius5,{ backgroundColor: type == "month" ? COLORS.WHITE : COLORS.PRIMARY, paddingHorizontal: 10 ,paddingVertical:5 }]} onPress={() => {
                  setType("month");
                  setViewType("This Month");
                  goToCurrent()
                }}>
                  <Text style={[style.font14, { color: type == "month" ? COLORS.PRIMARY : COLORS.WHITE }]}>Month</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.centerItem, style.borderRadius5,{ backgroundColor: type == "year" ? COLORS.WHITE : COLORS.PRIMARY, paddingHorizontal: 10 ,paddingVertical:5 }]} onPress={() => {
                  setType("year");
                  setViewType("This Year");
                  goToCurrent()
                }}>
                  <Text style={[style.font14, { color: type == "year" ? COLORS.PRIMARY : COLORS.WHITE }]}>Year</Text>
                </TouchableOpacity>
              </View>
              <View style={[{ flexDirection: "row", justifyContent: 'space-between' },]}>
                <TouchableOpacity style={[style.mH5, style.centerItem, style.borderRadius5,{ borderWidth: 1, borderColor: COLORS.PRIMARY },currentDate.isSame(moment(), 'day') ? {opacity : 0.3} : {opacity :1}]} disabled={currentDate.isSame(moment(), 'day')} onPress={goToPrev}>
                  <Icon name='chevron-left' size={25} color={COLORS.PRIMARY} />
                </TouchableOpacity>
                <TouchableOpacity style={[style.mH5, style.centerItem,  style.borderRadius5,{ borderWidth: 1, borderColor: COLORS.PRIMARY },currentDate.isSame(moment(), type)? {opacity : 0.3} : {opacity :1}]} onPress={goToCurrent} disabled={currentDate.isSame(moment(), type)}>
                  <Text style={[style.font14, style.primaryText, { padding: 4 }]}>{viewType}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[style.mH5, style.centerItem, style.borderRadius5, { borderWidth: 1, borderColor: COLORS.PRIMARY }]} onPress={goToNext}>
                  <Icon name='chevron-right' size={25} color={COLORS.PRIMARY} />
                </TouchableOpacity>
              </View>
            </View>

          </View>
          {/* {type == "month" && 
          <ScrollView style={[style.contant]}>
            <Text numberOfLines={2}  style={[style.font16,style.primaryText,style.boldTxt,style.mtb10]}>{current.format('MMMM YYYY')}</Text>
              <Calendar events={events} height={600}  date={current.toDate()} onPressEvent={handleEventPress} mode={type} />
           </ScrollView>
    }
    {type == "week" && 
          <ScrollView style={[style.contant]}>
            <Text numberOfLines={2}  style={[style.font16,style.primaryText,style.boldTxt,style.mtb10]}>{current.format('MMMM YYYY')}</Text>
              <Calendar events={events} height={600}  date={current.toDate()} onPressEvent={handleEventPress} mode={type} />
           </ScrollView>
    }
    {type == "day" && 
          <ScrollView style={[style.contant]}>
            <Text numberOfLines={2}  style={[style.font16,style.primaryText,style.boldTxt,style.mtb10]}>{current.format('MMMM YYYY')}</Text>
              <Calendar events={events} height={600}  date={current.toDate()} onPressEvent={handleEventPress} mode={type} />
           </ScrollView>
    } */}
          <View style={[style.mt10]}>
            <Text style={[style.font16]}>
              {convertDateFormat(startDate)} {type !=='day' && '-'} {type !=='day' && convertDateFormat(endDate)}
            </Text>
          </View>
        {loader ? 
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
              <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'}/>
           </View> 
           :  
          (
            filteredEvents.filter(event => {
              const endDateTime = moment(event.endDateTime);
              const currentMoment = moment(); 
              return endDateTime.isAfter(currentMoment);
            })?.length > 0 ? 
            <FlatList
            style={[style.mtb10]}
            scrollEnabled={true}
            horizontal={false}
            data={filteredEvents.filter(event => {
              const endDateTime = moment(event.endDateTime);
              const currentMoment = moment(); 
              return endDateTime.isAfter(currentMoment);
            })}
            contentContainerStyle={[style.pb80]}
            renderItem={renderEventItem} />
            :
            <View style={[style.row,style.centerBox,style.centerItem,style.contant]}>
            <Text style={[style.font18]}>No events found </Text>
          </View>

          )
         }
          

        </>
        break;

      case 1:
        // return <MyLogs setActiveTab={setActiveTab} />
        break;
      case 2:
        // return <UpcommingEvents setActiveTab={setActiveTab} />
        return <>
        

    { loader ? 
            <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
              <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} size={'small'}/>
           </View> 
           : 
     (
          getAllEventsData?.length > 0 ? 
          <FlatList
          style={[style.mtb10]}
          scrollEnabled={true}
          horizontal={false}
          data={getAllEventsData.filter(event => {
            const endDateTime = moment(event.endDateTime);
            const currentMoment = moment(); 
            return endDateTime.isBefore(currentMoment);
          })}
          renderItem={renderEventItem} />
          :
          <View style={[style.row,style.centerBox,style.centerItem,style.contant]}>
          <Text style={[style.font18]}>No events found </Text>
        </View>

        )
    }
     
        

      </>
        break;
      case 3:
        return <Addevents setActiveTab={setActiveTab} />
        break;

    }
  }
const isRegistered = selectedEvent?.participants?.find(item => item.id === loggedInUser.id)
const msgClickHandler =()=>{
  if(isRegistered){
    
    // setChatData({id:selectedEvent?.memberGroups[0]?.id,type:'group'});
    setChatData({id:selectedEvent?.id,type:'group'});
    navigation.navigate("WebChat")
  }else{

    setShowModal(true)
  }
}
const htmlContent = ` 
  <!DOCTYPE html>
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
            font-size: 16px;
            color: black;
            white-space: normal;
            margin: 0;
            padding: 0;
            overflow: hidden; 
          }
          a {
            color: blue;
            text-decoration: underline;
          }
      </style>
  </head>
  <body>
  ${selectedEvent?.description || ''}
  </body>
  </html>
`;
  const onWebViewMessage = (event) => {
    const height = event.nativeEvent.data;
    setWebViewHeight(parseInt(height, 10));
  };
  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{ flex: 2 }]}>
          <View style={[style.sidepanelcolor]}> 
           <Menu selectIndex={4} />
           </View>
        </View>
      </View>
      <View style={[style.pt20,style.contant]}>
      <View>
        <View style={[style.row,style.centerBox,style.between,style.pH20]}>
            <View style={[style.row,style.centerBox]}>
             {(activeTab !==0 || selectedEventId !== null )&&<TouchableOpacity style={style.row}
                onPress={() => handleEventPresss(item)}>
                <BackIcon name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY} />
                <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
              </TouchableOpacity>}
            </View>
            {activeTab !== 2 && !selectedEvent && <TouchableOpacity
              onPress={() => setActiveTab(2)}
              >
              <Text style={[style.font14, style.primaryText]}>View History</Text>
            </TouchableOpacity>}
            {activeTab === 2 && <Text style={[style.font14,style.fiordText]}>Past Events</Text>}
          </View>
          </View>
      {selectedEvent && selectedEventId?.id === item?.id ?
        <View
          style={[
            style.contant,
            style.pH20,
          ]}>
         

          <ScrollView style={[style.contant, style.mtb20]}>
            <View style={[style.row]}>
              <Text style={[style.font16, style.boldTxt]}>Event title :  </Text>
              <Text style={[style.font16, style.primaryText, style.boldTxt, style.centerItem]}>{selectedEvent?.name.length > 25 ? selectedEvent?.name.substring(0,25).concat('...') : selectedEvent?.name}</Text>
            </View>
            <View style={[style.row]}>
              <Text style={[style.font14, style.boldTxt, style.mtb10]}>Date/time :  </Text>
              <View style={[style.row,style.contentBetween,style.centerBox]}>
                  <View style={[style.mtb10,style.mH20]}>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneDateHandler(selectedEvent?.startDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneTimeHandler(selectedEvent?.startDateTime,userTimeZone)}</Text>
                  </View>
                  <View>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneDateHandler(selectedEvent?.endDateTime,userTimeZone)}</Text>
                    <Text style={[style.font12, style.grayText]}>{TimeZoneTimeHandler(selectedEvent?.endDateTime,userTimeZone)}</Text>
                  </View>
                </View>
            </View>
            <View style={[style.row]}>
              <Text style={[style.font14, style.boldTxt]}>Category :  </Text>
              <Text style={[style.font14, style.grayText]}>{selectedEvent?.type}</Text>
            </View>
            <View style={[style.contentBetween, style.mt10]}>
              <View>
                <View style={[{ flexDirection: "row", borderColor: 'black' }]}>
                  <LocationIcon name='location' size={25} color={COLORS.PRIMARY} />
                  <Text style={[style.font14, style.primaryText]}>{sliceString(selectedEvent?.location,25)}</Text>
                </View>

                <View style={[{ flexDirection: 'row', borderColor: 'black' }, style.mtb10]}>
                  <UserIcon name='user' size={20} color={COLORS.PRIMARY} />
                  <Text style={[style.font14, style.primaryText, style.mH5]}>{sliceString(selectedEvent.organizerName,25)}</Text>
                </View>
              </View>
              <View style={[styles.btnsAlignment, style.mt5]}>
                <TouchableOpacity style={[styles.userIcons, { borderColor: COLORS.PRIMARY }]} onPress={msgClickHandler}>
                  <Icon name='message-square' size={25} color={COLORS.PRIMARY} />
                </TouchableOpacity>
                <Text style={[style.font12, style.primaryText]}>Message</Text>
              </View>
            </View>
            {moment(selectedEvent.endDateTime).isSameOrAfter(moment()) ? 


          <View>
              {
                selectedEvent?.participants?.find(item => item.id === loggedInUser.id) === undefined ?
                <TouchableOpacity style={[styles.joinBtn, style.mt10]} onPress={() =>navigation.navigate("EventWebview", { id: selectedEvent.id,path:'RalliesEvents'})}
                // onPress={() =>  navigation.navigate('RallyForm', { id: selectedEvent.id,category:'EVENT',path:'RalliesEvents' ,isPaid:selectedEvent?.isPaidEvent ? selectedEvent?.isPaidEvent: false})} 
                >
                  <Text style={{ color: COLORS.WHITE, fontSize: 14 }}>{"Register"}</Text>
              </TouchableOpacity>
            :  <TouchableOpacity style={[styles.linkBtnRegistered, style.mt10]} disabled={true}>
                <Text style={[styles.linkBtnTextRegistered]}>Registered</Text>
              </TouchableOpacity> 
              }
          </View>
          :
            <TouchableOpacity style={[styles.linkBtnCompleted, style.mt10]} disabled={true}>
            <Text style={[styles.linkBtnTextRegistered]}>Event Completed </Text>
            </TouchableOpacity>
            }

            <View style={style.mtb10}>
              <Text style={[style.font16, style.boldTxt]}>Description</Text>
              <WebView
              source={{ html: htmlContent }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              style={{
                height: webViewHeight > 0 ? webViewHeight * 1.1 : Dimensions.get('screen').height * 0.52, // Default to 52% of screen height
                backgroundColor: 'transparent',
                width: Dimensions.get('screen').width * 0.9,
              }}
              showsVerticalScrollIndicator={false}
              allowsBackForwardNavigationGestures={true}
              onNavigationStateChange={(event) => {
                const { url } = event;
                if (url && url.startsWith('http')) {
                  Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
                  return false;
                }
                return true;
              }}
              injectedJavaScript={`
                (function() {
                  setTimeout(() => {
                    const height = document.body.scrollHeight;
                    const minHeight = 50; // Set a minimum height to ensure visibility for small content
                    window.ReactNativeWebView.postMessage((height < minHeight ? minHeight : height).toString());
                  }, 100); // Delay to ensure content is fully loaded
                })();
              `}
              onMessage={onWebViewMessage}
              scrollEnabled={false}
              cacheEnabled={true}
              startInLoadingState={true}
            />
            </View>
            <View style={style.mtb10}>
              <Text style={[style.font16, style.boldTxt]}>Event Participants ({selectedEvent?.participants?.length}) </Text>
              {selectedEvent?.participants?.map((item,index) =>{
                return(

                   <Text style={[style.font14, style.mt5]}>{index + 1}. {item.firstName + ' ' + item.lastName}</Text>
                )
              })}
            </View>
          </ScrollView>
        </View>
        :
        <View
          style={[
            style.contant,
            style.pH20,
           
          ]}>
          <View style={[styles.headerContainer,style.mB15]}>
            {/* <TouchableOpacity 
           onPress={()=>setActiveTab(3)}
          activeOpacity={.8} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
            <Icon name="plus" size={20} color={COLORS.WHITE}/>
          </TouchableOpacity> */}
          </View>

          <View style={[style.contant]}>
            {renderScreens(activeTab)}
          </View>
        </View>
      }
      </View>
      <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            isVisible={showModal}
            onBackdropPress={()=>setShowModal(false)}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                <Text style={[style.font14,style.boldTxt,style.textCenter]}>
                If you aren't registered, you will be directed to the organizer's chat, registered redirects to the group chat
                </Text>
                <View style={[style.row,style.centerItem,style.centerBox,style.mt20]}>
                <TouchableOpacity style={[style.primaryLayout,style.button,{width:'50%'}]} onPress={()=>{
                  setChatData({id:selectedEvent?.organizerId,type:'user'});
                  setShowModal(false);
                  navigation.navigate("WebChat")
                }}>
                 <Text style={[style.whiteText]}>Message</Text>
                </TouchableOpacity>
                </View>
              </View>
          </ModalNative>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  image: {
    height: normalize(60),
    width: normalize(80),
    borderRadius:8
  },
  linkBtnRegistered: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(6),
    borderRadius: 4,
    marginVertical: normalize(5),
    width: normalize(70)
  },
  linkBtnCompleted: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(6),
    borderRadius: 4,
    marginVertical: normalize(5),
    width: normalize(110)
  },
  linkBtnTextRegistered: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  btnStyle: {
    backgroundColor: COLORS.PRIMARY,
    // paddingHorizontal: normalize(2),
    // marginRight:normalize(20),
    paddingVertical: normalize(5),
    flexDirection: 'row',
    borderRadius: normalize(6),
    height: normalize(30),
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    marginBottom: 10
  },
  joinBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
    borderWidth: 1,
    paddingHorizontal: normalize(5),
    paddingVertical: normalize(6),
    borderRadius: 4,
    marginVertical: normalize(5),
    width: normalize(70)
  },
  popoverContent: {
    padding: 16,
  },
  popoverTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black'
  },
  popoverTime: {
    fontSize: 18,
    marginBottom: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  popoverLocation: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    display: "flex",
    alignItems: "center",
  },
  description: {
    fontSize: 16,
    color: COLORS.GREY
  },
  phonedescription: {
    fontSize: 12,
    color: COLORS.GREY
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstButton: {
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.LIGHT_PRIMARY,
    borderWidth: 1
  },

  buttonText: {
    color: COLORS.LIGHT_PRIMARY,
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addBtn: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(5),
    flexDirection: 'row',
    borderRadius: normalize(4)
  },
  addBtnText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    marginRight: normalize(10)
  },
  btnsAlignment: {
    flexDirection: "column", alignItems: 'center'
  },
  userIcons: {
    width: 40,
    height: 40,
    borderWidth: 1.2,
    alignItems: "center",
    display: 'flex',
    justifyContent: "center",
    borderRadius: 5,
    marginBottom:normalize(5)
  },
  favIconTxt: {
    fontSize: 12, textAlign: 'center',
    color: COLORS.WHITE
  },
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.WHITE,
  },
});

export default EventsScreen;
