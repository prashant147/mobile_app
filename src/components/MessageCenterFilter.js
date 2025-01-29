import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
  } from 'react-native';
  import React, { useState } from 'react';
  import COLORS from '../styles/theme/color';
  import {
    normalize,
    scaleHeight
  } from '../styles/utilities/dimentions';
  import Icon from 'react-native-vector-icons/Feather';
  import FilterIcon from 'react-native-vector-icons/Ionicons';
  import style from '../styles/style';
  import { Dropdown } from 'react-native-element-dropdown';
  import DeviceInfo from 'react-native-device-info';
  import FeatherIcon from 'react-native-vector-icons/Feather';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import { ScrollView } from 'react-native-gesture-handler';
  import DateTimePicker from '@react-native-community/datetimepicker';
  // import DateRange from '../components/DateRange';
  import moment from 'moment';
  import AntDesign from 'react-native-vector-icons/AntDesign';
import { dateFormat } from '../styles/utilities/variables';
  
  const MessageCenterFilter = ({
    onChangeText = {},
    searchInput = '',
    placeholder = '',
    Buttonholder = '',
    isButtion = true,
    onSearchBut = {},
    setValue,
    value,
    data,
    showFilter,
    setShowFilter,
    filter,
    dateRange,
    departureDate,
    location,
    qualification,
    experience,
    onLocationTxt,
    locationInput,
    qualificationTxt,
    setQualificationTxt,
    experienceTxt,
    setExperinceTxt,
    dateTxt,
    setDateTxt,
    messageFilters,
    favorite,
    setFavorite,
    nearMe,
    setNearMe,
    groups,
    setGroups,
    setShowNearMe,
    showNearMe,
    nearMeFilter,
    setAwardLevel,
    awardLevel,
    awardsFilter
    
  }) => {
    const isTablet = DeviceInfo.isTablet();
    const [showDateRange, setShowDateRange] = useState(false)
    const [showLocation, setShowLocation] = useState(false)
    const [showExperience, setShowExperience] = useState(false)
    const [showQua, setShowQua] = useState(false)
    const [showPicker, setShowPicker] = useState(false);
  
    const handleExpenseDate = (event, date) => {
      setShowPicker(false)
      if (date !== undefined) {
        setDateTxt(date);
      }
    };
  
    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
  
        </View>
      );
    };
    const qualificationData = [
      { label: 'Select', value: '' },
      { label: 'Ocean Class Qualifier', value: 'ocean_class' },
      { label: 'World Class Qualifier', value: 'world_class' },
    ];
    const nearMeData = [
      { label: 'Near me', value: '' },
      { label: '60 knots', value: '60' },
      { label: '40 knots', value: '40' },
      { label: '20 knots', value: '20' },
    ];
    const awardsData = [
      { label: 'Select award type ', value: '' },
      { label: 'Bronze', value: 'bronze' },
      { label: 'Silver', value: 'silver' },
      { label: 'Gold', value: 'gold' },
    ];
    return (
      <View style={[{backgroundColor:'#F4F4F4'},style.pH20]}>
        <View style={[style.row, style.mtb10, { alignItems: 'center' ,}]}>
          {filter && (
            <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={[styles.shadowBox,{ borderRadius: 30,},style.mr10]}>
              <FilterIcon
                name={showFilter ? 'filter-circle' : 'filter-circle-outline'}
                size={40}
                color={ COLORS.PRIMARY}
              />
            </TouchableOpacity>
          )}
          <View style={[styles.inputContainer,styles.shadowBox]}>
            <TextInput
              style={[styles.inputStyle, isTablet ? { flex: 3 } : { flex: 1.5 }]}
              onChangeText={onChangeText}
              value={searchInput}
              placeholder={placeholder}
              placeholderTextColor={COLORS.GREY}
            />
            {isButtion && (
              <TouchableOpacity
                // onPress={onSearchBut}
                style={[
                  style.primaryLayout,
                  {
                    height: normalize(32),
                    width: normalize(32),
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopRightRadius: normalize(20),
                    borderBottomRightRadius: normalize(20),
                    marginRight:-15
                  },
                ]}>
                <Icon name="search" size={20} color={COLORS.WHITE} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {showFilter &&
          <ScrollView showsVerticalScrollIndicator={false}>
            {departureDate && <FilterItem expand={showDateRange} setExpand={setShowDateRange} name={'Departure Date'} handleExpenseDate={handleExpenseDate} dateTxt={dateTxt} setShowPicker={setShowPicker} showPicker={showPicker} />}
            {dateRange && <FilterItem expand={showDateRange} setExpand={setShowDateRange} name={'Date Range'} handleExpenseDate={handleExpenseDate} dateTxt={dateTxt} setShowPicker={setShowPicker} showPicker={showPicker} />}
            {location && <FilterItem expand={showLocation} setExpand={setShowLocation} name={'Location'} inputValue={locationInput} setInputValue={onLocationTxt} />}
            {experience && <FilterItem expand={showExperience} setExpand={setShowExperience} name={'Experience'} inputValue={experienceTxt} setInputValue={setExperinceTxt} keyboardType="numeric" />}
            {qualification && <FilterItem expand={showQua} setExpand={setShowQua} name={'Qualification'} qualificationData={qualificationData} qualificationTxt={qualificationTxt} setQualificationTxt={setQualificationTxt} />}
            {messageFilters && <View>
            <TouchableOpacity style={styles.filterBtnInactive} onPress={()=>setFavorite('Favourites')}>
              <Text style={[style.font16]}>Favourites</Text>
            </TouchableOpacity>
            <View style={styles.breakLine} />
            <TouchableOpacity style={styles.filterBtnInactive} onPress={()=>setGroups('Groups')}>
              <Text style={[style.font16]}>Groups</Text>
            </TouchableOpacity>
            <View style={styles.breakLine} />
            
  
           {nearMeFilter && <Dropdown
              style={[styles.dropdown,{marginBottom:10}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={nearMeData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={nearMe}
              onChange={item => {
                setNearMe(item.value);
              }}
              renderItem={renderItem}
            />}
  
           {awardsFilter && <Dropdown
              style={[styles.dropdown,{marginBottom:10}]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={awardsData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={awardLevel}
              onChange={item => {
                setAwardLevel(item.value);
              }}
              renderItem={renderItem}
            />}
           
            </View>}
            
  
          
          </ScrollView>}
          <View style={style.row}>
            {moment(dateTxt).format('DD-MM-YYYY') !== moment(new Date()).format('DD-MM-YYYY') && 
            <TouchableOpacity onPress={()=>setDateTxt(new Date())} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{ dateFormat(dateTxt)}</Text> 
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
            {locationInput &&  <TouchableOpacity onPress={()=>onLocationTxt('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{locationInput}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
             {experienceTxt && <TouchableOpacity onPress={()=>setExperinceTxt('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{experienceTxt}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
              {qualificationTxt &&<TouchableOpacity onPress={()=>setQualificationTxt('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{qualificationTxt}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
  
              {favorite && <TouchableOpacity onPress={()=>setFavorite('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{favorite}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
              {nearMe && <TouchableOpacity onPress={()=>setNearMe('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{`${nearMe} knots`}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
              {awardLevel && <TouchableOpacity onPress={()=>setAwardLevel('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{awardLevel}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
              {groups && <TouchableOpacity onPress={()=>setGroups('')} style={styles.filterBtn}>
              <Text style={{color:COLORS.WHITE,fontSize:12}}>{groups}</Text>
              <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
              </TouchableOpacity>}
            </View>
      </View>
    );
  };
  
  export default MessageCenterFilter;
  
  export const FilterItem = ({ expand, setExpand, name, dateTxt, handleExpenseDate, setShowPicker, showPicker, inputValue, setInputValue, qualificationData, qualificationTxt, setQualificationTxt, keyboardType }) => {
    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
  
        </View>
      );
    };
    return (<View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[style.row, { justifyContent: "space-between" }]} onPress={() => setExpand(!expand)}>
          <Text style={[{ color: COLORS.LIGHT_BLACK }, style.font14]}>{name}</Text>
          <FeatherIcon name={expand ? "chevron-up" : "chevron-down"} size={normalize(20)} color={COLORS.PRIMARY} />
        </TouchableOpacity>
        {expand && <View>
          {(name.toLowerCase().includes('location') || name.toLowerCase().includes('experience')) &&
            <TextInput style={styles.filterInput} placeholder={name.toLowerCase().includes('experience') ? `${name} in years`: name} value={inputValue} onChangeText={(txt) => setInputValue(txt)} keyboardType={keyboardType} />}
          {name.toLowerCase().includes('date') &&
            <View style={[styles.filterInputDate, style.row, { alignItems: "center", justifyContent: "space-between" }]}>
              <Text style={{ color: COLORS.BLACK, paddingVertical: 5 }}> {dateFormat(dateTxt)}</Text>
              {/* <DateRange /> */}
              <TouchableOpacity onPress={() => setShowPicker(!showPicker)} >
                <MaterialIcons name='calendar-month' size={25} color={COLORS.PRIMARY} />
              </TouchableOpacity></View>}
          {name.toLowerCase().includes('date') && showPicker &&
            <DateTimePicker
              value={dateTxt}
              mode="date"
              display="default"
              onChange={handleExpenseDate}
            />}
  
          {(name.toLowerCase().includes('qualification') || name.toLowerCase().includes('near') ) &&
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={qualificationData}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={qualificationTxt}
              onChange={item => {
                setQualificationTxt(item.value);
              }}
              renderItem={renderItem}
            />
          }
        </View>}
      </View>
    </View>)
  }
  
  const styles = StyleSheet.create({
    shadowBox:{
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
    textSubheading: {
      color: COLORS.GREY,
      fontSize: normalize(15),
      fontFamily: 'Roboto-Regular',
      fontWeight: '500',
      paddingHorizontal: 20,
      // lineHeight: 20,
    },
  
    inputStyle: {
      height: 35,
      paddingHorizontal: 10,
      borderWidth: 0,
      fontSize: normalize(14),
      fontFamily: 'Roboto-Regular',
      width: '95%',
      alignItems: 'center',
      padding: 2,
      color: COLORS.BLACK,
      // backgroundColor:COLORS.WHITE
    },
    inputContainer: {
      flex: 1,
      borderWidth: 1,
      paddingHorizontal: 15,
      // paddingTop: 2,
      borderRadius: 30,
      borderColor: COLORS.GREY,
      marginRight: 5,
      marginVertical: 3,
      // justifyContent:'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    btnStyle: {
      marginVertical: 10,
      marginLeft: 10,
      backgroundColor: COLORS.PRIMARY,
      borderRadius: 8,
      padding: 10,
      minWidth: 50,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: scaleHeight(65),
    },
    btnTextStyle: {
      color: COLORS.WHITE,
      fontSize: normalize(14),
      fontFamily: 'Roboto-Regular',
      fontWeight: '500',
      lineHeight: 20,
    },
    dropdown: {
      margin: 16,
      height: 15,
      flex: 1,
      color: COLORS.BLACK,
    },
    icon: {
      marginRight: 5,
    },
    selectedTextStyle: {
      fontSize: 16,
      color: COLORS.BLACK,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    filterContainer: {
      borderWidth: 1,
      padding: normalize(10),
      borderColor: COLORS.GREY,
      borderRadius: 5,
      marginVertical: 5
    },
    filterInput: {
      borderWidth: 1,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(5),
      borderColor: COLORS.GREY,
      borderRadius: 5,
      color: COLORS.BLACK,
      marginVertical: normalize(10),
    },
    filterInputDate: {
      borderWidth: 1,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(5),
      borderColor: COLORS.GREY,
      borderRadius: 5,
      color: COLORS.BLACK,
      marginVertical: normalize(10)
    },
    placeholderStyle: {
      fontSize: 16,
      color: COLORS.BLACK
    },
    selectedTextStyle: {
      fontSize: 16,
      color: COLORS.BLACK
    },
    iconStyle: {
      width: 30,
      height: 30,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    }, dropdown: {
      height: 50,
      backgroundColor: 'white',
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.GREY,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(0),
      borderRadius: 4,
      backgroundColor: "#F3F4F6",
      width: '100%',
      marginTop: 5
    },
    item: {
      padding: 10
    },
    textItem: {
      flex: 1,
      fontSize: 16,
      color: COLORS.BLACK
    },
    filterBtn:{
      backgroundColor:COLORS.PRIMARY,
      paddingHorizontal:normalize(10),
      paddingVertical:normalize(8),
      borderRadius:normalize(5),
      display:'flex',
      flexDirection:"row",
      alignItems:"center",
      marginHorizontal:normalize(5)
    },
    filterBtnInactive:{
      // backgroundColor:COLORS.PRIMARY,
      paddingHorizontal:normalize(10),
      paddingVertical:normalize(8),
      display:'flex',
      flexDirection:"row",
      alignItems:"center",
      // borderWidth:1
    },
    breakLine :{
      height:0.5,
      maxWidth:'100%',
      backgroundColor: COLORS.PRIMARY,
    },
  });
  