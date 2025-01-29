import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  BackHandler,
  Dimensions
} from 'react-native';
import DeviceInfo, { isTablet } from 'react-native-device-info';
import style from '../../../styles/style';
import { normalize, scaleHeight } from '../../../styles/utilities/dimentions';
import SelectNews from './SelectNews';
import COLORS from '../../../styles/theme/color';
import AntDesign from 'react-native-vector-icons/FontAwesome';
import Menu from '../../../routes/Menu';
import { getLatestNews } from '../../../services/api/auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import MembersContext from '../../Members/MembersContext';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
interface NewsScreenProps {}

const NewsIphoneScreen: React.FC<NewsScreenProps> = ({route}:any) => {
  const navigation = useNavigation()
    const isTablet = DeviceInfo.isTablet();
    const [selectedTab, setSelectedTab] = useState('Latest News');
    let tabData = ["Latest News","Education"]
    const [selectNews, setSelectNews] = useState(null);
    const { accessToken,setHideChatbot,setHideChatbotMember,setSelectedMenu } = useContext(MembersContext);
    const [getLatestNewsData,setGetLatestNewsData] = useState([])
    const [loader,setLoader] = useState(true)
    const [selectedLoader,setSelectedLoader] = useState(true)

    useEffect(() => {
      const backAction = () => {
        setSelectNews(null);
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
        setSelectedMenu(1)
        if(selectNews){
          setHideChatbotMember(true)
          setHideChatbot(true)
        }else{
          setHideChatbotMember(false)
          setHideChatbot(false)
        }
      },[selectNews])
    )

    useEffect(()=>{
      if(route && route.params){
        setSelectedLoader(true)
        setSelectNews(route.params.data)
        setTimeout(() => {
          setSelectedLoader(false)
          
        }, 2000);
        route.params = null;
      }
    },[route])
    useFocusEffect(React.useCallback(() => {
      const getNewsData = async () => {
        try {
          setLoader(true)
          const response = await getLatestNews(accessToken);
          if (response.status === 200) {
            setGetLatestNewsData(response.data);
            setTimeout(() => {
              
              setLoader(false)
            }, 2000);
          }
        } catch (error) {
          setLoader(false)
          console.error(error);
        }
      };
      getNewsData();
    }, []));

    function removeTags(str:string) {
      if ((str === null) || (str === ''))
          return false;
      else
          str = str.toString();
      return str.replace(/(<([^>]+)>)/ig, '');
  }

  
const dateFormat =(date)=>{
  return moment(date).format('MMM DD, YYYY')
}
    const renderItem = (item:any)=>{
      return (
        <View>
        <TouchableOpacity style={[style.row,styles.newsSection,style.mtb5]} onPress={()=>navigation.navigate('SelectedNews',{data:item.item.id,path:'News'})}>
          {item.item.newsMediasUrl ? <FastImage resizeMode={FastImage.resizeMode.cover} style={[{height:Platform.OS=="ios" && isTablet ?150: 70,width:normalize(55),borderRadius:8},style.mt2]} source={{uri:item.item.newsMediasUrl,priority: FastImage.priority.high,cache: FastImage.cacheControl.immutable}}/> :
            <Image resizeMode='contain' style={{height:Platform.OS=="ios" && isTablet ?150: 70,width:normalize(55)}} source={require('../../../assets/dataImage/news_placeholder.png')}></Image>}
            <View style={[style.contant,style.mH10]}>
               <Text style={[style.font16,style.primaryText]} numberOfLines={2}>{item.item.newsHeading}</Text>
               <Text style={styles.desStyle} numberOfLines={1}>{removeTags(item.item.newsDescription)}</Text>
               <Text style={[style.font12]}>{dateFormat(item.item.creationTimestamp)}</Text> 
               
                 {/* <WebView
                    source={{ html:item.item.newsDescription.length > 80 ? item.item.newsDescription.substring(0,80).concat('...') : item.item.newsDescription}}
                    javaScriptEnabled={true} // Enable JavaScript for iframe interactions
                    domStorageEnabled={true} // Enable DOM storage for iframe functionality (if needed)
                    minimumFontSize={normalize(35)}
                    style={[{ height: Dimensions.get('screen').height * 0.04,backgroundColor:'#FAFAFA'},style.grayText]}
                    showsVerticalScrollIndicator={false}
                  /> */}
            </View> 
             
        </TouchableOpacity>
        <View style={[style.alignSelfEnd,!isTablet && styles.line]}></View>
        </View>
      );
    }

    return (
      <View style={style.contant}>
        <View style={[style.sidepanelcolor]}>
          <Menu selectIndex={1}></Menu>
        </View>
        <View style={[style.contant,style.mt10]}>
          {loader  && selectedLoader?
          <View style={[style.contant,style.row,style.centerBox,style.centerItem]}>
          <ActivityIndicator
            theme={{ colors: { primary: COLORS.PRIMARY } }}
            size={'small'}
          />
        </View>
        :
          <View style={[style.contant]}>
          {selectNews ? (
                <SelectNews news={selectNews}></SelectNews>           
          ) : (
            <View style={[style.contant, style.mH10]}>
              <View style={[style.contant, style.mB15]}>
                {selectedTab == "Latest News" && (
                  <FlatList
                    style={[style.contant]}
                    data={getLatestNewsData}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>
            </View>
          )}
          </View>}
        </View>
      </View>
    );
};
const styles = StyleSheet.create({  
  iconLogo:{
    height:scaleHeight(20),
    resizeMode:'contain',
    width:scaleHeight(25),
    marginRight:10
  },
  desStyle:{
    lineHeight:25, 
    fontSize:14, 
    color:COLORS.LIGHTGREY
  },
  readMoreBtn:{
    width:normalize(150),
    height:normalize(25)
  },
  newsSection:{
    margin:3,
    borderRadius:8
  },
  line:{
    borderWidth:0.7,
    borderColor:COLORS.LIGHTGREY,
    width:Dimensions.get('screen').width *0.76
  }
});
export default NewsIphoneScreen;
