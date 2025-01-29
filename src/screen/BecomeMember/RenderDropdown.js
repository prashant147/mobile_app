import { StyleSheet, Text, Keyboard } from 'react-native';
import { useState,useEffect } from 'react';
import { View,KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import style from '../../styles/style';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import { ActivityIndicator } from 'react-native-paper';

 const RenderDropdown = ({loading, data, name, heading,value, setValue,selectedItem, placeholder, search, valueError,renderDropdownItem,onChange,required,stylesProp,open }) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };
  const renderLoader = item => {
    return (
      <View style={styles.item}>
       <ActivityIndicator color={COLORS.PRIMARY}/>
      </View>
    );
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setIsKeyboardOpen(true);
        }
    );

    const keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            setIsKeyboardOpen(false);
        }
    );

    return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
    };
}, []);

    return (
     
      <View style={[style.mtb10,stylesProp]}>
        {heading && <Text style={[style.font16, style.BlackbuttonTxt,style.mb5]}>{heading}</Text>}   
        {name && <Text style={[style.font14, style.BlackbuttonTxt]}>{name}{required && <Text style={styles.textDanger}> *</Text>}</Text>}      
        <KeyboardAvoidingView
      style={[style.contant]}
      behavior={Platform.OS=="ios"?"padding":'height'}
      keyboardVerticalOffset={isKeyboardOpen ? Dimensions.get('screen').height * 0.12 : 0}
    >
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={loading ? [{label:placeholder,value:""}] : data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          searchPlaceholder="Search..."
          value={value}
          open={open}
          onChange={onChange}
          selectedItem={selectedItem}
          search={search ? search : false}
          renderItem={renderDropdownItem ? renderDropdownItem : (loading ? renderLoader : renderItem)}
        />
            </KeyboardAvoidingView>
        {valueError && <Text style={[styles.textDanger]}>{valueError} </Text>}
      </View>

    )
  }
  export default RenderDropdown

  const styles = StyleSheet.create({
    dropdown: {
      height: normalize(35),
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.GREY,
      paddingHorizontal: normalize(10),
      paddingVertical: normalize(0),
      borderRadius: 4,
      backgroundColor: '#f2f4f6',
      width: '100%',
      marginTop: 5
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
    },
    textItem: {
      flex: 1,
      fontSize: 16,
      color: COLORS.BLACK
    },
    item: {
      padding: 10
    },
    textDanger: {
      color: 'red',
      fontSize: normalize(12)
    },
  })