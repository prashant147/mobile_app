import { StyleSheet, Text, View,TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { normalize } from '../styles/utilities/dimentions';
import COLORS from '../styles/theme/color';
import style from '../styles/style';
import Icon from "react-native-vector-icons/Ionicons";

const TextFeild = ({onchange={},labelName='',placeholder="",value="",numberOfLines=1,required,
multiline=false,keyboardType="default",errorMsg=null,isPassword=false,setErrorMessage}:any) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={style.contant}>
      {
        labelName!='' && <Text style={styles.labelStyle}>{labelName}{required && <Text style={styles.textDanger}> *</Text>}</Text>
      }
      <View style={[styles.inputBorderStyle,style.row]}>
        <TextInput
         value={value}
         style={styles.input}
          placeholder={`${placeholder}`}
          keyboardType={keyboardType}
          onChangeText={text => {onchange(text); setErrorMessage && setErrorMessage('') }}
          placeholderTextColor={COLORS.GREY}
          numberOfLines={numberOfLines}
          multiline={multiline}
          autoCapitalize={"none"}
          autoCorrect={false}
          clearTextOnFocus={false}
          secureTextEntry={(isPassword && !showPassword)}
        />
        {
          isPassword && <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={[style.centerItem,styles.showPasswordIcon]}>
            {showPassword ? (
              <Icon name="eye-outline" size={20} color="black" />
            ) : (
              <Icon name="eye-off-outline" size={20} color="black" />
            )}
          </TouchableOpacity>
        }
        
      </View>
      {
        errorMsg && <Text style={[style.textDanger,style.mH5]}>{errorMsg}</Text>
      }
      
    </View>
  );
}

export default TextFeild

const styles = StyleSheet.create({
    labelStyle:{
        fontSize:normalize(14),
        fontFamily:'Roboto-Regular',
        color:COLORS.BLACK,
        marginTop:normalize(10),
        fontWeight:'600'
    },

    inputBorderStyle:{
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
      height: '100%',
      width:'100%'
      // textAlignVertical:'center'
    },
    textDanger: {
      color: 'red',
      fontSize: normalize(12)
    },
    showPasswordIcon:{
      marginLeft: -20,
      width:normalize(30),
      height:normalize(30)
    }
})