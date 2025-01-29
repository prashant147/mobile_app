import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList
} from 'react-native';
import style from '../../../styles/style';
import DeviceInfo from 'react-native-device-info';
import { scaleHeight, scaleWidth } from '../../../styles/utilities/dimentions';
import SelectNews from './SelectNews';
import TabBox from '../../../components/TabBox';
import EducationScreen from '../Education';
import UserInfo from '../../../components/UserInfo';
import Menu from '../../../routes/Menu';

interface NewsScreenProps {}

const isTablet = DeviceInfo.isTablet();
export const NewsListData = [
  {
    "title":"Crew Member Passes Away During 2023 Caribbean Rally",
    "datetIme":"Tuesday, November 14, 2023 11:51 AM",
    "image":"https://www.saltydawgsailing.org/assets/docs/sponsors/Nanny-Cay-Transparent-Logo-01-Landscape.png",
    "detail":[
      "Salty Dawg Sailing Association’s president Bob Osborn announced on Tuesday November 14, 2023 that a crew member aboard the 46-foot yacht Logos that was sailing with the SDSA’s Fall Rally from the U.S. East Coast to Antigua in the Caribbean had unexpectedly passed away while at sea.",
      "On the afternoon of November 12, the skipper and owner of Logos, Tim Cayward, reached out to the SDSA shoreside support team concerned about his crew member Ralph Erickson’s medical condition stemming from severe sea sickness. The SDSA team, which cannot give actual medical advice, discussed several courses of action. Team member Kevin Ferrie communicated with Logos the available options, including evacuation, but this was rejected because Erickson was able to hydrate, seemed to be improving and had a strong pulse.",
      "At 2 am Monday morning November 13, the shoreside team manager Tim Metcalf received a phone call from the U.S. Coast Guard, Sector 5, to inform him that they had been informed by Tim Cayward that Ralph Erickson had died in his sleep. The cause of death remains to be determined.",
      "The SDSA Shoreside Team has been working closely with Cayward, the Coast Guard and the SDSA team in Antigua to coordinate with local officials and the U.S. Consulate there. The U.S. Consulate will take the lead following Logos’ landfall at Antigua’s English Harbour. Erickson’s next of kin have been notified of his passing.",
      "Bob Osborn remarked: “Our hearts go out to Ralph’s family, to the crew of Logos and to all of Ralph’s friends and shipmates. He will be much missed. We will stay in touch with officials and the Consulate to help Tim Cayward and the Erickson family in any way possible.”"
    ]
  },
  {
    "title":"Salty Dawg Rallies to Maine and the Maritimes",
    "datetIme":"Friday, May 19, 2023 10:22 AM",
    "image":"https://sdsa.memberclicks.net/assets/site/logo.png",
    "detail":[
      "The Salty Dawg Sailing Association, famous for its Fall and Spring rallies to and from the Caribbean, also runs a summer Downeast rally from Hampton, VA and Newport, RI to Penobscot Bay in Maine. And, every other year the SDSA continues Downeast with a follow-on rally to Nova Scotia, with starts in Rockland, ME and Provincetown, MA. Both rallies are considered “stepping stone events” for skippers and crews who want to get into passage making in the company of other cruisers before making the long 1,500-mile passage from Hampton to Antigua in the Fall Rally. The Downeast rally departs Hampton on July 6 and sails straight to Newport where the larger fleet gathers for a July 11 departure for the 40-hour run through the Cape Cod Canal and across the Gulf of Maine to Rockland. After the festivities following the Downeast Rally, those sailing in the Maritime Rally will depart for Shelburne, Nova Scotia and from Provincetown, MA, and then further east along the Nova Scotia coast to the Bras d’Or Lakes and Baddeck. The sign-ups are open for both summer rallies and all cruisers who want to explore Downeast and Maritime cruising are invited to join the fun and get some offshore experience. Check out the rallies here."
    ]
  },
  {
    "title":"The Salty Dawg Summer is going to be a busy one. ",
    "datetIme":"Wednesday, March 15, 2023 01:07 PM",
    "image":"https://www.saltydawgsailing.org/assets/images/Sponsors/Shelter%20Bay.png",
    "detail":[
     "Salty Dawg Homeward Bound Rally Registration is Open",
     "The Salty Dawg Sailing Association has hosted a rally from the Caribbean to the U.S.  East Coast since 2012.  In 2020 The Salty Dawgs renamed it The Homeward Bound Rally, bringing hundreds of COVID-19 stranded cruisers to the United States for the summer.  The rally continues and this year there are some exciting changes.  In the past the rally began in St. Thomas, USVI, and it will still do so, but this year there are other options.   Rally participants can also choose to leave from Marsh Harbor, Bahamas or from Bermuda.  The rally includes weather routing by The Marine Weather Center, position tracking by PredictWind, and an extensive level of coordination and support by the SDSA support teams during the offshore passage.",
     "This past autumn many of the SDSA Caribbean Rally participants wanted to stop in Bermuda on their way south but weather made that option difficult, so Bermuda is now an added option for the north-bound Homeward Bound participants.  After an April 29 departure dinner in Antigua the rally boats will head to their northern departure points on or about May 1.   Cruisers gathering at the departure points can expect the usual Salty Dawg pre-departure social and security meet-ups.  Boats meeting up in the Bahamas and the Virgin Islands will head to the US on or about May 10.  The Bermuda to U.S. departure date is scheduled for May 14.",
     "As always, the Dawgs have a busy summer sailing season scheduled with rallies up the US East Coast from Annapolis to Nova Scotia with the Downeast Rally and the Maritime Rally, and rendezvous in Essex CT, Newport RI, and Rockland ME.   The summer rallies are a great way for sailors to gain off-shore sailing experience while they have a great time meeting Salty Dawgs and learning about their mission to help sailors become cruisers.  Use this link for information on the rallies and this link for information on other events.  ",
     "All Salty Dawg rallies and events are led by seasoned sailors who volunteer their time and knowledge to help cruisers realize their dreams.  The Salty Dawg Sailing Association is a Rhode Island registered 501c 3 non-profit organization dedicated to fostering safe seamanship, safe passage-making, and camaraderie in the cruising community.   "
    ]
  }
]
const NewsScreen: React.FC<NewsScreenProps> = ({route}:any) => {
  const  data  = route.params?.data;
  const AboutDataList = [
    { id: 0, title: 'INTRODUCTION' },
    { id: 1, title: 'LIBRARY OF PRIOR WEBINARS:' },
    { id: 2, title: 'CHECKLISTS AND ARTICLES:' },
    { id: 3, title: 'CHECKLISTS AND ARTICLES:' },
    // Add more items as needed
  ];
  const OffshoreDataList = [
    { id: 0, title: 'Preparing for Offshore' },
    { id: 1, title: 'UNDERSTAND YOUR BOAT' },
    { id: 2, title: 'REQUIRED AND RECOMMENDED EXPERIENCE, EQUIPMENT, AND PREPARATION' },
    { id: 3, title: 'CHECKLIST FOR OFFSHORE' },
    { id: 4, title: 'ADVICE FROM EXPERTS' },
    // Add more items as needed
  ];

  const sdsaGuidedataList = [
    { id: 0, title: 'PAPERS FROM THE 2017 RALLY TO CUBA' }
    // Add more items as needed
  ];
  const webinarLibraryDataList = [
    {id: 0,title: 'Choosing your Boat, Buying / Selling and Boat Restoration'},
    {id: 1,title: 'Destinations and Cruising with the Salty Dawgs'},
    {id: 2,title: 'Getting There'},
    {id: 3,title: 'Passage Preparation'},
    {id: 4,title: 'Sails and Rigging'},
    {id: 5,title: 'Gear and Techniques'},
    {id: 6,title: 'Safety at Sea'},
    {id: 7,title: 'Keep You and Your Crew Happy'},
    {id: 8,title: 'Experts Corner'}
  ];

  const webinarsDataList = [
    {id: 0,title: 'Salty Dawg 2023 Webinar Series Register Now',}
    // Add more items as needed
  ];
  let tabData = ["Latest News","Education"]
  const [selectedTab, setSelectedTab] = useState('Latest News');
  const [selectedNews, setSelectedNews] = useState(data?data:NewsListData[0]);
  const [selectedEdu, setSelectedEdu] = useState("About Education");
  const [selectedEduIndex, setSelectedEduIndex] = useState(0);

  useEffect(() => {  
    if(selectedEdu =="About Education"){
      setSelectedEduIndex(0)
    } else if(selectedEdu =="2023 Webinars"){
      setSelectedEduIndex(0)
    } else if(selectedEdu =="Access to Webinar Library"){
      setSelectedEduIndex(0)
    } else if(selectedEdu =="Preparing for offshore"){
      setSelectedEduIndex(0)
    } else if(selectedEdu =="SDSA Cruising Guide: Cuba"){
      setSelectedEduIndex(0)
    }
  }, [selectedEdu]);

  const renderItem = (item:any)=>{
    const isActive = selectedNews.title === item.item.title;
    return (
      <TouchableOpacity onPress={()=>setSelectedNews(item.item)} style={[style.SectionBox,isActive && style.whiteLayout,style.row]}>
          <Image style={{width:scaleWidth(80),height:scaleHeight(80)}} source={{uri:item.item.image}} resizeMode='contain'></Image>
          <View style={[style.contant,{paddingHorizontal:10}]}>
             <Text style={[style.font12,style.boldTxt,!isActive && style.whiteText]}>{item.item.title}</Text>
             <Text style={[style.font12,style.grayText]}>{item.item.datetIme}</Text>
             <Text style={[style.font12,style.grayText,style.mt10]} numberOfLines={2}>{item.item.detail}</Text>
          </View> 
      </TouchableOpacity>
    );
  }

  return ( <View style={[style.contant,style.row]}>
        <View style={{flex:2}}>
          <View style={[style.mt20,style.mH10]}>
            {/* <Header></Header> */}
            {!isTablet && <Menu selectIndex={1}/>}
          </View>
          <View style={[style.contant,style.mH10]}>
            <View style={[style.shadowBox,style.contant,style.pH20,style.pt20]}>
              <View style={[ style.row]}>
                <Image
                  style={style.iconLogo} resizeMode='contain'
                  source={require('../../../assets/menu/News.png')}></Image>
                <Text style={[isTablet?style.font18:style.font14,style.boldTxt]}> {selectedTab}</Text>
              </View>
              {
                  selectedTab=="Latest News" && <SelectNews news={selectedNews}></SelectNews>
              } 
              {
                  selectedTab=="Education" && <EducationScreen selectedIndex={selectedEduIndex} onSelect={setSelectedEdu} selected={selectedEdu}></EducationScreen>
              } 
            </View>
          </View>
        </View>
        <View style={[style.contant,style.primaryLayout]}>
          <UserInfo></UserInfo>
          <View style={[style.mH20,{marginBottom:20}]}>
            <TabBox data={tabData} isDark={true} selectedTab={selectedTab} onTab={(tab:string)=>setSelectedTab(tab)}></TabBox>
          </View>
          
          {
                selectedTab=="Latest News" &&  <FlatList style={[style.contant]}
                data={NewsListData}
                renderItem={renderItem}
              />
          }
          {
              selectedTab=="Education" && <View style={{borderBottomColor:'#fff',borderBottomWidth:1}}>
                  {
                      selectedEdu=="About Education" && AboutDataList.map((e,index)=>(
                      <TouchableOpacity onPress={()=>setSelectedEduIndex(e.id)}>
                        <Text style={[style.SectionBox,e.id==selectedEduIndex?style.primaryText:style.whiteText,e.id==selectedEduIndex && style.whiteLayout]}>{e.title}</Text></TouchableOpacity> 
                    ))
                  }
                  {
                      selectedEdu =="2023 Webinars" && webinarsDataList.map((e,index)=>(
                        <TouchableOpacity onPress={()=>setSelectedEduIndex(e.id)}>
                          <Text style={[style.SectionBox,e.id==selectedEduIndex?style.primaryText:style.whiteText,e.id==selectedEduIndex && style.whiteLayout]}>{e.title}</Text></TouchableOpacity> 
                      ))
                  }
                  {
                      selectedEdu =="Access to Webinar Library" && webinarLibraryDataList.map((e,index)=>(
                        <TouchableOpacity onPress={()=>setSelectedEduIndex(e.id)}>
                          <Text style={[style.SectionBox,e.id==selectedEduIndex?style.primaryText:style.whiteText,e.id==selectedEduIndex && style.whiteLayout]}>{e.title}</Text></TouchableOpacity> 
                      ))
                  }
                  {
                      selectedEdu =="Preparing for offshore" && OffshoreDataList.map((e,index)=>(
                        <TouchableOpacity onPress={()=>setSelectedEduIndex(e.id)}>
                          <Text style={[style.SectionBox,e.id==selectedEduIndex?style.primaryText:style.whiteText,e.id==selectedEduIndex && style.whiteLayout]}>{e.title}</Text></TouchableOpacity> 
                      ))
                  }
                  {
                      selectedEdu =="SDSA Cruising Guide: Cuba" && sdsaGuidedataList.map((e,index)=>(
                        <TouchableOpacity onPress={()=>setSelectedEduIndex(e.id)}>
                          <Text style={[style.SectionBox,e.id==selectedEduIndex?style.primaryText:style.whiteText,e.id==selectedEduIndex && style.whiteLayout]}>{e.title}</Text></TouchableOpacity> 
                      ))
                  }
              </View>
            }
        </View>
  </View>)
};
const styles = StyleSheet.create({ 

});
export default NewsScreen;

