import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../../styles/theme/color';
import DeviceInfo from 'react-native-device-info';
import style from '../../../styles/style';

interface AboutEducationScreenProps {
  selectedIndex:any
}
const WebinarLibraryScreen : React.FC<AboutEducationScreenProps> = ({selectedIndex}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isTablet = DeviceInfo.isTablet();
  
  const webinarData = [
    {
      "data":"Choosing your Boat, Buying / Selling and Boat Restoration (2021)",
      "list":[
        {
          name: 'Choosing Your Blue Water Yacht – Monohulls',
          link:"https://www.youtube.com/watch?v=F7DrkV0JzR4",
          type: 'Bob Perry, world renowned Yacht Designer',
          desp:[
            "Noted naval architect Bob Perry will discuss the qualities of  blue water cruising monohulls."
          ]
        },{
          name: 'Choosing Your Cruising Multihull',
          link:"https://www.youtube.com/watch?v=UrZktvVgiqE",
          type: 'Gino Morrelli, Morrelli & Melvin',
          desp:[
            "Noted multihull designer Gino Morrelli of Morrelli & Melvin Design & Engineering will share thoughts on key features of performance cruising multihulls to look for, and what that tells you about the designer’s intent – speed, ability to sail to windward, comfort in a seaway, stability, light-air performance, payload, comfort at anchorage, storage space, etc. All boats are a result of compromise – you need to decide what is important to you in a cruising multihull."
          ]
        },{
          name: 'The Sailboat Purchase Process ',
          link:"https://www.youtube.com/watch?v=B8Uz7eNegRs",
          type: 'Josh McLean, David Walters Yachts',
          desp:[
            "Purchasing a blue water boat is a sizeable financial transaction, and it needs to be done properly. The quality and condition of the vessel must be confirmed, and the funds transferred properly to protect you, the buyer. Issues of survey process, selecting a quality surveyor, buying from a private seller, using a buyer’s broker, negotiation, contract process, protecting funds, custom’s duty, shipment, and taking delivery are some of the topics to be considered."
          ]
        },{
          name: 'Refit/Restore an Older Boat: Part I – Above Decks',
          link:"https://www.youtube.com/watch?v=H5I67kNNky8&feature=youtu.be",
          type: 'Steve Madden,M-Yachts Services',
          desp:[
            "Rigging, mast, boom, furling, winches, arch, davits, wind, solar and more.  What to look for in a used boat. Typical projects, lead time, budget, things to be careful of, DIY or contract."
          ]
        },{
          name: 'Refit/Restore an Older Boat: Part II – Hull and Below Decks',
          link:"https://www.youtube.com/watch?v=2eYoCR2Y3P4",
          type: 'M-Yacht Services,Marc Mayo',
          desp:[
            "Hull, electrical, electronics, plumbing, engine, generator and cabinetry.  What to look for in a used boat; project length; contract or DIY; typical budgets, lead time, shake-down."
          ]
        },{
          name: 'The Sailboat Selling Process ',
          link:"https://www.youtube.com/watch?v=o0fabX1BjAw",
          type: 'Josh McLean, David Walters Yachts',
          desp:[
            "Selling your boat from start to finish."
          ]
        }
      ]
    },
    {
      "data":"Destinations and Cruising with the Salty Dawgs (2021)",
      "list":[
        {
          name: 'How is a Salty Dawg Rally Different?',
          link:"https://www.youtube.com/watch?v=e_eKQkZdnic&feature=youtu.be",
          type: 'x Sheldon Stuchell, SDSA Ocean Class Sailor',
          desp:[
            "SDSA World Class Sailor will share information on how we run our rallies, what features are provided, why they appeal to old salts as well as those new to blue water sailing, and how these are different from most folk’s perception of a “rally.” The Salty Dawg Fall Rally is the most popular rally on the east coast of the US, by far."
          ]
        },{
          name: "Nelson's Dockyard, English Harbour: A Historical Overview of the most Beautiful Anchorage in the World.",
          link:"https://www.youtube.com/watch?v=1-SlSl7XHXU",
          type: 'Dr. Christopher Waters, Director of Heritage Resources, National Parks Authority',
          desp:[
            "English Harbour, Antigua, is the location of Nelson's Dockyard, a Georgian-era dockyard used to refit the Royal Navy's warships in their fight for supremacy against the French in the Age of Sail. This talk covers the history of English Harbour and Antigua, with an emphasis on things do see and do when you visit."
          ]
        },{
          name: 'Cruising the Lesser Antilles ',
          link:"https://www.youtube.com/watch?v=29R9Twz7K30",
          type: 'Bob Osborn SDSA Antigua Port Officer Ocean Class Sailor',
          desp:[
            "Learn more about what cruising the Islands from Antigua to Grenada has to offer. Bob, SDSA board member and Port Captain for Antigua, will share thoughts on what a season cruising this region might look like. He will highlight must-see events and top places to visit in the Windward and Leeward islands."
          ]
        },{
          name: 'Caribbean Rally - focus on Antigua - 2021',
          link:"https://www.youtube.com/watch?v=P0_jAjYiQ4U",
          type: 'Bob Osborn SDSA Antigua Port Officer',
          desp:[]
        },{
          name: 'Caribbean Rally - Focus on Bahamas - 2021',
          link:"https://www.youtube.com/watch?v=ILmZSBNvnhE",
          type: 'Allen Roberts, Bahamas Port Captain  ',
          desp:[]
        }
      ]
    },
    {
      "data":"Getting There (2021)",
      "list":[
        {
          name: 'Weather Models 101',
          link:"https://www.youtube.com/watch?v=Wer-R_umg-Y",
          type: 'Nick Olson, PredictWind',
          desp:[
            "What are weather models? How they are created, and assumptions that are made.  Degree of uncertainty. How they should be used.  Major weather features and how they are portrayed on models. My favorite models and their limitations."
          ]
        }, {
          name: 'Weather Routing Tools',
          link:"https://www.youtube.com/watch?v=eSUqur_uo2U",
          type: 'Nick Olson, PredictWind',
          desp:[
            "A review of the weather routing tools available to the cruising skipper."
          ]
        }, {
          name: 'Caribbean Weather Patterns and Impacts on Sailing',
          link:"https://www.youtube.com/watch?v=v8hqSCI9D-M",
          type: 'Chris Parker, Marine Weather Center',
          desp:[
            "Chris will cover general weather patterns and some unique weather features that can impact safety and convenience."
          ]
        }, {
          name: 'Route Planning Strategies - A Cruisers Perspective',
          link:"https://www.youtube.com/watch?v=gG-VF88OQiA",
          type: 'Behan and Jamie Gifford,Sailing Totem',
          desp:[
            "This webinar covers fundamental parts of route planning and considerations for better efficiency and comfort along the way."
          ]
        }
      ]
    },
    {
      "data":"Getting There - Additional Recorded Webinars",
      "list":[
        {
          name: 'Offshore Weather Forecasting & Routing Tools.',
          link:"https://www.youtube.com/watch?v=HnBBe2jXKJ0",
          type: 'Nick Olson, PredictWind',
          desp:[
            "What is the state of the art? "
          ]
        },{
          name: 'Passage making in the Caribbean, weather considerations',
          link:"https://www.youtube.com/watch?v=u94laJxcw9M",
          type: 'Chris Parker, Marine Weather Center',
          desp:[]
        },{
          name: 'Weather routing to the Caribbean:  Why Antigua is your best place to make landfall - Part 1',
          link:"https://www.youtube.com/watch?v=4bBzP81FWvk",
          type: 'Chris Parker, Marine Weather Center',
          desp:[]
        },{
          name: 'Weather routing to the Caribbean:  Why Antigua is your best place to make landfall - Part 2',
          link:"https://www.youtube.com/watch?v=BfyTr9K_4xA",
          type: 'Chris Parker, Marine Weather Center',
          desp:[]
        },{
          name: 'Where to leave from: Departing for Antigua and points south',
          link:"https://www.youtube.com/watch?v=Jo2tD8j25Po",
          type: 'Chris Parker, Marine Weather Center',
          desp:[]
        }
      ]
    }, 
    {
      "data":"Passage Preparation (2021)",
      "list":[
        {
          name: 'Becoming a Successful Cruising Couple',
          link:"https://www.youtube.com/watch?v=12HlCeIAnW0",
          type: 'Lisa McKerracher and Pierre Caouette, s/v Biotrek, Salty Dawg World Class sailors ',
          desp:[
            "A discussion on the steps to take to  get both to the stage of being competent sailors, how projects are handled, workable watch schedules, boat setup and handling considerations (approaches they have devised from sails to docking) , lessons learned on managing crew dynamics, keeping entertained and questions from the participants."
          ]
        },{
          name: 'Transition from Coastal Cruising to Extended Time Aboard',
          link:"https://www.youtube.com/watch?v=W-yLVPJIW1M",
          type: 'Bob Osborn, s/v Pandora',
          desp:[
            "Being aboard for a few weeks on a summer vacation or weekend sailing is much different than being aboard, covering distances and living on the hook for months at a time.  Making the boat a home, keeping comfortable underway and being sure that you are prepared to deal with gear issues that inevitably crop up. It has been said that being aboard for a year puts as much wear and tear on a boat as a decade of weekend cruising.   This discussion will dive into the changes that can be made to ensure the most rewarding time aboard."
          ]
        },{
          name: 'A Recommended Path for Developing Blue Water Skills ',
          link:"https://www.youtube.com/watch?v=dddU3EMVWyA",
          type: 'Lisa McKerracher and Pierre Caouette, s/v Biotrek, Salty Dawg World Class sailors ',
          desp:[
            "Bennett Kashdan, SDSA Director and World Class Sailor Hank George,  SDSA President and  World Class Sailor"
          ]
        },{
          name: 'Using the Salty Dawg Comprehensive Offshore Checklist',
          link:"https://www.youtube.com/watch?v=_aul2VTW964",
          type: 'Russ Owen, World Class Sailor',
          desp:[
            "Compiled by World Class Salty Dawgs; an extremely comprehensive list, valuable to all who go offshore"
          ]
        }
      ]
    },
    {
      "data":"Passage Preparation - Additional Recorded Webinars",
      "list":[
        {
          name: 'The Cruiser’s Medical Kit',
          link:"https://www.youtube.com/watch?v=vO5jQxt_4tw",
          type: 'Jo Barnes, long time cruiser and Ocean Class sailor, s/v Starburst',
          desp:[
            "Recommended contents of a cruisers medical kit. Training, prescription drugs and other medications to consider, crew questions, pre-travel visit to your healthcare professionals, insurance types, resources before departure and from afar, predeparture checklist, accident and injury avoidance, recommended first-aid guides."
          ]
        },{
          name: 'Outfitting Your Boat for Offshore Passages',
          link:"https://www.youtube.com/watch?v=4n_BUrBbZ2Y",
          type: 'Russ Owen, World Class Sailor',
          desp:[
            "Russ Owen is a Salty Dawg World Class sailor and circumnavigator. He covers essential systems and upgrades for safety and convenience for ocean passage making. From batteries, charging options, inverter hints, anchoring choices, Watermakers, dinghies, and much"
          ]
        }
      ]
    },
    {
      "data":"Sails and Rigging (2021)",
      "list":[
        {
          name: 'Selecting Your Blue Water Sail Inventory',
          link:"https://www.youtube.com/watch?v=0juItlEQ9rM",
          type: 'Dave Flynn, Quantum Sails',
          desp:[
            "Taking your boat offshore is very different than coastal cruising. Which sails should you have and the priorities of a limited budget. Today’s sails are made from a bewildering array of fabrics and it is important to choose the cut of the sail and materials to ensure long life and performance, especially in the conditions that you are likely to encounter on passage. Dave will demystify the process of choosing the right sails."
          ]
        },{
          name: 'Rigging Fundamentals',
          link:"https://www.youtube.com/watch?v=5CV8NN0ZaWs",
          type: 'Behan and Jamie Gifford, Sailing Totem',
          desp:[
            "Moving beyond a credit card solution:",
            "1. Rigging basics: materials, terms, loads, tune",
            "2. Common rigging faults and how to find them.",
            "3. Pre-passage inspection"
          ]
        },{
          name: 'Sails: the Fundamentals',
          link:"https://www.youtube.com/watch?v=cawKkQmQFbI",
          type: 'Behan and Jamie Gifford, Sailing Totem',
          desp:[
            "Sail fundamentals (materials, terms, loads); sail repair basics and common causes of problems; self-inspection before going offshore; observations while underway"
          ]
        }
      ]
    },
    {
      "data":"Sails and Rigging - Additional Recorded Webinars",
      "list":[
        {
          name: 'Planning Your Cruising Inventory:',
          link:"https://www.youtube.com/watch?v=GZlHynbbbVU",
          type: 'Dave Flynn, Quantum Sails',
          desp:[
            "What Sails do you Need?"
          ]
        },{
          name: 'Trim for Control:',
          link:"https://www.youtube.com/watch?v=zDcPo2jA-K4",
          type: 'Dave Flynn,Quantum Sails',
          desp:[
            "Sail trim from an offshore sailor’s point of view"
          ]
        } 
      ]
    },
    {
    "data":"Gear and Techniques (2021)",
    "list":[
      {
        name: 'Windvane Self Steering',
        link:"https://www.youtube.com/watch?v=d6Mc3xTKut4",
        type: 'Will and Sarah Curry, Hydrovane International Marine Inc.',
        desp:[
          "Imagine a crew member who spends endless hours steering, doesn’t eat or sleep, and never complains? A windvane self steering system will steer your monohull or catamaran for short distances or across oceans with absolutely no power consumption.  Will and Sarah Curry provide an overview of the different types windvane systems (and emergency rudder options), demonstrate the Hydrovane, and discuss what a windvane can do for you with video and cruising anecdotes.  "
        ]
      },{
        name: 'ParaAnchors and Sea Drogues',
        link:"https://www.youtube.com/watch?v=p8ueU9DzuSM",
        type: 'Zack Smith,Fiorentino ParaAnchor',
        desp:[
          "Why blue water sailors need these.  Conditions when appropriate, how to deploy, adjusting, recovery, storage and budget.  Cool photos and videos"
        ]
      },{
        name: 'Gadgets, Gizmos and Thingamajigs',
        link:"https://www.youtube.com/watch?v=4A1xk3VMxPc",
        type: 'Seale and Hank George, World Class Sailors',
        desp:[
          "Special tools you should have aboard.  Helpful little things to have on your cruising boat - things to save you time, do a job better, facilitate boat maintenance, and help in emergencies. And, and some cool galley thoughts as well. Hank & Seale have compiled some of their tried-and-true things from 200,000 miles of sailing, and have pulled in favorites from many other seasoned Dawgs. You'll be taking notes!"
        ]
      },{
        name: 'Our Favorite Dinghy',
        link:"https://www.youtube.com/watch?v=oFoEV18oyo8",
        type: 'Panel Discussion, moderated by Hank George, SDSA President; Panel: Jo Barnes, Brian Stork, Barbara & Ted Owen – Salty Dawg World Class and Ocean Class sailors',
        desp:[
          "Hank will pose questions on preferred makes and models of dinghies and outboards, key features, things to avoid, nice additions like chaps, seats, and storage, where stowed when offshore, security, and more.  All important considerations for the “Family Car.”"
        ]
      },{
        name: 'Satellite Communications at Sea',
        link:"https://www.youtube.com/watch?v=i9vKfNgPVZg",
        type: 'Jeff Thomassen, OCENS, Inc.',
        desp:[
          "Staying in touch is more important than ever and is changing every year. E-mail, Internet, Weather data, GRIB files, TV. Learn about the latest satellite technology available, how it can keep you safe and in touch wherever you go, and the newest technology available."
        ]
      },{
        name: 'Offshore Power Management/Off the Grid',
        link:"https://www.youtube.com/watch?v=9f8mczDuulE",
        type: 'Simon Ytterbom / Victron Energy',
        desp:[
          "Choosing power sources, charging options, and sizing."
        ]
      }
    ]
  },{
    "data":"Gear and Techniques - Additional Recorded Webinars",
    "list":[
      {
        name: 'Basic Diesel Maintenance: Keeping Her Humming',
        link:"https://www.youtube.com/watch?v=GzC25aOTz00",
        type: 'Russ Owen, s/v Nexus, Salty Dawg World Class sailor',
        desp:[
          "Review of basic maintenance procedures on a diesel engine, diagnostic of common engine problems, recommended spares, and focus on becoming comfortable in doing basic maintenance functions."
        ]
      }
    ]
  },{
    "data":"Safety at Sea  (2021)",
    "list":[
      {
        name: 'Being Found - EPIRBS, AIS and PLBs',
        link:"https://www.youtube.com/watch?v=jeMNC1Qh4bI",
        type: 'Brian Flowers,Life Raft & Survival Equipment Inc. (LRSE)',
        desp:[
          "What to know so you can be seen and found."
        ]
      }, {
        name: 'Heavy Air Tactics and Strategy ',
        link:"https://www.youtube.com/watch?v=b1BbFOAROiU",
        type: 'Dave Flynn, Quantum Sails',
        desp:[
          "Heavy air tactics and strategy for cruising sailors."
        ]
      }, {
        name: 'Safety at Sea - Dealing with Stressful Situations',
        link:"https://www.youtube.com/watch?v=f2EE9XZydsg",
        type: 'Behan and Jamie Gifford,Sailing Totem',
        desp:[
          "A course on this topic usually conjures up MOB drills and inflating a life raft. These are helpful for those specific emergencies. The focus of this discussion is preparation, practices, and procedures to lower the risk of getting into an emergency, and improve the outcome."
        ]
      }, {
        name: 'Heavy Weather Tactics',
        link:"https://www.youtube.com/watch?v=oeUZyPbMgNE",
        type: 'Zach Smith, Fiorentino ParaAnchor',
        desp:[
          "slow down; heave-to; run off; drogues and para-anchors; tactics and tips for monohulls and catamarans; how to set-up."
        ]
      }, {
        name: 'Catamaran Heavy Weather Tactics',
        link:"https://www.youtube.com/watch?v=0QdT9evWm7M",
        type: 'Gino Morrelli, Morrelli & Melvin',
        desp:[]
      }
    ]
  },{
    "data":"Safety at Sea   - Additional Recorded Webinars",
    "list":[
      {
        name: 'Seamanship tips to ensure a safe passage ',
        link:"https://www.youtube.com/watch?v=TM2EsM6dUVo",
        type: 'Russ Owen, Hank George, SDSA board',
        desp:[
          "Getting crew and boat ready."
        ]
      }, {
        name: 'USCG briefing:',
        link:"https://www.youtube.com/watch?v=CnojwgY7gZQ",
        type: 'Geoff Pagels USCG',
        desp:[
          "Staying safe and what to do when things go wrong."
        ]
      }
    ]
  },{
    "data":"Keep You and Your Crew Happy (2021)",
    "list":[
      {
        name: 'Successful Offshore Fishing',
        link:"https://www.youtube.com/watch?v=5tvcn7y4Ttw",
        type: 'Kevin Ferrie / Salty Dawg Ocean Class sailor',
        desp:[
          "Blue water fishing techniques for all - including references to different locations"
        ]
      }, {
        name: 'Successful Offshore Fishing from a Sailboat - Part 1',
        link:"https://www.youtube.com/watch?v=LIch_tk5L8I",
        type: 'Kevin Ferrie / Salty Dawg Ocean Class sailor',
        desp:[]
      },{
        name: 'Successful Offshore Fishing from a Sailboat - Part 2',
        link:"https://www.youtube.com/watch?v=FrJWjbVJepU",
        type: 'Kevin Ferrie / Salty Dawg Ocean Class sailor',
        desp:[]
      }
    ]
  },{
    "data":"Keep You and Your Crew Happy - Additional Recorded Webinars",
    "list":[
      {
        name: "It's Not All About the Boat",
        link:"https://www.youtube.com/watch?v=pa8274YqK1c",
        type: 'Seale George, Salty Dawg World Class Sailor',
        desp:[
          "Enjoying your time at sea."
        ]
      }
    ]
  },{
    "data":"Ask The Experts (2021)",
    "list":[
      {
        name: "Q&A Session, Ask the Experts - Winter I",
        link:"https://www.youtube.com/watch?v=fkcA8AvjmIw",
        type: 'Russ Owen, Bob Osborn and Jo Barnes; moderated by Hank George',
        desp:[]
      },{
        name: "Q&A Session, Ask the Experts - Winter II",
        link:"https://www.youtube.com/watch?v=7hge0EiHqxU",
        type: 'Hank George World Class Sailor, Steve Stelmaszyk World Class Sailor, Pierre Caouette and Lisa McKerracher World Class Sailors, Bob Osborne Ocean Class Sailor; moderated by Alex Helfand Ocean Class Sailor',
        desp:[]
      },{
        name: "Q&A Session, Ask the Experts - Spring/Summer I",
        link:"https://www.youtube.com/watch?v=4-1x1L1NKd4",
        type: 'Steve and Linda Stelmaszyk / Salty Dawg World Class sailors Hank George, Salty Dawg World Class Sailor',
        desp:[]
      },{
        name: "Q&A Session - Ask the Experts- Spring/Summer II",
        link:"https://www.youtube.com/watch?v=4CpyDeARUsc",
        type: 'Russ Owen, Kevin Ferrie and Dave Flynn / Quantum Sails; moderated by Alex Helfand Ocean Class Sailor',
        desp:[]
      }
    ]
  }];

  useEffect(() => {  
    if(scrollViewRef && scrollViewRef.current){
      scrollViewRef.current.scrollTo({ y: 400*selectedIndex, animated: true });
  }
  }, [selectedIndex]);
  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
      <View style={style.contant}>
          <Text style={[isTablet?style.font24:style.font14,style.boldTxt,style.primaryText]}>Salty Dawg Library of Prior Webinars</Text>
          <Text style={[isTablet?style.font18:style.font12,style.mt10]}>
            The Salty Dawg Webinar Library is available to Salty Dawg members only!
          </Text>

          {webinarData.map((webinar, index) => (
              <View style={style.mt20}>
                <View style={styles.headerCellBlue}>
                  <Text style={[isTablet? style.font20: style.font16,style.boldTxt,style.whiteText]}>{webinar.data}</Text>
                </View>
                {/* Sample webinar data */}
                {webinar.list.map((evn, index) => (
                  <View key={index} style={style.row}>
                    <View style={[styles.headerCell,{flex:2}]}>
                      <TouchableOpacity onPress={()=>Linking.openURL(evn.link)}>
                        <Text style={[style.font12,style.primaryText]}>
                          {evn.name}
                        </Text>
                      </TouchableOpacity> 
                      {
                        evn.desp.map(e=><Text style={style.font12}>{e}</Text>)
                      }
                    </View>
                    <View style={[styles.headerCell,{flex:1}]}>
                      <Text style={style.font12}>{evn.type}</Text>
                    </View>
                    
                  </View>
                ))}
              </View>
            )
          )
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerCellBlue:{
    backgroundColor:COLORS.LIGHT_PRIMARY,
    alignContent:'center',
    alignItems:'center',
    paddingVertical:5
  },
  headerCell:{
    borderColor:COLORS.GREY,
    borderWidth:0.5,
    paddingHorizontal:5,
    paddingVertical:4
  }
});

export default WebinarLibraryScreen;
