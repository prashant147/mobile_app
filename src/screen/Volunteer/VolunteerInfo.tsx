import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  TextInput,
  ImageBackground,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import style from '../../styles/style';
import COLORS from '../../styles/theme/color';
import DeviceInfo from 'react-native-device-info';
import { LinearProgress } from 'react-native-elements';
import {scaleWidth, scaleHeight, normalize} from '../../styles/utilities/dimentions';
import Icons from 'react-native-vector-icons/FontAwesome';
import DetailsScreen from '../../screen/Volunteer/Details';
import MembersContext from '../Members/MembersContext';
import WebView from 'react-native-webview';

const VolunteerInfo = ({loader,getAllEventsData,setUpdateSuccess,eventId}: any) => {
  const {setHideChatbot,setHideChatbotMember}=useContext(MembersContext)
  const isTablet = DeviceInfo.isTablet();
  const [showMore, setShowMore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backAction = () => {
      setShowMore(null)
      return true;
    };
  
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
  
    return () => backHandler.remove();
  }, []);
  useFocusEffect(
    React.useCallback(()=>{
      if(showMore){
        setHideChatbot(true)
        setHideChatbotMember(true)
      }else{
        setHideChatbot(false)
        setHideChatbotMember(false)
      }
    },[showMore])
  )
  
  useEffect(()=>{
    if(eventId){
      const filteredEvent = getAllEventsData?.find(item => item.id === eventId)
      setShowMore(filteredEvent)
    }
  },[eventId])
  const jsonData = {
    opportunities: {
      title: 'Opportunities to Volunteer',
      descriptions: [
        'Volunteering is when someone spends unpaid time doing something to benefit others. Helping your close friends or relatives isnt volunteering. But doing something to benefit the environment (and through that, other people) is. Volunteering can be formal and organized by organizations, or informal within communities.',
      ],
    },
    events: [
      {
        title: 'Suger Crunch Boat event',
        description:
          "There is more than meets the eye when it comes to being a design volunteer. For example, did you know that they make an average of $25.94 an hour? That's $53,952 a year! Between 2018 and 2028, the career is expected to grow 3% and produce 6,800 job opportunities across the U.S.",
      },
      {
        title: 'Another Event Title',
        description:
          'This is another event description. You can add different information for each event in the JSON.',
      },
      {
        title: 'Suger Crunch Boat event',
        description:
          "There is more than meets the eye when it comes to being a design volunteer. For example, did you know that they make an average of $25.94 an hour? That's $53,952 a year! Between 2018 and 2028, the career is expected to grow 3% and produce 6,800 job opportunities across the U.S.",
      },
    ],
  };
  const navigation = useNavigation();

  const {opportunities, events} = jsonData;
  const backBtnhandler =()=>{
    setShowMore(null)
    if(eventId){
      navigation.navigate('Rallies',{item:eventId})
    }
  }
  return (
    <View
      style={[
        style.contant,
      ]}>
      {/* <View style={[style.row,style.centerBox,style.mB10]}>
       {showMore && <TouchableOpacity style={style.row} onPress={backBtnhandler} >
          <Icons name="chevron-left" size={normalize(15)} style={[style.mr10,style.mt3]} color={COLORS.PRIMARY}/>
          <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
        </TouchableOpacity>}
      </View> */}
     
      {loading && (
        <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
      )}
      <View style={[style.contant]}>
        <WebView
          source={{
            uri: "https://sdsa.memberclicks.net/sdsa-working-groups-details",
          }}
          style={{ backgroundColor: "transparent" }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
        />
      </View>
      {/* <ScrollView style={[style.contant]} showsVerticalScrollIndicator={false}>
        {!showMore &&(
          <View style={style.contant}>
            <View>
              <Text
                style={[
                  isTablet ? style.font20 : style.font14,
                  style.primaryText,
                  style.boldTxt,
                  style.mB10,
                ]}>
                {opportunities.title}
              </Text>
              {opportunities.descriptions.map((description, index) => (
                <Text
                  key={index}
                  style={[
                    isTablet ? styles.description : styles.phonedescription,
                  ]}>
                  {description}
                </Text>
              ))}
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[
                  isTablet ? style.font20 : style.font14,
                  style.primaryText,
                  style.boldTxt,
                  style.mtb10,
                ]}>
                  Events / Rendezvous / Rallies
              </Text>
            </View>

            <View style={[isTablet ? styles.container : styles.containerEmpty]}>
              {getAllEventsData?.map((item, index) => (
                <View
                  style={[isTablet ? styles.box : styles.boxMobile]}
                  key={index}>
                  <ImageBackground source={item.eventsMediasUrl? {uri:item.eventsMediasUrl}: require('../../assets/news2.png')} style={styles.image} />
                  <View style={[{position:'absolute',backgroundColor:'#0D2C6CBF',height:'100%',width:'100%'},style.column,style.centerBox,style.centerItem,style.contant]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                     
                      <Text
                        style={[
                          isTablet ? style.font20 : style.font16,
                          styles.text,
                          {fontWeight: 'bold'},
                        ]}>
                        {item.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={()=> setShowMore(item)}>
                        <Text style={[isTablet ? style.font20 : style.font14]}>
                          Show More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

           
          </View>
        )}
        {showMore && (
            <DetailsScreen
              selectAward={jsonData}
              showMore={showMore}
              setShowMore={setShowMore}
              setUpdateSuccess={setUpdateSuccess}
            />
          )}

        
      </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.DARK_PRIMARY,
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    height: 100,
  },

  textContainer: {
    marginTop: 10,
  },

  primaryHeading: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#fff',
    paddingVertical:scaleHeight(10),
    paddingHorizontal:10,
    borderRadius: 2,
  
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },

  column1: {
    flex: 0,
    padding: 10,
  },
  column2: {
    flex: 1,
  },
  column3: {
    flex: 0,
    padding: 10,
  },

  volunteerBtn: {
    backgroundColor: '#0C383D',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },

  containerEmpty: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom:normalize(100)
   
  },
  containerForm: {
    flex: 1,
    borderTopColor: COLORS.GREEN,
    borderTopWidth: 0.5,
    paddingTop: 20,
    marginTop: 10,
  },
  box: {
    flex: 1,
    aspectRatio: 0.8,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    margin: 20,
  },
  boxMobile: {
    flexBasis: '45%',
    aspectRatio: 0.8,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    margin: 3,
    borderRadius:5,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:'center'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    
  },
  overlayGreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 41, 65, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayRed: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(118, 19, 19, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayYellow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(180, 117, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 80, 54, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',

    fontWeight: 'bold',
    textAlign: 'center',
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
    color: COLORS.BLACK,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '49%',
  },
  buttonForm: {
    backgroundColor: COLORS.LIGHT_PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 40,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  description: {
    fontSize: 16,
    color: '#141416',
    lineHeight: 19,
  },
  phonedescription: {
    fontSize: 12,
    color: '#141416',
    lineHeight: 19,
  },
});

export default VolunteerInfo;
