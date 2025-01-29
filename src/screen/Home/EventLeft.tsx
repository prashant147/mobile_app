import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import style from "../../styles/style"
import UserInfo from "../../components/UserInfo"
import { Text } from "react-native";
import COLORS from "../../styles/theme/color";
import UpcomingEvent from "./UpcomingEvent";
import { useNavigation } from "@react-navigation/native";

const EventLeft = () => { 
    const navigation = useNavigation();
    return (
        <View style={[style.contant,style.primaryLayout]}>
            <UserInfo></UserInfo>
            <ScrollView style={[style.contant,style.mH10]}>
                <UpcomingEvent></UpcomingEvent>
                <TouchableOpacity onPress={() => navigation.navigate('RalliesEvents')} style={[style.Blackbutton,style.whiteLayout,style.mH20,style.mt20,style.mtb10]}>
                <Text style={[style.BlackbuttonTxt,style.font16]}>View Full Calender</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    iconBox:{
      borderColor:COLORS.LIGHT_PRIMARY,
      borderWidth:1,
      borderRadius:3,
      alignContent:'center',
      alignItems:'center',
      justifyContent:'center',
      width:20,
      height:20
    }
})
export default EventLeft;