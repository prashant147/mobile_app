import React, { useContext, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity,Keyboard } from "react-native";
import { normalize, scaleWidth } from "../../styles/utilities/dimentions";
import ExploreMap from "./ExploreMap";
import COLORS from "../../styles/theme/color";
import style from "../../styles/style";
import Menu from "../../routes/Menu";
import Icon from "react-native-vector-icons/FontAwesome";
import MembersContext from "./MembersContext";
interface MemberMapProps {}
const MemberMap: React.FC<MemberMapProps> = ({ navigation, route }: any) => {
  const { setHideChatbot, setHideChatbotMember, setSelectedMenu } =
    useContext(MembersContext);
  const [selectedTab, setSelectedTab] = useState("Map");
  const [boatsData,setBoatsData] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      setSelectedMenu(2);
      if (selectedTab === "Map") {
        setHideChatbot(true);
        setHideChatbotMember(true);
      } else {
        setHideChatbot(true);
        setHideChatbotMember(true);
      }
    }, [selectedTab])
  );
  const onClickBack = () => {
    setBoatsData([])
    Keyboard.dismiss()
    navigation.navigate("Home");
  };
  return (
    <View style={[style.contant]}>
      <View style={style.sidepanelcolor}>
        <Menu selectIndex={2} />
      </View>
      <View
        style={[style.contant, selectedTab !== "Map" && style.pH20, style.pt20]}
      >
        <View style={[selectedTab === "Map" && style.pH20]}>
          <View style={[style.row]}>
            {
              <TouchableOpacity style={style.row} onPress={onClickBack}>
                <Icon
                  name="chevron-left"
                  size={normalize(15)}
                  style={[style.mr10, style.mt3]}
                  color={COLORS.PRIMARY}
                />
                <Text style={[style.font16, style.boldTxt, style.primaryText]}>
                  Back
                </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
        <View style={[style.contant]}>
        <ExploreMap boatsData={boatsData} setBoatsData={setBoatsData} marker={route?.params?.marker}/>
        </View>
      </View>
    </View>
  );
};

export default MemberMap;
