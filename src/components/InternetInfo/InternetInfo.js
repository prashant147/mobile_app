import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, Animated } from 'react-native';
import style from '../../styles/style';
import COLORS from '../../styles/theme/color';
import { useFocusEffect } from '@react-navigation/native';
import MembersContext from '../../screen/Members/MembersContext';

const InternetInfo = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showisConnected, setShowIsConnected] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const timeoutRef = useRef(null);
  const {setInternetStatus}=useContext(MembersContext)

  useFocusEffect(useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setInternetStatus(state.isConnected)
        
      if (state.isConnected) {
        slideInOut();
        timeoutRef.current = setTimeout(() => {
            slideInOut();
          setShowIsConnected(false)
        }, 3000);
      } else {
        clearTimeout(timeoutRef.current); 
        slideInOut();
        setShowIsConnected(true)
      }
    });

    return () => {
      unsubscribe(); 
      clearTimeout(timeoutRef.current); 
    };
  }, []));

  const slideInOut = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
   <View>
        {isConnected && showisConnected && <Animated.View style={[style.pH20, style.pV20, {
        backgroundColor: isConnected ? COLORS.GREEN : COLORS.RED,
        transform: [{ translateY: slideAnim }],
        bottom: 0,
        width: '100%'
        }]}>
            <Text style={[style.whiteText,style.boldTxt]}>Connected to the internet!</Text>
        </Animated.View>}
       {!isConnected && <View style={[style.pH20,style.pV20,{backgroundColor: isConnected ? COLORS.GREEN : COLORS.RED}]}>
         <Text style={[style.whiteText,style.boldTxt]}>No internet connection!</Text>
         </View>}
    </View>
  );
};

export default InternetInfo;
