import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

// ... (Your existing code remains unchanged)
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';
import Header from '../../components/Header';
import UserInfo from '../../components/UserInfo';
import DeviceInfo from 'react-native-device-info';
import Menu from '../../routes/Menu';

const VolunteerScreen = () => {
  const [selectedTab, setSelectedTab] = useState('Volunteer');
  const isTablet = DeviceInfo.isTablet();
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

  const dataTabs = [
    {
      imageSource: require('../../assets/news2.png'),
      overlayStyle: 'overlayYellow',
      text: 'Annapolis',
      title: 'POWERBOAT SHOW',
    },
    {
      imageSource: require('../../assets/news2.png'),
      overlayStyle: 'overlayRed',
      text: 'Annapolis',
      title: 'POWERBOAT SHOW',
    },
    {
      imageSource: require('../../assets/news2.png'),
      overlayStyle: 'overlay',
      text: 'Annapolis',
      title: 'POWERBOAT SHOW',
    },
    {
      imageSource: require('../../assets/news2.png'),
      overlayStyle: 'overlayGreen',
      text: 'Annapolis',
      title: 'POWERBOAT SHOW',
    },
  ];

  const toggleTab = (tabName:any) => {
    setSelectedTab(tabName);
  };
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('VolDetails'); // Navigate to the 'Details' screen
  };
  const {opportunities, events} = jsonData;
  return (
    <View
      style={{flex: 1, height: '100%', backgroundColor: '#fff', marginTop: 20}}>
        <View style={[style.row]}>
          <View style={[{flex: 2}, [style.mt20, style.mH20]]}>
          <View style={style.sidepanelcolor}>
            <Menu selectIndex={3}></Menu>
            </View>
          </View>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'Regulations' && styles.selectedTab,
          ]}
          onPress={() => toggleTab('Regulations')}>
          <Text style={styles.tabText}>Volunteer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Policies' && styles.selectedTab]}
          onPress={() => toggleTab('Policies')}>
          <Text style={styles.tabText}>Volunteer Form</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{flex: 1}}>
        {selectedTab === 'Regulations' && (
          <ScrollView style={{flex: 1}}>
            <View style={styles.textContainer}>
              <Text style={styles.heading}>{opportunities.title}</Text>
              {opportunities.descriptions.map((description, index) => (
                <Text key={index} style={styles.description}>
                  {description}
                </Text>
              ))}
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.heading}>Volunteer List</Text>
            </View>

            <View style={styles.container}>
              {dataTabs.map((item, index) => (
                <View style={styles.box} key={index}>
                  <Image source={item.imageSource} style={styles.image} />
                  <View style={styles[item.overlayStyle]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                      <Text style={styles.text}>{item.text}</Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: 20,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                      <TouchableOpacity style={styles.button} onPress={handlePress}>
                        <Text style={styles.buttonText}>Show More</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.container}>
              {dataTabs.map((item, index) => (
                <View style={styles.box} key={index}>
                  <Image source={item.imageSource} style={styles.image} />
                  <View style={styles[item.overlayStyle]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                      <Text style={styles.text}>{item.text}</Text>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#fff',
                          fontSize: 20,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        marginBottom: 15,
                      }}>
                      <TouchableOpacity style={styles.button} onPress={handlePress}>
                        <Text style={styles.buttonText}>Show More</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {selectedTab === 'Policies' && (
          <View style={styles.textContainer}>
            <ScrollView style={{flex: 1}}>
              <Text style={styles.heading}>{opportunities.title}</Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
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
    marginLeft: 20,
    marginTop: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: COLORS.DARK_PRIMARY,
  },
  primaryHeading: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  description: {
    fontSize: 20,
    color: '#141416',
    lineHeight: 35,
    marginTop: 15,
  },

  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 40,
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

  btnText: {
    color: '#fff',
    fontSize: 16,
  },

  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  box: {
    width: '20%',
    aspectRatio: 0.8,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    margin: 30,
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
    backgroundColor: 'rgba(20, 80, 54, 0.7)', // Color with full opacity
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VolunteerScreen;
