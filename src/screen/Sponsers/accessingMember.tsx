import React, {useState} from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import COLORS from '../../styles/theme/color';
import { useNavigation } from '@react-navigation/native';
import Menu from '../../routes/Menu';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import BackIcon from 'react-native-vector-icons/FontAwesome';
import { scaleHeight, scaleWidth, normalize } from '../../styles/utilities/dimentions';
import { ActivityIndicator } from 'react-native-paper';


const AccessingMember = () => { 
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true);
    let data =[
        {
            "title":"Predict Wind",
            "url":"https://www.saltydawgsailing.org/wp-content/uploads/2020/02/Salty-Dawg-20.pdf",
            "deception":"Members get 20% off of subscriptions to PredictWind forecast products, or 20% refund if you have already subscribed to PredictWind."
        },{
            "title":"Enterprise Rentals - anywhere, anytime",
            "url":"https://www.enterprise.com/en/home.html",
            "deception":"Discounts on car rentals. If in Hampton, call (757) 723-7997 and reference L213581. Anywhere else in the US, reserve on-line at www.enterprise.com , using ID: L213581, and if requested Pin: SAL ."
        },{
            "title":"Fiorentino Para-Anchor",
            "url":"https://www.para-anchor.com/",
            "deception":"Fiorentino has become a world leading authority and U.S. manufacturer for underwater parachute sea anchors and storm drogues. SDSA members receive advice direct  from Zack Smith, discounts ranging from  5% to 15% depending on the item purchase and customization required,  and free  shipping in the USA. Contact Zack at "
        },{
            "title":"Bluewater Sailing Magazine",
            "url":"https://www.bwsailing.com/bw/",
            "deception":"A year's subscription to Bluewater Sailing Magazine (one time only offer)"
        },{
            "title":"Jack Martin & Associates",
            "url":"https://sdsa.memberclicks.net/benefits-for-sdsa-members",
            "deception":"Excellent combination of boat insurance pricing and coverage"
        },{
            "title":"SeaKits",
            "url":"https://www.seakits.com/",
            "deception":"Be prepared when the unexpected happens.  Sea Kits offers both the  Essential  Coastal Cruising and the Expedition Offshore  emergency damage control and  repair kits as well  as the TruPlug emergency  thru-hull and drain plug. They offer SDSA members a 15%  discount on Products.  Discount  Code SALTYDAWG."
        },{
            "title":"Datrex",
            "url":"https://www.datrex.com/",
            "deception":"Datrex is an American manufacturer and distributor of SAFTY MARINE PRODUCTS.   Products include Offshore Life rafts, Emergency Rations, Drinking Water, Deckbuoy® & Bridgebuoy® Liferings, Fishing Kits, and Life Jackets.  They additionally offer emergency flares and smokes and cold-water survival gear.  Datrex is also the US importer of Highfield Ribs.  SDSA Members receive their BOATSHOW discount on  all products all year long.   call Patrick Mansfield, Cell: 914-357-3007, Office: 717-435-8011, or email mansfield@datrex.com - give account code 05-6045 (do not order on-line)"
        },{
            "title":"DAN-Boater Membership",
            "url":"https://danboater.org/join/?a=memberinfo",
            "deception":"To join DAN-Boater membership, and receive medical repatriation services, medical hotline and more, go to : https://danboater.org/saltydawg . You get the following discounts automatically at checkout: All 2019 Fall Rally participants and Members who use this URL to join DAN Boater from now through October 31, 2019 will automatically receive a 25% discount off membership. After 10/31, the discount will reset to 10%. This allows all Salty Dawg Members who may have missed the early special discount to join any time for only $90. When SDSA Members choose to renew their DAN Boater next year, they can do so for the discounted price of $90/year."
        },{
            "title":"DAN Travel Insurance",
            "url":"https://apps.dan.org/trip-insurance/?rc=2857151&token=na",
            "deception":"For special pricing on Trip Insurance and annual travel insurance, go to these URL’s: For Trip Insurance, use http://dan.org/partner/2857151/tripFor Annual Travel Insurance, use https://dan.org/partner/2857151/annual"
        }
    ]
    return (
        <View style={[style.contant]}>
        {loading && (
        <View style={[style.mt40]}>
        <ActivityIndicator color={COLORS.PRIMARY} style={[style.mt40]}/>
        </View>
      )}
      <View style={[style.contant]}>
        <WebView
          source={{
            uri: "https://www.saltydawgsailing.org/benefits-for-sdsa-members",
          }}
          style={{ backgroundColor: "transparent" }}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
        />
      </View>
            {/* <ScrollView style={[{flex:2,marginBottom:20}]}>
                <Text
                    style={[
                      isTablet ? style.font20 : style.font14,
                      style.primaryText,
                      style.boldTxt,
                      style.mtb10,
                    ]}>ACCESSING BENEFITS FOR SDSA MEMBERS</Text>
                      <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: COLORS.SECONDARY,
                    }}></View>
                <Text style={[isTablet?styles.description:styles.phonedescription,{marginBottom:20}]}>
                    For most of your SDSA Member Benefits, accessing your benefits is easy. 
                    Simply show your SDSA Membership Card or tell them you are a Salty Dawg to get your benefits. Some of our sponsors require something more. 
                    Below we detail the steps to take for each sponsor that offers benefits to SDSA Members Only:
                </Text>
                {
                    data.map((e:any)=>(
                        <View style={[style.row,styles.tableBox,{marginRight:5}]}>
                            <TouchableOpacity  style={{width:"30%",paddingLeft:5,borderRightWidth:0.5,borderColor:COLORS.GREY}} onPress={()=>Linking.openURL(e.url)}>
                                <Text style={{color:COLORS.LIGHT_PRIMARY, padding:5}}>{e.title}</Text>
                            </TouchableOpacity>
                            <View style={[style.contant,style.pV20, style.pH20]}>
                                <Text style={style.font12}>
                                    {e.deception}
                                </Text>
                            </View>
                           
                        </View>
                    ))
                }
                
            </ScrollView> */}
        </View>
    )
}
const styles = StyleSheet.create({ 
    tableBox:{
        borderWidth:0.8,
        borderColor:COLORS.GREY
    },
    activeTab:{
        backgroundColor:COLORS.WHITE,
        paddingHorizontal:scaleWidth(10),
        paddingVertical:scaleHeight(10),
        color:COLORS.LIGHT_PRIMARY,
        fontSize:scaleWidth(18)
    },
    description: {
        fontSize: 16,
        color: COLORS.GREY
    },
    phonedescription: {
        fontSize: 12,
        color: COLORS.GREY
    },
    header: {
        backgroundColor: COLORS.PRIMARY,
        height: normalize(45),
        width: '100%'
    },
    url: {
        fontSize: 14,
        color: 'white',
        fontFamily:'Roboto-Regular',
    },
});
export default AccessingMember;