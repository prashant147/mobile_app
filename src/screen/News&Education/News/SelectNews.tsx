import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import style from "../../../styles/style";
import {
  normalize,
  scaleHeight,
  scaleWidth,
} from "../../../styles/utilities/dimentions";
import COLORS from "../../../styles/theme/color";
import DeviceInfo from "react-native-device-info";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { getLatestNewsById } from "../../../services/api/auth";
import { ActivityIndicator } from "react-native-paper";
import MembersContext from "../../Members/MembersContext";
import Menu from "../../../routes/Menu";
import AntDesign from 'react-native-vector-icons/FontAwesome';
import WebView from "react-native-webview";
import moment from "moment";
import FastImage from 'react-native-fast-image';

interface NewsScreenProps {
  news: any;
}
const isTablet = DeviceInfo.isTablet();
const SelectNews: React.FC<NewsScreenProps> = ({route}:any) => {
  const navigation = useNavigation()
  const { accessToken } = useContext(MembersContext);
  const [loader, setLoader] = useState(true);
  const [newsData, setNewsData] = useState<any>(null);
  useFocusEffect(
    React.useCallback(() => {      
      if (route) {
        getNewsData();
      }
    }, [route])
  );
  const getNewsData = async () => {
    setLoader(true);
    try {
      const response = await getLatestNewsById(accessToken, route?.params?.data);
      if (response.status === 200) {
        setNewsData(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

 
const backHandler = ()=>{
  if(route?.params?.path){
    navigation.navigate(route?.params?.path)
  }else{
    navigation.navigate('Home')
  }
}
const wrappedHtml = `
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
    <style>
        body { font-size: ${16}px; }
    </style>
</head>
<body>
    ${newsData?.newsDescription}
</body>
</html>
`;
const dateFormat =(date)=>{
  return moment(date).format('MMM DD, YYYY')
}
  return(
    <View style={[style.contant]}>
      <View style={[style.sidepanelcolor]}>
          <Menu selectIndex={1}></Menu>
        </View>
        <View style={[style.contant,style.mtb10,style.mt10, style.pH20]}>
        <View style={[style.row, style.mtb10, style.centerBox]}>
            {(
              <TouchableOpacity
              style={[style.row]}
                onPress={backHandler}
              >
                <AntDesign
                  name={"chevron-left"}
                  size={normalize(15)}
                  style={[style.mr10,style.mt3]}
                  color={COLORS.PRIMARY}
                />
                <Text style={[style.font16,style.boldTxt,style.primaryText]}>Back</Text>
              </TouchableOpacity>
            )}
          </View>
     {loader ? (
    <View style={[style.contant,style.row,style.centerBox,style.centerItem,]}>
      <ActivityIndicator
        theme={{ colors: { primary: COLORS.PRIMARY } }}
        size={"small"}
      />
    </View>
  ) : (
    <View style={[style.contant,style.mB30]}>
      {newsData?.newsMediasUrl ? (
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          style={styles.Image}
          source={{ uri: newsData?.newsMediasUrl }}
        ></FastImage>
      ) : (
        <Image
          resizeMode="center"
          style={styles.Image}
          source={require("../../../assets/dataImage/news_placeholder.png")}
        ></Image>
      )}
      <Text
        style={[
          isTablet ? style.font24 : style.font18,
          style.primaryText,
          style.boldTxt,
          style.mtb10,
        ]}
      >
        {newsData?.newsHeading}
      </Text>
      <Text style={[style.font12, style.mB10]}>
        {dateFormat(newsData?.creationTimestamp)}
      </Text>
      

      <WebView
        source={{ html: wrappedHtml }}
        javaScriptEnabled={true} // Enable JavaScript for iframe interactions
        domStorageEnabled={true} // Enable DOM storage for iframe functionality (if needed)
        style={[
          {
            height: Dimensions.get("screen").height * 0.4,
            backgroundColor: "transparent",
          },
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        allowsZoom={false}
      />
    </View>
  )}
  </View>
  </View>
  )
};
const styles = StyleSheet.create({
  Image: { 
    width: "100%", 
    height: isTablet ? Dimensions.get("screen").height*0.4:  scaleHeight(150),
    borderRadius:8 
  },
  desStyle:{
    lineHeight:25, 
    fontSize:14, 
    color:COLORS.BLACK
  }
});
export default SelectNews;

