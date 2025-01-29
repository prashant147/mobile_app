
import moment from 'moment-timezone';
import { Alert, Linking, PermissionsAndroid } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export const dateFormat =(date)=>{
   return moment(date).format('MMM Do YYYY')
}
export const dateFormatFunction =(date)=>{
   return moment(date).format('YYYY MMM, Do')
}

export const sliceString = (value,length,) => {
   return value?.length > length ?  value.substring(0, length).concat('...') : value;
};
export const TimeZoneDateHandler = (date, timeZone) => {
   return moment.utc(date).tz(timeZone ? timeZone : 'America/New_York').format('MMM Do YYYY');
};

export const TimeZoneTimeHandler = (date, timeZone) => {
   return moment.utc(date).tz(timeZone ? timeZone : 'America/New_York').format('hh:mm A');
};

function convertToDegMin(coord, isLat) {
   const degrees = Math.floor(Math.abs(coord));
   const minutes = Math.floor((Math.abs(coord) - degrees) * 60);
   const direction = coord > 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
   return `${degrees}° ${minutes}' ${direction}`;
}

export function formatCoordinates(lat, lon) {
   const latDegMin = convertToDegMin(lat, true);
   const lonDegMin = convertToDegMin(lon, false);
   return `${latDegMin} ${lonDegMin}`;
}
export const checkPermissions = async () => {
   if (Platform.OS === 'android') {
     try {
       const granted = await PermissionsAndroid.request(
         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
         {
           title: 'Permission to access your photos',
           message: 'We need access to your photos to upload an image.',
           buttonNegative: 'Cancel',
           buttonPositive: 'OK',
         }
       );
 
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
         return true; // Permission granted
       } else {
         console.log('Permission denied');
         return false; // Permission denied
       }
     } catch (err) {
       console.warn(err);
       return false; // Permission error
     }
   
   } else if (Platform.OS === 'ios') {
     try {
       const permissionStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
       console.log('permissionStatus',permissionStatus);
       if (permissionStatus === RESULTS.GRANTED) {
         return true; // Permission granted
       } else {
         
         const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
         console.log('requestResult',requestResult);
         
         return requestResult === RESULTS.GRANTED;
       }
     } catch (error) {
       console.warn('Permission error:', error);
       return false;
     }
   }
 };
 export const permissionAlert = ()=>{
   Alert.alert(
      'Permissions Denied',
      'Please enable permissions in the settings to proceed.',
      [
        
        {
          text: 'Cancel',
          style:'default'
        },
        {
          text: 'Open settings',
          style:'default',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ],
      { cancelable: true }
    );
 }