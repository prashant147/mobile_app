import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'
import { normalize } from '../styles/utilities/dimentions'
import COLORS from '../styles/theme/color'
import Icon from 'react-native-vector-icons/FontAwesome';

const BackButton = ({onPress={},color=COLORS.PRIMARY}) => {
  return (
    <TouchableHighlight onPress={onPress} style={styles.containerStyle}>
    <Icon name="chevron-left" size={25} color={color} />
 </TouchableHighlight>
  )
}

export default BackButton
 
const styles = StyleSheet.create({
    containerStyle:{
      width:normalize(25),height:normalize(25), 

      marginRight:5,justifyContent:'center',alignItems:'center'
    }
})