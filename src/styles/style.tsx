import { Platform, StyleSheet,Dimensions } from "react-native";
import COLORS from "./theme/color";
import { scaleHeight, scaleWidth,normalize } from "./utilities/dimentions";
import DeviceInfo from "react-native-device-info";
const isTablet = DeviceInfo.isTablet();
const hasNotch = DeviceInfo.hasNotch();
export default StyleSheet.create({ 
  pageBox:{
    marginBottom:40
  },
  buttionBox:{
    backgroundColor: COLORS.WHITE,
    borderColor: COLORS.YELLOW,
    marginRight: 10,
    width: "50%",
  },
  iconLogo:{
    height:scaleHeight(isTablet?35:30),
    resizeMode:'contain',
    width:scaleHeight(isTablet?40:35),
    marginRight:10
  },
  SectionBox:{
    paddingVertical:scaleHeight(20),
    borderBottomColor:COLORS.WHITE,

    borderBottomWidth:.5,
    paddingHorizontal:10
  },
  centerItem:{
   justifyContent:'center'
  },
  textCenter:{
    textAlign:'center'
  },
  textJustify:{
    textAlign:'justify'
  },
   button:{
      borderColor:COLORS.LIGHT_PRIMARY,
      borderWidth:1,
      borderRadius:8,
      alignContent:'center',
      alignItems:'center',
      paddingVertical:scaleHeight(10),
      paddingHorizontal:10
   },
   buttonSave:{
    borderColor:COLORS.LIGHT_PRIMARY,
    borderWidth:1,
    borderRadius:2,
    alignContent:'center',
    alignItems:'center',
    paddingVertical:scaleHeight(10),
    paddingHorizontal:10,
    height:normalize(50)
 },
   buttonTxt:{
    
      color:COLORS.LIGHT_PRIMARY,
      justifyContent:'center'
   },
   borderRadius8:{
    borderRadius:8
   },
   
   Blackbutton:{
    borderColor:COLORS.BLACK,
    borderWidth:1,
    borderRadius:1,
    alignContent:'center',
    alignItems:'center',
    paddingVertical:scaleHeight(10),
    paddingHorizontal:10
  },
   BlackbuttonTxt:{
      color:COLORS.BLACK,
      justifyContent:'center'
   },
   row:{
    flexDirection:'row'
   },
   column:{
    flexDirection:'column'
   },
   between: {
  justifyContent:"space-between"
   },
   contentBetween:{
   flexDirection:"row",
   justifyContent:"space-between"
   },
   contentAround:{
    flexDirection:"row",
    justifyContent:"space-between"
    },
   contentCenter:{
    flexDirection:"row",
    alignItems:"center"
    },
   contant:{
    flex:1
   },
   flexTwo:{
    flex:2
   },
   shadowBox:{
    // borderWidth:.3,
    borderRadius:10,
    backgroundColor:"#FAFAFA",
      // Common shadow styles for both iOS and Android
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      // Specific to Android
      elevation: 5,
   },
   shadowBoxVolunteerHead:{
    // borderWidth:10,
    borderRadius:8,
    backgroundColor:"#FAFAFA",
      // Common shadow styles for both iOS and Android
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3,
  
      // Specific to Android
      elevation: 3,
   },
   shadowBoxVolunteer:{
    // borderWidth:.3,
    borderRadius:8,
    backgroundColor:"#FAFAFA",
      // Common shadow styles for both iOS and Android
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3,
  
      // Specific to Android
      elevation: 3,
   },
   shadowBoxRally:{
    height:0.5,
    maxWidth:'100%',
    backgroundColor: COLORS.PRIMARY,
   },
   shadowBoxNews:{
    borderRadius:10,
    backgroundColor:"#FAFAFA",
      // Common shadow styles for both iOS and Android
      shadowColor: '#000',
      shadowOffset: {
        width: -2,
        height: 2,
      },
      
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
  
      // Specific to Android
      elevation: 5,
   },
   tableLayout:{
    paddingHorizontal:10,
    paddingTop:scaleHeight(hasNotch?0:20),
    paddingBottom:scaleHeight(hasNotch?0:10),
   },
   primaryLayout:{
     backgroundColor:COLORS.LIGHT_PRIMARY
   },
   whiteLayout:{
    backgroundColor:COLORS.WHITE
  },
  offWhiteLayout:{
    backgroundColor:"#fff",
    opacity:0.8
  },
   primaryText:{
    color:COLORS.LIGHT_PRIMARY
  },
  blueText:{
    color:COLORS.BLUE
  },
  grayText:{
    color:COLORS.GREY
  },
  whiteText:{
    color:COLORS.WHITE
  },
  mv7:{
    marginVertical: normalize(7)
  },
  mtb5:{
    marginVertical:scaleHeight(5)
   },
  mtb10:{
    marginVertical:scaleHeight(10)
   },
   mtb20:{
    marginVertical:scaleHeight(20)
   },
   mtb15:{
    marginVertical:scaleHeight(15)
   },
   mB10:{
    marginBottom:10
   },
   mB15:{
    marginBottom:15
   },
   mB30:{
    marginBottom:30
   },
   mB20:{
    marginBottom:20
   },
   mb10:{
    marginTop:10
   },
   mb5:{
    marginBottom:normalize(5)
   },
  mt10:{
    marginTop:10
   },
   mt5:{
    marginTop:5
   },
   mt2:{
    marginTop:2
   },
   mt3:{
    marginTop:normalize(4)
   },
   mt7: {
    marginTop: 7
   },
   mt0:{
    marginTop:0
   },
   mt15:{
    marginTop:15
   },
   mt20:{
    marginTop:scaleHeight(20)
   },
   mt30:{
    marginTop:scaleHeight(30)
   },
   mt40:{
    marginTop:scaleHeight(50)
   },
   mtop40:{
    marginTop:scaleHeight(40)
   },
   mH20:{
    marginHorizontal:20
   },
   mH40:{
    marginHorizontal:40
   },
   mH10:{
    marginHorizontal:10
   },
   mH15:{
    marginHorizontal:15
   },
   mH12:{
    marginHorizontal: 12
   },
   mH5:{
    marginHorizontal:5
   },
   mL20: {
    marginLeft: 20
   },
   mL30: {
    marginLeft: 30
   },
   mL65: {
    marginLeft: 65
   },
   mr5:{
    marginRight:5
   },
   mr10:{
    marginRight:10
   },
   mr20:{
    marginRight:20
   },
   mr30:{
    marginRight:30
   },
   pH10:{
    paddingHorizontal:10
   },
   pH20:{
    paddingHorizontal:20
   },
   pV10:{
    paddingVertical:scaleHeight(5)
   },
   pV20:{
    paddingVertical:scaleHeight(10)
   },
   pt20:{
    paddingTop:scaleHeight(20)
   }, 
   pt10:{
    paddingTop:scaleHeight(10)
   },
   pt15:{
    paddingTop:scaleHeight(15)
   },
   pb20:{
    paddingBottom:scaleHeight(20)
   },
   pb80:{
    paddingBottom:scaleHeight(80)
   },
   p20:{
    padding:20
   },
   p10:{
    padding:10
   },
   p5:{
    padding:5
   },
   p410:{
    paddingRight:scaleHeight(10)
   },
   boldTxt:{
     fontWeight:'bold'
   },
   font10:{
    fontSize:10,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
   font12:{
    fontSize:Platform.OS =='ios'?11:12,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
   font14:{
     fontSize:14,
     fontFamily:'Roboto-Regular',
     color:COLORS.BLACK
   },
   font15:{
    fontSize:15,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
   font13:{
    fontSize:13,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
  },
   font16:{
    fontSize:16,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
   },
   font18:{
    fontSize:18,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
   },
   font20:{
    fontSize:20,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
   },
   font24:{
    fontSize:24,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK
   },
   greenDot:{
    width:normalize(8),
    height:normalize(8),
    borderRadius:100,
    backgroundColor:'green',
    marginRight:5
   },
   centerBox:{
    alignItems:'center'
},
sidepanelcolor:{
  width: "100%",
  //position:'absolute',
 // zIndex:9999
},
spaceBetween:{
  justifyContent:'space-between'
},
textCapitalize:{
  textTransform:'capitalize'
},
textDanger: {
  color: 'red',
  fontSize: normalize(14)
},
borderRadius5: {
  borderRadius: 8,
},
positionAbs: {
  position: 'absolute'
},
positionRel: {
  position: 'relative'
},
alignSelfEnd: {
  alignSelf:'flex-end'
},
width100:{
  width:100
}, baseBox:{
  alignItems:'baseline'
},
breakeLine: {
  height: 0.6,
  maxWidth: '100%',
  backgroundColor: COLORS.PRIMARY,
  marginBottom: normalize(15),
  marginTop: normalize(15)
},
lineHeight20:{
  lineHeight:20
},
lineHeight25:{
  lineHeight:25
},
notificationRead: {
  backgroundColor:"#E57424",
  width:normalize(10),
  height:normalize(10),
  borderRadius:50,
  position: "absolute"
},
gap10:{
  gap:10
},
commentsWidth: {
  width:Dimensions.get("screen").width *0.63
},
OffWhiteLayout:{
  backgroundColor:COLORS.OFFWHITE
},
lightGreyLayout:{
 backgroundColor:"#EDEDED"
},
commentBtn:{
  height:'100%',
  padding:10,
  borderTopRightRadius:30,
  borderBottomEndRadius:30,
},
flexEnd:{
  alignContent:"flex-end",
  alignItems:"flex-end"
},
menuTextBg:{
  backgroundColor:COLORS.BORDERGREY
},
transparentBg:{
  backgroundColor:"transparent"
},
contentWidth:{
  color:COLORS.DARK_PRIMARY,
  width:Dimensions.get("screen").width *0.75
},
flexWrap:{
  flexWrap:'wrap'
},
width50:{
  width:normalize(50)
},
fiordText:{
  color:"#545E6F"
},
opacity:{
  opacity: 0.5
},
mL10: {
  marginLeft: -10
 },
 mL15: {
  marginLeft: -20
 },
 ml15: {
  marginLeft: -15
 },
 greenText:{
  color:COLORS.GREEN
 },
 mright:{
  marginRight:-10
 }

});
