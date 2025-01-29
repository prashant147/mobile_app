import { Dimensions, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React,{useState,useRef,useEffect, useMemo} from 'react'
import MapView, { Marker, Callout,Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import { getMemberBoatView } from '../../services/api/auth';
import { ActivityIndicator } from 'react-native';
import style from '../../styles/style';
import { useIsFocused } from '@react-navigation/native';

const MapDetails = ({region,boatsList,coords,search,loading}:any) => {

    const mapRef = useRef(null);
    const [polylineCoords, setPolylineCoords] = useState([]);



    const getBoatLocation = (coords) => {
      
        if (coords && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
         }

        if (search == '') {
            zoomOut()
        }
      }; 

      const zoomOut = () => {
        const newRegion = {
          ...region,
          latitudeDelta: region.latitudeDelta + 0.1,
          longitudeDelta: region.longitudeDelta + 0.1,
        };
        mapRef?.current?.animateToRegion(newRegion, 1000);
      };
      useEffect(() => {
        getBoatLocation(coords);
      }, [coords,search]);

    
    // Function to handle marker click
    const onMarkerClick = async(marker) => {
        try {
            const response = await getMemberBoatView(marker.MMSI);      
            if (response.status === 200) {
              const coordinates = response.data.map(point => ({
                latitude: parseFloat(point.lat),
                longitude: parseFloat(point.lon),
              }));               
               setPolylineCoords(coordinates);
            }
          } catch (error) {
            console.log(error);
          }
    };



    const memoizedCard = useMemo(() => {
      return (
        <MapView
        ref={mapRef}
        style={styles.map}
        region={region}>
         {boatsList.length > 0 && boatsList?.map((marker, index) => 
        {
            let boatImage;
            if (marker?.distance > 0) {
            boatImage = require('../../assets/GreenBoat.png');
            } else if (marker.last > 12 && marker.last < 13) {
            boatImage = require('../../assets/YellowBoat.png');
            } else if (marker.last > 24) {
            boatImage = require('../../assets/RedBoat.png');
            } else if (marker.Watch == 1) {
            boatImage = require('../../assets/blue_sailboat.png');
            } else if (marker?.distance === 0) {
            boatImage = require('../../assets/Grey.png');
            }
  
         return(
            <Marker key={index} 
                image={boatImage}
                coordinate={{
                    latitude: marker?.position.lat,
                    longitude: marker?.position.lon,
                }} onPress={() =>{
                    onMarkerClick(marker);
                    
                }}>

            {<Callout tooltip >
                <TouchableHighlight  underlayColor='#dddddd'>
                    <View style={styles.customView}>
                        <Text style={[styles.valueCell, { fontSize: normalize(16) }]}>
                            {marker.YachtName}
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.last} hrs since last report
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.speed} kn / {marker.bearing} {'\u00B0T'} last reported
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {marker.Length + "' " + marker.Model}
                        </Text>
                        <Text style={[styles.valueCellName, { color: COLORS.BLACK }]}>
                            {"MMSI:" + marker.MMSI}
                        </Text>
                    </View>
               </TouchableHighlight>
            </Callout>}
          </Marker>
        )})}
        {polylineCoords.length > 0 && (
          <Polyline coordinates={polylineCoords} strokeWidth={3} strokeColor="blue" />
        )}
        </MapView>        
      );
    }, [coords,search,polylineCoords]);


   
    return (
      <View style={styles.container}>
       {loading ? <View style={[style.mt40,style.contant]}>
        <ActivityIndicator color={COLORS.PRIMARY} size={'large'} style={[style.centerBox,style.mt40]}/>
        </View>
       : memoizedCard}

      </View>
    );
}

export default MapDetails

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
 },
 map: {
    width: '100%',
    height: Dimensions.get('screen').height / 1.72,
    borderRadius: 20,
    marginTop:10
 },
 valueCell: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
    fontWeight: '600',
    color: COLORS.DARK_PRIMARY,
  },
  valueCellName: {
    flex: 2,
    textAlign: 'left',
    paddingHorizontal: 8,
    color: COLORS.BLACK_50,
  },


  customView: {
    padding: 5, borderRadius: 10,
    backgroundColor: 'white',
 },
})