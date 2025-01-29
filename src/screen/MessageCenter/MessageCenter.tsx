import {
  View,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useEffect, useState,useContext} from 'react';
//   import CustomHeader from '../../components/sharedComponents/searchBar/SearchBar';
import COLORS from '../../styles/theme/color';
//   import newsBg from '../../assets/chatbg.png';
import {ImageBackground} from 'react-native';
import UserInfo from '../../components/UserInfo';
import Header from '../../components/Header';
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu from '../../routes/Menu';
import MembersContext from '../Members/MembersContext';
import moment from "moment";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { normalize, scaleHeight } from '../../styles/utilities/dimentions';
import FilterComponent from '../../components/FilterComponent';
import { ScrollView } from 'react-native-gesture-handler';
import MessageCenterFilter from '../../components/MessageCenterFilter';

const MessageCenter = ({route}) => {
  type UserData = {
    id: number;
    profileUrl: any;
    firstName: string;
    lastName: string;
    mentee_msg: string;
    mentor_msg: string;
    members: any;
  };

  
  const { membersData, addMember,setHideChatbot ,setMessageCenter} = useContext(MembersContext);
  const [getUsersData, setGetUsersData] = useState(null);
  const [inputText, setInputText] = useState('');
  const [getUserData, setGetUserData] = useState<UserData | null>(null);
  const [search, setSearch] = React.useState<string | null>(null);
  const [showFilter,setShowFilter]=useState(false)
  const [favorite, setFavorite]=useState<string>("");
  const [nearMe, setNearMe]=useState<string>("");
  const [awardLevel, setAwardLevel]=useState<string>("");
  const [showNearMe, setShowNearMe]=useState(false);
  const [groups, setGroups]=useState<string>("");


  const onSearch = (txt: string) => {
    setSearch(txt);
  };

  const formatTimeAgo = (timestamp) => {
    const now = moment();
    const targetTime = moment(timestamp);
    if (now.diff(targetTime, "seconds") < 60) {
      return now.diff(targetTime, "seconds") + " seconds ago";
    } else {
      return targetTime.fromNow();
    }
  };

useEffect(() => {
  const filteredData = membersData.filter((item:any) => {
    if (groups && (!item.members || item.members.length === 0)) {
      return false;
    }
    if (favorite && !item.is_favourite) {
      return false;
    }
    if (nearMe && item.near_me > nearMe) {
      return false;
    }
    if (awardLevel && !item.award_level.toLowerCase().includes(awardLevel.toLowerCase())) {
      return false;
    }
    return true; 
  });
  
  const sortedData = filteredData.sort((a, b) => new Date(b.time_stamp) - new Date(a.time_stamp));
  
  setGetUsersData(sortedData);
  
}, [membersData, groups, favorite, nearMe, awardLevel]);


useEffect(()=>{
  if(route && route.params){
    const { id } = route.params;
    const getUser = membersData.filter((item:any)=>item.id === id)
    setGetUserData(getUser[0])

    
  }
    },[route])

  useEffect(() => {
    if (isTablet && getUsersData) {
      setGetUserData(getUsersData[1]);
      
    }
  }, [getUsersData]);

  useEffect(() => {
    const backAction = () => {
      setGetUserData(null);
      setMessageCenter(true)
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const isTablet = DeviceInfo.isTablet();
  const userClickHandler = (item: any) => {
    setGetUserData(item);
  };
const messageHandler =()=>{
  const message = {
    ...getUserData,
    mentee_msg:inputText
    
  }
  setGetUserData(message)
  setInputText('')
}
const backBtnHandler =()=>{
  setGetUserData(null)
  setMessageCenter(true)
}
  return (
    <View style={style.contant}>
      <View style={[style.row]}>
        <View style={[{flex: 2}]}>
          {/* <Header></Header> */}
          {!isTablet && <View style={[style.sidepanelcolor]}>
            <Menu selectIndex={5}/>
          </View>
          }
        </View>
        {isTablet && (
          <View style={[{flex: 1}, [style.mt20, style.mH10]]}>
            <UserInfo isDark={true}></UserInfo>
          </View>
        )}
      </View>
      <View></View>
      <View style={[style.contant,style.mt20, isTablet && style.row]}>
        {(isTablet) || (!isTablet && getUserData) && <View style={isTablet ? {flex: 2} : {flex: 1}}>
          {getUserData && (
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
              <View style={styles.headerContainer}>
                <View style={styles.rowContainer}>
                  {!isTablet && (
                    <TouchableOpacity onPress={backBtnHandler}>
                      <Icon
                        name="chevron-left"
                        size={25}
                        color={COLORS.WHITE}
                      />
                    </TouchableOpacity>
                  )}
                   {getUserData.members ? (getUserData.members.slice(0,3).map((user:any,index:any)=>(
                    <View style={[styles.imageHeader,styles.imageShadow,index === 0 ? {marginLeft:0}:{marginLeft:-50}]}>
                        <Image
                     source={ user?.profileUrl ?
                       {uri: user?.profileUrl}
                       :  require('../../assets/human.png')
                     }
                     alt="user"
                   />
                    </View>
                     ))) : 
                     <Image
                     source={ getUserData?.profileUrl ?
                       {uri: getUserData?.profileUrl}
                       :  require('../../assets/human.png')
                     }
                     alt="user"
                     style={[styles.image, style.mH5]}
                   />}
                  <View style={[styles.textContainer]}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: COLORS.WHITE,
                      }}>
                      {getUserData?.firstName && getUserData?.lastName ? `${getUserData.firstName} ${getUserData.lastName}` : getUserData?.firstName}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {getUserData.members &&
                      <Text style={{ color: COLORS.WHITE }}>
                        {getUserData.members.map((user: any) => user.title).join(', ')}
                      </Text>
                    }
                  </View>

                  </View>
                </View>
              </View>
            
                <ScrollView showsVerticalScrollIndicator={false} style={[style.pH20,style.contant,{marginVertical:scaleHeight(5)}]}>
              
                {getUserData.mentee_msg && <View style={styles.user2Container}>
                    <Text style={styles.user2Message}>
                      {getUserData.mentee_msg}
                    </Text>
                  </View>}
                  {getUserData.mentor_msg &&<View style={[styles.user1Container,style.mt10]}>
                    <Text style={styles.user1Message}>
                      {getUserData.mentor_msg}
                    </Text>
                  </View>}            
                </ScrollView>
                <View style={[styles.inputContainer]}>
                  <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={text => setInputText(text)}
                    placeholder="Type here"
                  />
                  <TouchableOpacity  onPress={messageHandler}
                    style={{ 
                    borderColor:COLORS.WHITE,
                    borderWidth:1,
                    paddingHorizontal:normalize(10),
                    paddingVertical:normalize(8),
                    borderRadius:8,
                    backgroundColor:COLORS.PRIMARY
                        }}>
                <MaterialIcon name='send' size={25} color={COLORS.WHITE}/>
               </TouchableOpacity>
                </View>          
            </KeyboardAvoidingView>
          )}
        </View>}
       {!getUserData && <View >
        <MessageCenterFilter
          onChangeText={(txt)=>setSearch(txt)}
          searchInput={search}
          filter={true}
          showFilter={showFilter}
          nearMeFilter={true}
          setShowFilter={setShowFilter}
          messageFilters={true}
          favorite={favorite}
          setFavorite={setFavorite}
          nearMe={nearMe}
          showNearMe={showNearMe}
          setNearMe={setNearMe}
          setShowNearMe={setShowNearMe}
          groups={groups}
          setGroups={setGroups}
          awardsFilter={true}
          awardLevel={awardLevel}
          setAwardLevel={setAwardLevel}
          placeholder='Search'
        />
        </View>}
        {(isTablet || (!isTablet && !getUserData)) && (
          <View style={[ style.contant,style.mt10]}>
            <FlatList

              data={search ? getUsersData.filter((e:any) => e.firstName.toLowerCase().includes(search.toLowerCase()),): getUsersData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => userClickHandler(item)}>
                  <View
                    style={[
                      getUserData?.id === item.id
                        ? styles.flexContainerActive
                        : styles.flexContainer,
                    ]}>
                    <View style={[styles.rowContainer]}>
                     {item.members ? (item.members.slice(0,3).map((user:any,index:any)=>(
                    <View style={[styles.image,styles.imageShadow,index === 0 ? {marginLeft:0}:{marginLeft:-70}]}>
                        <Image
                      source={ user?.profileUrl ?
                        {uri: user?.profileUrl}
                        :  require('../../assets/human.png')
                      }
                      alt="user"
                      style={[styles.image]}
                    />
                    </View>
                     ))) : <Image
                     source={ item?.profileUrl ?
                       {uri: item?.profileUrl}
                       :  require('../../assets/human.png')
                     }
                     alt="user"
                     style={[styles.image]}
                   />}
                      <View style={styles.textContainer}>
                        <Text
                          style={[style.font16, style.boldTxt,
                            getUserData?.id === item.id
                              ? {color: COLORS.BLACK}
                              : {color: COLORS.BLACK},
                          ]}>
                          {item?.firstName && item?.lastName ? `${item.firstName} ${item.lastName}` : item?.firstName}

                        </Text>
                        <Text
                          style={[
                            styles.text,
                            getUserData?.id === item.id
                              ? {color: COLORS.BLACK}
                              : {color: COLORS.BLACK},
                          ]}>
                          Your text here
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.timeText,
                        getUserData?.id === item.id
                          ? {color: COLORS.BLACK}
                          : {color: COLORS.BLACK},
                      ]}>
                     {formatTimeAgo(item.time_stamp)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default MessageCenter;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    borderColor: COLORS.WHITE,
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical:5
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cccccc' ,
    borderRadius: 8,
    paddingHorizontal:normalize(10),
    paddingVertical:normalize(8),
    marginRight: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  user1Container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  user2Container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  user1Message: {
    backgroundColor: '#e5e5ea',
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
    fontSize: 16,
    color:COLORS.BLACK_50
  },
  user2Message: {
    backgroundColor: COLORS.DARK_PRIMARY,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    color: '#fff',
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add this to push elements apart
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  flexContainerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add this to push elements apart
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    backgroundColor: COLORS.WHITE,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // This will make the row take up all available space
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 40,
  },
  imageShadow:{   
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  imageHeader: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    marginTop: 5,
    fontSize: 13,
  },
  timeText: {
    marginLeft: 'auto',
    color: '#696560',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'contain' as per your preference
    // Other styles...
  },
  user1Text: {},
  user2Text: {
    color: '#fff',
  },
  headerContainer: {
    backgroundColor: '#0D2C6C',
    height: 80,
    paddingHorizontal:10
  },
});
