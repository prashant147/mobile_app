import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import style from '../styles/style';
import DeviceInfo from 'react-native-device-info';
import COLORS from '../styles/theme/color';


interface TabBoxProps {
    selectedTab:string,
    onTab:any,
    data:any,
    isDark?:any
    scrollEnabled:boolean
} 
const isTablet = DeviceInfo.isTablet();
const TabBox: React.FC<TabBoxProps> = ({selectedTab,onTab,data,isDark=false,scrollEnabled}) => {
  
  return (
    <View style={style.mtb10}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} scrollEnabled={scrollEnabled ? true : false}>
            {
                data?.map((e:string)=>(
                    <TouchableOpacity
                        style={[
                            styles.tabsContainer,
                            selectedTab === e && (isDark?styles.DarkSelectedTab:styles.selectedTab),
                        ]}
                        onPress={() => onTab(e)}>
                        <Text style={[(!isDark && isTablet)?style.font16:(isDark && isTablet)?style.font24:style.font14, style.grayText,selectedTab === e && (isDark? style.whiteText:style.primaryText)]}>{e}</Text>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({ 
    tabsContainer:{
        marginRight:20,
        paddingBottom:3
    },
    DarkSelectedTab:{
        borderColor:COLORS.WHITE,
        borderBottomWidth:5
    },
    selectedTab:{
        borderColor:COLORS.LIGHT_PRIMARY,
        borderBottomWidth:isTablet?5:3,
    }
});
export default TabBox;