import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Platform, StyleSheet, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import style from '../styles/style';
import COLORS from '../styles/theme/color';
import { normalize } from '../styles/utilities/dimentions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DateTimePickerBox = ({modal,placeholder,labelName,onChangeText, value,maxDate,valueError,required,minDate,stylesProp,disabled}:any) => {
  
  const [date, setDate] = useState('') // intial value is empty 
  const [open, setOpen] = useState(false)
  const isValidDate = !isNaN(new Date(value));
  useEffect(()=>{
    if(isValidDate){
      setDate(new Date(value))
    }
    else{
      setDate('')
    }
  },[value])


  const showDatePicker = () => {
    if(!isValidDate){
      setDate(new Date())  // setting the today's date on click 
    }
    setOpen(true);
  };

  const hideDatePicker = () => {
    setOpen(false);
  };

  const formatDate = (date:any) => {
    // Customize the date formatting based on your needs
    if(date){
      if(modal=="date"){
        return moment(date).format("MM/DD/YYYY");
       }else{  
        return moment(date).format("hh:mm A"); 
       }
    }
  };
  return (
    <View style={[stylesProp]}>
      {
        labelName!='' && <Text style={styles.labelStyle}>{labelName}{required && <Text style={style.textDanger}> *</Text>} </Text>
      }
      <TouchableOpacity  style={[style.contant,styles.inputBorderStyle]} onPress={showDatePicker} disabled={disabled}>
         <TextInput
         value={formatDate(date)}
         style={styles.input}
          placeholder={`${placeholder}`}
          placeholderTextColor={COLORS.GREY}
          editable={false}
          onPress={showDatePicker} // added onPress event to the TextInput
        />
        {modal === "date" && (
          <View style={[style.row,style.centerBox]}>
            {date && (
              <TouchableOpacity onPress={() => {setDate(""),onChangeText('')}} style={[stylesProp ? undefined :  style.mH10]}>
                <AntDesign name="close" size={20} color="#000" />
              </TouchableOpacity>
            )}
            {(stylesProp && !date  || !stylesProp) && <TouchableOpacity onPress={showDatePicker} disabled={disabled}>
              <MaterialIcons
                name="calendar-month" 
                size={25}
                color={COLORS.PRIMARY}
              />
            </TouchableOpacity>}
          </View>
        )}
      </TouchableOpacity>
      {valueError && <Text style={[style.textDanger]}>{valueError} </Text>}
      {open && (
        <DatePicker
        modal
        mode={modal}
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false)
              setDate(date)
              onChangeText(date)
            }}
            maximumDate={maxDate}
            minimumDate={minDate}
            onCancel={() => {
              setOpen(false)
            }}
          />
      )}
    </View>
  );
};
const styles = StyleSheet.create({ 
  labelStyle:{
    fontSize:14,
    fontFamily:'Roboto-Regular',
    color:COLORS.BLACK,
    fontWeight:'600'
},

inputBorderStyle: {
  borderWidth: 1,
  borderColor: COLORS.GREY,
  paddingHorizontal: normalize(10),
  paddingVertical: normalize(0),
  borderRadius: 4,
  marginVertical: normalize(5),
  backgroundColor: '#f2f4f6',
  width: '100%',
  flexDirection: 'row',
  alignItems: "center",
  justifyContent: "space-between",
  height: normalize(35),

},
  input: {
    color: '#000',
    // textAlignVertical:'center'
  },
})
export default DateTimePickerBox;
