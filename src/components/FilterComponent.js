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
import DateTimePickerBox from './dateTimeBox';

const FilterComponent = ({
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
  awardsFilter,
  experienceDropDown,
  departureDateRange,
  setDateTxtFrom,
  dateTxtFrom,
  setDateTxtTo,
  dateTxtTo,
  searchComponentWidth
  
}) => {
  const isTablet = DeviceInfo.isTablet();
  const [showDateRange, setShowDateRange] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [showExperience, setShowExperience] = useState(false)
  const [showQua, setShowQua] = useState(false)
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);

  const handleExpenseDate = (date) => {
    setShowPicker(false)
    if (date !== undefined) {
      setDateTxt(date);
    }
  };
  const handleExpenseDateFrom = (date) => {
    setShowPickerFrom(false)
    if (date !== undefined) {
      setDateTxtFrom(date);
    }
  };
  const handleExpenseDateTo = (date) => {
    setShowPickerTo(false)
    if (date !== undefined) {
      setDateTxtTo(date);
    }
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>

      </View>
    );
  };
  const experienceData = [
    { label: 'Select', value: '' },
    { label: '1-5', value: '1-5' },
    { label: '5-10', value: '5-10' },
    { label: '10-15', value: '10-15' },
    { label: '15+', value: '15-100' },
  ];
  
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
  const exptext = experienceTxt && experienceDropDown && experienceData.find((item => item.value === experienceTxt))
  const quatext = qualificationTxt &&  qualificationData.find((item => item.value === qualificationTxt))
  return (
    <View style={{width:searchComponentWidth? searchComponentWidth : "100%"}}>
      <View style={[style.row, style.mtb10, { alignItems: 'center' }]}>
        {filter && (
          <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
            <FilterIcon
              name={showFilter ? 'filter-circle' : 'filter-circle-outline'}
              size={40}
              color={ COLORS.PRIMARY}
            />
          </TouchableOpacity>
        )}
        <View style={styles.inputContainer}>
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
        <ScrollView>
          {departureDateRange && <FilterItem expand={showDateRange} setExpand={setShowDateRange} name={'Departure Date Range'} handleExpenseDateFrom={handleExpenseDateFrom} dateTxtFrom={dateTxtFrom} setShowPickerFrom={setShowPickerFrom} showPickerFrom={showPickerFrom} handleExpenseDateTo={handleExpenseDateTo} dateTxtTo={dateTxtTo} setShowPickerTo={setShowPickerTo} showPickerTo={showPickerTo} experienceDropDown={experienceDropDown}/>}
          {departureDate && <FilterItem expand={showDateRange} setExpand={setShowDateRange} name={'Departure Date'} handleExpenseDate={handleExpenseDate} dateTxt={dateTxt} setShowPicker={setShowPicker} showPicker={showPicker} experienceDropDown={experienceDropDown}/>}
          {dateRange && <FilterItem expand={showDateRange} setExpand={setShowDateRange} name={'Date Range'} handleExpenseDate={handleExpenseDate} dateTxt={dateTxt} setDateTxt={setDateTxt} setShowPicker={setShowPicker} showPicker={showPicker} experienceDropDown={experienceDropDown}/>}
          {location && <FilterItem expand={showLocation} setExpand={setShowLocation} name={'Location'} inputValue={locationInput} setInputValue={onLocationTxt} experienceDropDown={experienceDropDown}/>}
          {experience && <FilterItem expand={showExperience} setExpand={setShowExperience} name={'Experience'} inputValue={experienceTxt} setInputValue={setExperinceTxt} keyboardType="numeric" experienceDropDown={experienceDropDown}/>}
          {experienceDropDown && <FilterItem expand={showExperience} setExpand={setShowExperience} name={'Experience'} qualificationData={experienceData} qualificationTxt={experienceTxt} setQualificationTxt={setExperinceTxt} experienceDropDown={experienceDropDown}/>}
          {qualification && <FilterItem expand={showQua} setExpand={setShowQua} name={'Qualification'} qualificationData={qualificationData} qualificationTxt={qualificationTxt} setQualificationTxt={setQualificationTxt} experienceDropDown={experienceDropDown}/>}
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
        <View style={[style.row,{flexWrap:"wrap"}]}>
          {!isNaN(new Date(dateTxt)) &&
          <TouchableOpacity onPress={()=>setDateTxt('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{ dateFormat(dateTxt)}</Text> 
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>}
          {!isNaN(new Date(dateTxtFrom)) && !isNaN(new Date(dateTxtTo)) &&
          <TouchableOpacity onPress={()=>{setDateTxtFrom('');setDateTxtTo('')}} style={styles.filterBtn}>
            <Text style={[{color:COLORS.WHITE,fontSize:12}]}>{ dateFormat(dateTxtFrom)}</Text> 
            <Text style={[{color:COLORS.WHITE,fontSize:12},style.mH10]}>-</Text> 
            <Text style={[{color:COLORS.WHITE,fontSize:12}]}>{ dateFormat(dateTxtTo)}</Text> 
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>}
          {locationInput &&  <TouchableOpacity onPress={()=>onLocationTxt('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{locationInput}</Text>
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>}
            {exptext && <TouchableOpacity onPress={()=>setExperinceTxt('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{exptext.label}</Text>
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>}
            {!experienceDropDown && experienceTxt && <TouchableOpacity onPress={()=>setExperinceTxt('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{experienceTxt}</Text>
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>}
            {quatext  &&<TouchableOpacity onPress={()=>setQualificationTxt('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{quatext.label}</Text>
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

export default FilterComponent;

export const FilterItem = ({ expand, setExpand, name, dateTxt, handleExpenseDate, setShowPicker, showPicker, inputValue, setInputValue, qualificationData, qualificationTxt, setQualificationTxt, keyboardType,experienceDropDown,handleExpenseDateFrom,dateTxtFrom,setShowPickerFrom ,showPickerFrom,handleExpenseDateTo,dateTxtTo,setShowPickerTo,showPickerTo}) => {
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
        {(name.toLowerCase().includes('location') || (name.toLowerCase().includes('experience') && !experienceDropDown)) &&
          <TextInput style={styles.filterInput} placeholder={name.toLowerCase().includes('experience') ? `${name} in years`: name} value={inputValue} onChangeText={(txt) => setInputValue(txt)} keyboardType={keyboardType} />}
        {/* {name.toLowerCase().includes('date') &&
          <View style={[styles.filterInputDate, style.row, { alignItems: "center", justifyContent: "space-between" }]}>
            <Text style={{ color: COLORS.BLACK, paddingVertical: 5 }}> {dateFormat(dateTxt)}</Text>
            <DateRange />
            <TouchableOpacity onPress={() => setShowPicker(!showPicker)} >
              <MaterialIcons name='calendar-month' size={25} color={COLORS.PRIMARY} />
            </TouchableOpacity></View>} */}
            {name === 'Departure Date Range' && <View style={[style.row,style.between]}>
            <DateTimePickerBox
          onChangeText={(value)=> handleExpenseDateFrom(value)} 
          value={dateTxtFrom} 
          modal={'date'} 
          placeholder={'Pick Date'}
          stylesProp={{width:'45%'}}
          />
          <DateTimePickerBox
          onChangeText={(value)=> handleExpenseDateTo(value)} 
          value={dateTxtTo} 
          modal={'date'} 
          placeholder={'Pick Date'}
          stylesProp={{width:'45%'}}
          minDate={dateTxtFrom}
          disabled={!dateTxtFrom}
          />
            </View>}
        {name.toLowerCase().includes('date') && name !== 'Departure Date Range' &&
          <DateTimePickerBox
          onChangeText={(value)=> handleExpenseDate(value)} 
          value={dateTxt} 
          modal={'date'} 
          placeholder={'Pick Date'}
          />}
         {(name.toLowerCase().includes('experience') && experienceDropDown) &&
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
    marginHorizontal:normalize(5),
    marginVertical:normalize(3)
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
