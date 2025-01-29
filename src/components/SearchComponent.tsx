import {StyleSheet, Text, View,TouchableOpacity,TextInput, Dimensions,} from 'react-native';
import React,{useState} from 'react';
import COLORS from '../styles/theme/color';
import { normalize, scaleHeight, scaleWidth } from '../styles/utilities/dimentions';
import Icon from 'react-native-vector-icons/Feather'
import style from '../styles/style';
import { Dropdown } from 'react-native-element-dropdown';
import DeviceInfo,{isTablet} from 'react-native-device-info';
import FilterIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DropdownSelector from './DropdownSelector';
import { Keyboard } from 'react-native';

const SearchComponent = ({onChangeText={},searchInput="",placeholder="",Buttonholder="",isButtion=true,onSearchBut={},setValue,value,data,filter,showFilter,setShowFilter,setMembersFilter,membersFilter,clearButton=true,onSearchClear={},onSubmitEditing}:any) => {
  const isTablet = DeviceInfo.isTablet();
  const membersFilterData = [
    { label: 'All', value: '' },
    { label: 'Port Captains', value: 'Port Captains' },
    // { label: 'Ocean Class', value: 'ocean_class' },
    // { label: 'World Class', value: 'world_class' },
  ];
  const renderFilterItem = (item:any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>

      </View>
    );
  };
  return (
    <View>
      <View style={[style.row,style.mt10,{alignItems:'center'}]}>
      {filter && (
          <TouchableOpacity onPress={() => {setShowFilter(!showFilter);Keyboard.dismiss();}}>
            <FilterIcon
              name={showFilter ? 'filter-circle' : 'filter-circle-outline'}
              size={40}
              color={ COLORS.PRIMARY}
            />
          </TouchableOpacity>
        )}
      <View style={styles.inputContainer}>
        <Icon name="search" size={20} color={COLORS.GREY} />
        <TextInput
          style={[styles.inputStyle,styles.flex]}
          onChangeText={onChangeText}
          value={searchInput}
          placeholder={placeholder}
          placeholderTextColor={COLORS.GREY}
          blurOnSubmit={true}
          autoCorrect={false}
          onSubmitEditing={onSubmitEditing}
        />
        {clearButton && 
        <TouchableOpacity onPress={onSearchClear}> 
        {searchInput !== "" && <Icon name="x" size={23} color={COLORS.GREY} />}
        </TouchableOpacity>}
     {data && <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.selectedTextStyle}
      selectedTextStyle={[styles.selectedTextStyle]}
      itemTextStyle ={[styles.selectedTextStyle]}
      iconStyle={styles.iconStyle}
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Search with"
      value={value}
      onChange={(item) => {
        setValue(item.value);
      }}
  
    />}
      </View>
      {
        isButtion &&       
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSearchBut}
        style={[style.button,style.borderRadius8,style.primaryLayout,{justifyContent:'center'}]}>
        <Text style={[style.buttonTxt,style.whiteText]}>{Buttonholder}</Text>
      </TouchableOpacity>
      }

    </View>
    {showFilter && <View style={[style.row]}>
                    <Dropdown
            style={styles.dropdownFilter}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={membersFilterData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={membersFilter}
            onChange={item => {
              setMembersFilter(item.value);
              setShowFilter(false)
            }}
            renderItem={renderFilterItem}
          />

          

                    </View>}
                   {membersFilter &&  <View style={[style.row,style.mtb10]}>
                   <TouchableOpacity onPress={()=>setMembersFilter('')} style={styles.filterBtn}>
            <Text style={{color:COLORS.WHITE,fontSize:12}}>{membersFilter}</Text>
            <AntDesign name="close" size={15} color="#fff" style={{marginLeft:5}} />
            </TouchableOpacity>
                   </View>}
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
    textSubheading: {
        color: COLORS.GREY,
        fontSize: normalize(15),
        fontFamily:'Roboto-Regular',
        fontWeight: '500',
        paddingHorizontal:20,
        // lineHeight: 20, 
        
      },
    
      inputStyle: {
        height: 35,
        paddingHorizontal:10,
        borderWidth:0,
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        width:"95%",
        alignItems:'center',
        padding:2,
        color:COLORS.BLACK,
        // backgroundColor:COLORS.WHITE
      },
      inputContainer:{
        flex:1,
        borderWidth:1,
        paddingHorizontal:15,
        paddingTop:2,
        borderRadius:30,
        borderColor:COLORS.GREY,
        marginRight:5,
        marginVertical:3,
        // justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        height:40
      },
      btnStyle:{
        marginVertical:10,
        marginLeft:10,
        backgroundColor:COLORS.PRIMARY,
        borderRadius:8,
        padding:10,
        minWidth:50,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
        height:scaleHeight(65)
      },
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        fontWeight:'500',
        lineHeight:20
      },
      dropdown: {
        margin: 12,
        height: 15,
        width:80,
        color:COLORS.BLACK
      },
      icon: {
        marginRight: 5,
      },
      selectedTextStyle: {
        fontSize: !isTablet() ? Dimensions.get('screen').width*0.036 : Dimensions.get('screen').width*0.02,
        color:COLORS.BLACK
      },
      iconStyle: {
        width: 20,
        height: 20,
      }, placeholderStyle: {
        fontSize: 16,
        color: COLORS.BLACK
      },
      
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
       dropdownFilter: {
        height: 40,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(0),
        borderRadius: 8,
        backgroundColor: "#F3F4F6",
       width:'100%',
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
        justifyContent:'center',
        marginHorizontal:normalize(5),
       
      },
      flex:{
        flex:1.5
      }
   
});
