import React, {useContext, useEffect, useState} from 'react';
import {
  View,
} from 'react-native';
import style from '../../styles/style';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import DeviceInfo from 'react-native-device-info';
import Header from '../../components/Header';

import DetailsScreen from '../../screen/Volunteer/Details';
import VolunteerInfo from './VolunteerInfo';
import UserInfo from '../../components/UserInfo';
import Menu from '../../routes/Menu';
import { BackHandler } from 'react-native';
import { getAllEvents } from '../../services/api/auth';
import MembersContext from '../Members/MembersContext';
import { ActivityIndicator } from 'react-native-paper';
import COLORS from '../../styles/theme/color';
import crashlytics from '@react-native-firebase/crashlytics';

import moment from 'moment';
const Volunteer = ({route}) => {
  const {accessToken,setSelectedMenu}=useContext(MembersContext)
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const isTablet = DeviceInfo.isTablet();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [note, setNote] = useState('');
  const [loader, setLoader] = useState(false);
  const [getAllEventsData, setGetAllEventsData] = useState([]);
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    if (route?.params?.item) {
      setEventId(route?.params?.item);
      route.params = null;
    } else {
      setEventId(null);
    }
  }, [route]);

 useFocusEffect(
  React.useCallback(()=>{
    setSelectedMenu(3)
    getAllEventsDataHandler()
  },[updateSuccess])
 )
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

       
        const filterEvents = sorted.filter(item => item.isVolunteer === true && moment(item.endDateTime).isAfter(moment()) )

        
        setGetAllEventsData(filterEvents)
        setLoader(false)
      }
    }catch(error){
      crashlytics().log(error );
      setLoader(false)
    }
  }

  const handleSave = () => {
    // Handle form submission here
    console.log('Form data:', {firstName, lastName, workEmail, note});
    // You can add your logic to handle form submission or API calls here
  };

  const navigation = useNavigation();
  let tabData = ['Volunteer', 'Volunteer Form'];
  const handlePress = () => {
     
  }
  return (
    <View style={[style.contant]}>
      <View style={style.sidepanelcolor}>
        <Menu selectIndex={3} />
      </View>

      {loader ? (
        <View
          style={[style.contant, style.row, style.centerBox, style.centerItem]}
        >
          <ActivityIndicator
            theme={{ colors: { primary: COLORS.PRIMARY } }}
            size={"small"}
          />
        </View>
      ) : (
        <View style={[style.contant]}>
       
            <VolunteerInfo
              loader={loader}
              getAllEventsData={getAllEventsData}
              setUpdateSuccess={setUpdateSuccess}
              eventId={eventId}
            />
          
          
        </View>
      )}
    </View>
  );
};

export default Volunteer;
