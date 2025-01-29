import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import style from "../../styles/style";
import moment from "moment";
import { isTablet } from "react-native-device-info";
import { useContext, useState } from "react";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import COLORS from "../../styles/theme/color";
import { normalize } from "../../styles/utilities/dimentions";
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import CalendarEvents from 'react-native-calendar-events';
import { useNavigation } from "@react-navigation/native";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";
import { TimeZoneDateHandler, TimeZoneTimeHandler, dateFormat } from "../../styles/utilities/variables";
import MembersContext from "../Members/MembersContext";
import ModalNative from "react-native-modal";

interface UserInfoProps {
    isDark?:boolean
  } 
const UpcomingEvent: React.FC<UserInfoProps> = ({isDark=true,eventsData}:any) => {  
    const [selectTime,setSelectTime] = useState(moment().format("dddd, MMMM Do YYYY"))
    const [event,setEvent]  =useState(eventsData);
    const {loggedInUser,userTimeZone} = useContext(MembersContext);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const RenderEventItem = ({e}:any)=>{
      const registered = e?.participants?.find(item => item.id === loggedInUser.id) === undefined
        return (
            <View style={[style.mt10,style.whiteLayout,style.pH10,{borderRadius:4}]}>
            <View style={[style.row,]}>
                { <View style={{width: 70, height: 70,borderRadius:50,marginRight:10,padding: e.eventsMediasUrl? 0 :normalize(10),backgroundColor:"#f2f2f2"}}> 
                <Image
                resizeMode={"cover"}
                style={[{width: "100%", height: '100%',borderRadius: e.eventsMediasUrl? 50 :0}]}
                source={e.eventsMediasUrl ? {uri: e.eventsMediasUrl} :(e.type ==='EVENT' ? require('../../assets/dataImage/event_placeholder.png'):  require('../../assets/dataImage/rally_placeholder.png'))}></Image>
               </View>}
                <View style={[style.contant, {marginLeft: 5}]}>
                <Text style={[isTablet()?style.font18:style.font16,style.boldTxt]}>{e.name}</Text>
                <View style={style.row}>
                    <Text style={[isTablet()?style.font14:style.font14,style.grayText,style.mt10]}>Category</Text>
                    <Text style={[isTablet()?style.font14:style.font14,style.mt10,style.primaryText]}> {e.type}</Text>
                </View>
               <View style={[style.row,style.contentBetween,style.centerBox]}>
               <View>
               <Text style={[isTablet()?style.font14:style.font14,style.grayText,style.mt10]}>
                    {TimeZoneDateHandler(e.startDateTime,userTimeZone)}
                </Text>
                  <Text style={[isTablet()?style.font14:style.font14,style.grayText]}>
                    {TimeZoneTimeHandler(e.startDateTime,userTimeZone)}
                    </Text>
               </View>
                
               <View>
               <Text style={[isTablet()?style.font14:style.font14,style.grayText,style.mt10]}>
                    {TimeZoneDateHandler(e.endDateTime,userTimeZone)}
                </Text>
                  <Text style={[isTablet()?style.font14:style.font14,style.grayText]}>
                    {TimeZoneTimeHandler(e.endDateTime,userTimeZone)}
                    </Text>
               </View>
                
               </View>

                <View style={[style.row,{marginVertical:20},style.between]}>
                {!registered && <TouchableOpacity style={[style.button,{borderWidth:0.5}  ]} onPress={() => onAddEventHandler(e)}>
                    <Text style={[styles.buttonTxt]}>Add to my calendar</Text>
                    </TouchableOpacity>}
                  
                    <TouchableOpacity style={[style.button,{borderWidth:0.5,width:registered ? '100%' :'auto'},registered && style.primaryLayout]} onPress={() => onRegisterHandler(e)} disabled={!registered}>
                        <Text style={[styles.buttonTxt,registered && style.whiteText]}>{registered ? 'Register' :'Registered'}</Text>
                    </TouchableOpacity>
                   
                   
                </View>
                </View>
            </View>
            <View style={style.breakeLine}></View>
            </View>
        );
    }
    const navigation = useNavigation()
    const onRegisterHandler = (data: any) => {
        navigation.navigate('RallyForm', { 
          id: data.id,
          category:data.type,
          path:'Home',
        isPaid:data?.isPaidEvent ? data?.isPaidEvent: false 
      })
      };
    const onChangeDate = (days:any)=>{
        let newDays  = moment(selectTime,"dddd, MMMM Do YYYY").add(days,'days');
        setSelectTime(moment(newDays).format("dddd, MMMM Do YYYY"))
    }
    const onAddEventHandler = async (item:any) => {    
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_CALENDAR,
          PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR,
        ]);
        if (
          granted['android.permission.READ_CALENDAR'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_CALENDAR'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          const event = {
            title: item?.name,
            startDate: utcDateToString(item.startDateTime),
            endDate: utcDateToString(item.endDateTime),
            notes: item.description,
          };
          try {
            AddCalendarEvent.presentEventCreatingDialog(event)
              .then(eventInfo => {
                // alert(JSON.stringify(eventInfo));
      
              })
              .catch(error => {
                // alert('Error ', error);
                console.log('error', error);
              });
          } catch (error) {}
        } else {
          // Permission denied, handle accordingly
          console.log('Calendar permission denied');
        }
       
      }else{
        const event = {
          title: item?.name,
          startDate: utcDateToString(item.startDateTime),
          endDate: utcDateToString(item.endDateTime),
          notes: item.description,
        };
        try {
        //  const referenceDate = moment.utc('2001-01-01');
      //    const secondsSinceRefDateiOS = moment.utc(event.startDate)  - referenceDate.unix();
          await CalendarEvents.requestPermissions(false);
          await CalendarEvents.checkPermissions(true);
          await CalendarEvents.saveEvent(event.title, {
                startDate: event.startDate,
                endDate: event.endDate,
                notes: event.notes
          }).then(e=>{
            setShowSuccessModal(true)
            setTimeout(() => {
              setShowSuccessModal(false)
              },2000)
          })
        //  Linking.openURL(`calshow:${secondsSinceRefDateiOS}`);

        } catch (error) {}
      }
    };
    const utcDateToString = (momentInUTC:any) => {
        let s = moment(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        console.log(momentInUTC,s)
        return s;
    };
    return (
      <View>
        <View style={[style.row,style.mt15]}>
          <View style={[style.contant, style.row]}>
            <Icon
              name="calendar"
              size={20}
              color={isDark ? COLORS.WHITE : COLORS.BLACK}
              style={style.mr10}
            />
            <Text
              style={[
                isTablet() ? style.font18 : style.font16,
                style.boldTxt,
                isDark ? style.whiteText : style.BlackbuttonTxt,
              ]}>
              Upcoming Events
            </Text>
          </View>
        </View>
        <View style={[{backgroundColor:"white",borderRadius:8},style.pH10,style.mtb10]}>
        <View style={[style.row, style.mtb20,style.pH10]}>
          <View style={[style.contant, style.row,style.centerBox]}>
            <Text
              style={[
                style.font16,
                isDark ? style.whiteText : style.primaryText,
                {marginRight:5}
              ]}
              numberOfLines={2}>
              {selectTime} 
            </Text>
            <AntDesign
              name={'calendar'}
              size={normalize(15)}
              color={isDark ? COLORS.WHITE : COLORS.LIGHT_PRIMARY}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.iconBox,
              {
                borderColor: isDark ? COLORS.WHITE : COLORS.LIGHT_PRIMARY,
                marginRight: 12,
              },
              moment().format("dddd, MMMM Do YYYY") === selectTime ? {opacity : 0.3} : {opacity :1}
            ]}
            onPress={() => onChangeDate(-1)}
            disabled={moment().format("dddd, MMMM Do YYYY") === selectTime}
            >
            <AntDesign
              name={'left'}
              size={normalize(10)}
              color={isDark ? COLORS.WHITE : COLORS.LIGHT_PRIMARY}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconBox,
              {borderColor: isDark ? COLORS.WHITE : COLORS.LIGHT_PRIMARY},
            ]}
            onPress={() => onChangeDate(1)}>
            <AntDesign
              name={'right'}
              size={normalize(10)}
              color={isDark ? COLORS.WHITE : COLORS.LIGHT_PRIMARY}
            />
          </TouchableOpacity>
        </View>
        {eventsData && eventsData
          .filter((e:any)=> {
            const eventStartDate = moment(e.startDateTime)
            const eventEndDate = moment(e.endDateTime);
            const formattedDate = moment(selectTime, "dddd, MMMM Do YYYY").format("YYYY-MM-DD");
            return moment(formattedDate).isSameOrAfter(eventStartDate, 'day') &&  moment(formattedDate).isSameOrBefore(eventEndDate, 'day');
          })
          .map(e => (
            <View key={e.id}>
              <RenderEventItem e={e}></RenderEventItem>
            </View>
          ))}
        {eventsData && eventsData.filter(e => {
            const eventStartDate = moment(e.startDateTime)
            const eventEndDate = moment(e.endDateTime);
            const formattedDate = moment(selectTime, "dddd, MMMM Do YYYY").format("YYYY-MM-DD");
            return moment(formattedDate).isSameOrAfter(eventStartDate, 'day') &&  moment(formattedDate).isSameOrBefore(eventEndDate, 'day');
          }).length === 0 && (
         <View style={[style.row,style.centerBox,style.centerItem,style.mt20,style.mB10]}>
           <Text style={[style.font18]}>No Events Found</Text>
         </View>
        )}
        <View >
                          <TouchableOpacity onPress={() => navigation.navigate('RalliesEvents')} style={[style.Blackbutton,style.mt20,{marginBottom:20,borderRadius:8}]}>
                            <Text style={[style.BlackbuttonTxt,style.font16]}>View Full Calender</Text>
                          </TouchableOpacity>
                        </View>
</View>
      <ModalNative
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            isVisible={showSuccessModal}
            backdropColor='rgba(0, 0, 0, 0.3)'>  
              <View style={[style.p20,style.whiteLayout,style.borderRadius8]}>
                <Text style={[style.font14,style.boldTxt,style.textCenter]}>
                Event successfully added to calendar.
                </Text>
              </View>
          </ModalNative>
      </View>
    );
}
const styles = StyleSheet.create({
  buttonTxt:{
    
    color:COLORS.LIGHT_PRIMARY,
    justifyContent:'center',
    fontSize:normalize(12)
 },
    iconBox:{
      borderWidth:1,
      borderRadius:3,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      width:20,
      height:20
    }
   })
export default UpcomingEvent;
