import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
  } from 'react-native';
  import React,{useState,useEffect} from 'react';
  import Icon from 'react-native-vector-icons/Feather';
  import COLORS from '../../styles/theme/color';
  import {normalize, scaleWidth} from '../../styles/utilities/dimentions';
  import style from '../../styles/style';
  import DropdownSelector from '../../components/DropdownSelector';
import { vesselList } from '../../styles/utilities/constants';
import DeviceInfo from 'react-native-device-info';
  const eventList =[
    {
        id:0,
        isWinner:false,
        isStartLog:true
    },
    {
        id:1,
        isWinner:false,
        isStartLog:true
    },
    {
        id:2,
        isWinner:false,
        isStartLog:true
    }
  ]

const UpcommingEvents = ({setActiveTab}:any) => {
     const isTablet = DeviceInfo.isTablet();
    const [startLog, setStartLog]=useState(false)
    const [selectedBoat, setSelectedBoat] = useState();
    const [selectedBoatObj, setSelectedBoatObj] = useState({});
    const { width, height } = Dimensions.get('window');
    const deviceWidth = width;
    const deviceHeight = height;
    
    const onSelectedItemsChange = (selectedItems:any) => {
      setSelectedBoat(selectedItems)
        
        // setSelectedBoat(Number(selectedItems))
      };
    
      const onSelectedItemObjectsChange =(selectedItemsObj:any)=>{
        // setSelectedBoatObj(selectedItemsObj[0]);
      }

      const renderEventItem =({item,index})=>{
        return(
          <View style={{ flexDirection: isTablet ? 'row' : 'column', marginBottom: normalize(20) }}>
                    <Image
                    source={require('../../assets/tempImg/mylogImg.png')}
                    style={styles.profileImg}
                    resizeMode='contain'
                    />

                <View  style={{marginLeft: isTablet?  normalize(15) : 0}}>
                <View style={styles.firstLineContainer}>
                    <View>
                    <View style={isTablet ? style.contentBetween : style.contant}>
                        <View >
                        <Text style={styles.nameTitleStyle}>RALLY NAME</Text>
                        <Text style={styles.nameTitleTextStyle}>
                            {'Dum Dum Rally to Heaven'}
                        </Text>
                        </View>
                        <View style={[isTablet ? {marginLeft:10} : null]}>
                        <Text style={styles.nameTitleStyle}>DATE/TIME</Text>
                        <Text style={styles.nameTitleTextStyle}>
                            {'Nov 22, 09:00 AM - 12:00 PM'}
                        </Text>
                        </View>
                    </View>
                    <View style={[isTablet ? style.contentBetween : style.contant, {marginTop: normalize(15)}]}>
                        <View >
                        <Text style={styles.nameTitleStyle}>POSITION</Text>
                        <Text style={styles.nameTitleTextStyle}>{'Helmsman'}</Text>
                        </View>
                        <View>
                        <Text style={styles.nameTitleStyle}>LOCATION</Text>
                        <Text
                            style={[
                            styles.nameTitleTextStyle,
                           
                            ]}>
                            {'California Port'}
                        </Text>
                        </View>
                        <View>
                        <Text style={styles.nameTitleStyle}>ORGANISER</Text>
                        <Text
                            style={[
                            styles.nameTitleTextStyle,
                         
                            ]}>
                            {'Jack Sparrow'}
                        </Text>
                        </View>
                    </View>
                    </View>
                 { isTablet &&  <View style={styles.winnerAnnounsedContainer}>
                  
                  <Image
                  source={require('../../assets/profilecrew.png')}
                  style={styles.profileImg}
              />
                 
                    <Text
                        style={[
                        styles.nameTitleTextStyle,
                        {marginHorizontal: normalize(20)},
                        ]}>
                        Winner Yet to {'\n'} announced
                    </Text>
                    <Image
                        source={require('../../assets/boatSymbol.png')}
                        style={styles.profileImg}
                    />
                    </View>}
                </View>
                {!isTablet &&  <View style={styles.mobileWinnerContainer}>
                   <Image
                  source={require('../../assets/profilecrew.png')}
                  style={styles.profileImgMob}/>
                    <Text
                        style={[
                        styles.nameTitleTextStyle,
                        ]}>
                        Winner {"\n"}Yet to announced
                    </Text>
                    <Image
                        source={require('../../assets/boatSymbol.png')}
                        style={styles.profileImgMob}
                    />
                    </View>}
           {item?.isStartLog && <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={{width: scaleWidth(150), marginRight: normalize(10)}}>
              <DropdownSelector
                uniqueKey="id"
                displayKey="boatname"
                items={vesselList}
                onSelectedItemsChange={onSelectedItemsChange}
                onSelectedItemObjectsChange={onSelectedItemObjectsChange}
                selectedItems={selectedBoat}
                placeholder="Select Boat"
              />
            </View>

            <TouchableOpacity activeOpacity={0.8} 
            onPress={() => setStartLog(!startLog)}
            style={[styles.btnStyle,{backgroundColor:startLog ? COLORS.YELLOW:COLORS.PRIMARY}]}>
              <Text style={styles.btnText}>{ startLog ? 'Stop log':'Start log'}</Text>
            </TouchableOpacity>
          </View>}

          <View style={{marginTop: normalize(20)}}>
            <Text style={styles.nameTitleTextStyle}>
              {'Silver Port - Deti Port '}
            </Text>
            <Image
              source={require('../../assets/tempImg/boatmap.png')}
              style={{
                width: '100%',
                height: normalize(50),
                resizeMode: 'contain',
              }}
            />
          </View>

          <View style={{marginTop: normalize(20)}}>
          <Text
            style={[
              isTablet ? style.font16: style.font14,isTablet ? style.mt0 : style.mt10,
              style.boldTxt,
              ,
            ]}>About Event</Text>
            <Text
              numberOfLines={3}
              style={[
                styles.nameTitleTextStyle,
                isTablet ? style.font16: style.font14,
              ]}>
              {
                'From sailing sea to roaring soares the movement of cool bridge makes the sea with clam and vibrant colors...'
              }
            </Text>
          </View>

        </View>
        </View>
            
        )
      }


      const separator = () => {
        return <View style={styles.line} />;
      };

   return (
     <View style={style.contant}>


        <View style={styles.line} />

        <Text
            style={[
              isTablet ? style.font24 : style.font14,isTablet ? style.mt0 : style.mt10, style.mtb10,
              style.boldTxt,      style.primaryText,
            
            ]}>Upcoming Registered Rally & Events</Text>

        <View style={[style.contant]}>

            <FlatList
            data={eventList}
            renderItem={renderEventItem}
            keyExtractor={item=>item.id}
            ItemSeparatorComponent={separator}
            showsVerticalScrollIndicator={false}
            // columnWrapperStyle={{marginBottom:normalize(50)}}
            />

        </View>

    </View>
  )
}

export default UpcommingEvents

const styles = StyleSheet.create({
    container: {
        marginTop:10
      },
      btnStyleOutline: {
        borderWidth: 1,
        borderColor: COLORS.PRIMARY,
        paddingHorizontal: normalize(8),
        // paddingVertical:normalize(2),
        marginBottom: normalize(5),
        borderRadius: normalize(4),
        marginRight: 'auto',
        height: normalize(25),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
      },
      btnOutlineTextStyle: {
        color: COLORS.PRIMARY,
        fontSize: normalize(14),
        marginHorizontal: normalize(5),
      },
      line: {
        borderTopWidth: 1,
        // borderBottomWidth:1,
        // width: '100%',
        borderColor: COLORS.LINE,
        marginVertical: normalize(10),
        // borderRadius:8
      },
      textTitleHeading: {
        color: COLORS.PRIMARY,
        fontSize: scaleWidth(16),
        fontWeight: '600',
        lineHeight: 30,
      },
      profileImg: {
        width: normalize(80),
        height: normalize(80),
        resizeMode: 'contain',
      },
      profileImgMob: {
        width: normalize(50),
        height: normalize(50),
        resizeMode: 'contain',
      },
      nameTitleStyle: {
        color: COLORS.GREY,
       
      },
      nameTitleTextStyle: {
        color: COLORS.BLACK,
      
        fontWeight: '600',
        lineHeight: 30,
      },
      winnerAnnounsedContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.BLACK_50,
        alignItems: 'center',
        paddingHorizontal: normalize(8),
        borderRadius: normalize(4),
        margin: normalize(10),
      },

      mobileWinnerContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        borderWidth: 1,
        borderColor: COLORS.BLACK_50,
        alignItems: 'center',
        padding:10,
        borderRadius: normalize(4),
        
      },
      blankShade: {
        backgroundColor: COLORS.GREY,
        width: normalize(70),
        height: normalize(70),
        borderRadius: normalize(4),
        marginRight: normalize(10),
      },
      firstLineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       
      },
    
      btnStyle:{
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(15),
        // marginRight:normalize(20),
        paddingVertical:normalize(5),
        flexDirection:'row',
        borderRadius:normalize(6),
        height:normalize(40),
        alignItems:'center',
        justifyContent:'center'
      },
      btnText:{
        color:COLORS.WHITE,
        fontSize:scaleWidth(16),
        textAlign:'center'
      },
})