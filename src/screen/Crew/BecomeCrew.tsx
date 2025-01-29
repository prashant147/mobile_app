import { StyleSheet, Text, View,FlatList,Image, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchComponent from '../../components/SearchComponent';
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import { boatList } from '../../styles/utilities/constants';
import style from '../../styles/style';
import DeviceInfo from 'react-native-device-info';

// import ViewMoreText from 'react-native-view-more-text';

const BecomeCrew = () => {
  const isTablet = DeviceInfo.isTablet();

  const [searchTxt, setsearchTxt]=useState<string>("");
  const [search, setSearch]=useState<string>("");
  const [boat, setBoat]=useState<any>(boatList);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState({});

  const toggleModal = (index) => {
    setModalVisible(!modalVisible);
    setIsRequestSent({
      ...isRequestSent,
      [index]: true,
    });
  };
  const toggleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    let timeout;
    if (modalVisible) {
      timeout = setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [modalVisible]);

  const onMoreView = (item:any,isActive:boolean,index:number)=>{
    const b = [...boat];
    b[index].isView = isActive;
    setBoat(b)
  }
  const renderCrewList =({item,index}:any)=>{
    const isSent = isRequestSent[index];
      return(
          <View  style={[styles.line,style.row]}>
              <Image source={item?.image} style={styles.profileImg} />
              <View style={style.contant}>
                <View style={style.row}>
                  <View style={[style.contant,{paddingHorizontal:normalize(20)}]}>
                  <View style={[style.row, {flexDirection: 'row', flexWrap: 'wrap'}]}>
                  <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                          <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
                      </View>
                      <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                          <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.captain}</Text>
                      </View>
                      <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                          <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.coOwner}</Text>
                      </View>
                      <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                          <Text style={styles.nameTitleStyle}>BOAT OWNER</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.boatOwner}</Text>
                      </View>
                      <View style={{marginRight: 20, marginBottom: 20, flex: 1}}>
                          <Text style={styles.nameTitleStyle}>HOME PORT</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.homePort}</Text>
                      </View>
                    </View>
                    <View
              style={[
                style.row,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
                     <View style={{flex: 1}}>
                          <Text style={styles.nameTitleStyle}>MODEL NO.</Text>
                          <Text style={[styles.nameTitleTextStyle, {width:isTablet ?100 : 0}]}>{item?.modelNo}</Text>
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={styles.nameTitleStyle}>PHONE NO</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.phone}</Text>
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={styles.nameTitleStyle}>EMAIL</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.mail}</Text>
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={styles.nameTitleStyle}>VACCANCY</Text>
                          <Text style={[styles.nameTitleTextStyle,{textAlign:'center'}]}>{item?.vaccancy}</Text>
                      </View>
                      <View style={{flex: 1}}>
                          <Text style={styles.nameTitleStyle}>POSITION</Text>
                          <Text style={styles.nameTitleTextStyle}>{item?.position}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{justifyContent:'center'}}>
                    <TouchableOpacity style={styles.btnStyle} onPress={()=>toggleModal(index)} disabled={isSent}>
                        <Text style={styles.btnTextStyle}>{isSent ? 'Joining Request Sent' : 'Send Joining Request'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Modal
                    animationType="fade"
                    transparent={true}
                    style={styles.modelUser}
                    visible={modalVisible}
                    onRequestClose={toggleModal}
                  >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Joining request has been sent successfully !</Text>
                  </View>
                </View>
              </Modal>
                </View>
                <View style={[styles.line,{margin:normalize(10)}]}>
                    <View style={{paddingHorizontal:normalize(20)}}>
                        <Text  numberOfLines={2}  ellipsizeMode="tail"  style={[styles.nameTitleStyle,{width:'80%'}]}>DESCRIPTION</Text>
                        {
                          !item.isView && <View style={style.row}>
                             <Text numberOfLines={1}   style={[styles.nameTitleTextStyle,{width:"30%"}]}>{item?.description}</Text>
                             <TouchableOpacity onPress={()=>onMoreView(item,true,index)}><Text>View More</Text></TouchableOpacity>
                            </View>
                        }
                        {
                          item.isView && <View><Text numberOfLines={5} style={[styles.nameTitleTextStyle]}>{item?.description}</Text>
                          <TouchableOpacity onPress={()=>onMoreView(item,false,index)}><Text>View Less</Text></TouchableOpacity></View>
                        }
                        
                    </View>
                </View>
              </View>
          </View>
      )
  }
  const renderCrewPhoneList =({item,index}:any)=>{
    const isSent = isRequestSent[index];
    return(
      <View style={{justifyContent:'space-between'}}>
      <View  style={[styles.line, style.row]}>
          <Image source={require('../../assets/boat1.png')} style={styles.profileImg} />
          <View style={style.mH10}>
              <View style={style.mt20}>
                    <Text style={styles.nameTitleStyle}>BOAT NAME</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.boatName}</Text>
                </View>
                <View >
                    <Text style={styles.nameTitleStyle}>CAPTAIN</Text>
                    <Text style={styles.nameTitleTextStyle}>{item?.captain}</Text>
                </View>
          </View>
      </View>
      <View style={[style.row,{justifyContent:'space-between'}]}>
          <View >
              <Text style={styles.nameTitleStyle}>CO-OWNER</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.coOwner}</Text>
          </View>
          <View >
              <Text style={styles.nameTitlePhoneStyle}>BOAT PORT</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.boatOwner}</Text>
          </View>
      </View>
      <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
          <View>
              <Text style={styles.nameTitleStyle}>HOME PORT</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.homePort}</Text>
          </View>
          <View >
              <Text style={styles.nameTitlePhoneStyle}>MODEL NO</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.modelNo}</Text>
          </View>
      </View>
      <View style={[style.row,style.mt10,{justifyContent:'space-between'}]}>
          <View>
              <Text style={styles.nameTitleStyle}>MAKE YEAR</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.makeYear}</Text>
          </View>
          <View>
              <Text style={styles.nameTitlePhoneStyle}>MAKE</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.make}</Text>
          </View>
      </View>
      <View style={[style.row,style.mtb10,{justifyContent:'space-between'}]}>
          <View >
              <Text style={styles.nameTitleStyle}>LENGTH</Text>
              <Text style={styles.nameTitleTextStyle}>{item?.length}</Text>
          </View>
          <View >
              <Text style={styles.nameTitlePhoneStyle}>WIDTH</Text>
              <Text style={styles.nameTitlePhoneTextStyle}>{item?.width}</Text>
          </View>
      </View>
      <View >
          <Text  numberOfLines={2}  ellipsizeMode="tail"  style={[styles.nameTitleStyle,{width:'80%'}]}>DESCRIPTION</Text>
          {
            !item.isView && <View style={style.row}>
                <Text numberOfLines={1} style={[style.font16,{width:'80%'}]}>{item?.description}</Text>
                <TouchableOpacity onPress={()=>onMoreView(item,true,index)}><Text style={[style.font14,style.primaryText]}>View More</Text></TouchableOpacity>
              </View>
          }
          {
            item.isView && <View><Text numberOfLines={10} style={[style.font16]}>{item?.description}</Text>
            <TouchableOpacity onPress={()=>onMoreView(item,false,index)}><Text style={[style.font14,style.primaryText]}>View Less</Text></TouchableOpacity></View>
          }
          
      </View>
      <View style={style.pV20}>
        <TouchableOpacity style={styles.btnStyle} onPress={()=>toggleModal(index)} disabled={isSent}>
            <Text style={styles.btnTextStyle}>{isSent ? 'Joining Request Sent' : 'Send Joining Request'}</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        style={styles.modelUser}
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Joining request has been sent successfully !</Text>
          </View>
        </View>
      </Modal>
    </View>
    )
}
useEffect(() => {

  try {
    const searchText = searchTxt.toLowerCase();
    const filteredBoats = boatList.filter(
      (item) => item.boatName.toLowerCase().includes(searchText)
    );
    setBoat(searchText === "" ? boatList : filteredBoats);
  } catch (error) {
    console.log("Error:", error);
  }
}, [searchTxt]);


  return (
    <View style={styles.container}>
    <Text style={[isTablet?style.font20:style.font14,style.primaryText,!isTablet&&{marginTop:10}]}>Find boat on the search bar</Text>
    <SearchComponent
    searchInput={search}
    onSearchBut={() => setsearchTxt(search)}
    onChangeText={(txt: string) => {
      setSearch(txt);
      if (txt === '') {
        setsearchTxt(''); 
        setBoat(boatList); 
      }
    }}
    placeholder={'Find boat'}
    Buttonholder={'Find Boat'}
  />
    <View style={styles.container}>
        <FlatList
          data={boat}
           renderItem={isTablet?renderCrewList:renderCrewPhoneList}
           removeClippedSubviews={false}
           showsVerticalScrollIndicator={false}
          />
    </View>
  </View>
  )
}

export default BecomeCrew

const styles = StyleSheet.create({
  nameTitlePhoneStyle:{
    color:COLORS.GREY,
    fontSize:normalize(10),
    textAlign:'right'
  },
  nameTitlePhoneTextStyle:{
    color:COLORS.BLACK,
    fontSize:normalize(14),
    fontWeight:"600",
    lineHeight:30,
    textAlign:'right'
  },
    container:{
        flex:1,
        marginTop:normalize(30)
    },
    textTitleHeading: {
      color: COLORS.BLACK,
      fontSize: normalize(14),
      fontWeight: '400',
        lineHeight: 30,
      },
      profileImg:{
        width:normalize(100),
        height:normalize(100),
        resizeMode:'contain'
      },
      nameTitleStyle:{
        color:COLORS.GREY,
        fontSize:normalize(10),
      },
      nameTitleTextStyle:{
        color:COLORS.BLACK,
        fontSize:normalize(14),
        fontWeight:"600",
        lineHeight:30
      },
      line: {
        borderTopWidth: 1,
        // borderBottomWidth:1,
        // width: '100%',
        borderColor: COLORS.GREY,
        paddingVertical: normalize(5),
        // borderRadius:8
      },
      btnStyle:{
        borderWidth:1,
        borderColor:COLORS.PRIMARY,
        backgroundColor:COLORS.PRIMARY,
        paddingHorizontal:normalize(10),
        paddingVertical:normalize(5),
        margin:normalize(5),
        borderRadius:normalize(4),
        marginLeft:'auto',
        height:normalize(30),
        justifyContent:'center',
        alignItems:'center'
      },
      btnTextStyle:{
        color:COLORS.WHITE,
        fontSize:normalize(14),
      },
      modelUser: {
        width: 300,
        height: 500
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust opacity here
      },
      modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
      },
      modalText: {
        color:COLORS.BLACK,
        fontSize:normalize(14),
        fontWeight:"600",
        lineHeight:30,
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 10
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
})