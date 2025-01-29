import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import style from "../styles/style";
import Menu from "./Menu";
import COLORS from "../styles/theme/color";
const ReleaseNotes = () => {
    let data = [
      {
        "id": 1,
        "title": `Issue with viewing multiple images in posts resolved.`
      },
      {
        "id": 1,
        "title": `Keyboard issue in message threads resolved.`
      },
     
    ]
  let featuresData = [
    {
      id: 1,
      title: "Profile updates now sync with CometChat, adding the primary boat name to the display name.",
    }
  ];
  return (
    <View style={[style.contant]}>
      <View style={[style.sidepanelcolor]}>
        <Menu selectIndex={0}></Menu>
      </View>
      <ScrollView scrollToOverflowEnabled={true} style={[style.contant, style.mt10]}>
        <View style={[style.mH20, style.mt20]}>
          <Text style={[style.font20, style.boldTxt]}>What's new</Text>
          <View style={[style.mt10]}>
            <Text style={[style.font16, style.boldTxt]}>Features</Text>
            <View>
              {featuresData.map((item, index) => (
                <View style={[style.mt10, style.row]} key={index}>
                  <Text style={[style.font16]}>{index + 1}. </Text>
                  <Text style={[style.font16]}>{item.title}</Text>
                </View>
              ))}
            </View>
            <View style={[style.mtb10,style.mr10]}>
              <Text style={[style.font16, style.boldTxt]}>Fixes</Text>
              <View style={[style.contant]}>
                {data.map((item, index) => (
                  <View style={[style.mt10, style.row]} key={index}>
                    <Text style={[style.font16]}>{index + 1}. </Text>
                    <Text style={[style.font16]}>{item.title}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default ReleaseNotes;