import React, { useRef, useEffect } from 'react';
import { ScrollView, Animated, Text, View, StyleSheet, Dimensions } from 'react-native';
import COLORS from '../../styles/theme/color';
import style from '../../styles/style';

const { width } = Dimensions.get('window');

const ScrollingText = ({ text }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [
            {
              translateX: scrollX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width * 2], // Adjust multiplier as needed for longer text
              }),
            },
          ],
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={[styles.text]}>{text}</Text>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const App = () => {
  return (
    <View style={style.container}>
      <ScrollingText text="www.saltydawgsailing.org" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40, // Adjust height as needed
    backgroundColor: COLORS.PRIMARY, // Background color for the scrolling text
    overflow: 'hidden',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
    color:COLORS.WHITE,
    width:"100%",
    height:"100%"
  },
});

export default App;
