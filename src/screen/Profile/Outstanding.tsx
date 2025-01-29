import { useState,useEffect } from "react";
import { FlatList, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import style from "../../styles/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import { isTablet } from "react-native-device-info";
import COLORS from "../../styles/theme/color";
import { normalize, scaleHeight } from "../../styles/utilities/dimentions";
import SearchComponent from "../../components/SearchComponent";


const Outstanding = () => { 
    const [isActive,setIsActive] = useState(0)
    const [search, setSearch]=useState<string>("");
    const [searchTxt, setsearchTxt]=useState<string>("");
    const [invoiceList, setInvoiceList] = useState(null)

    useEffect(()=>{
        try {
          let filterData = invoicesData.filter(item=>item.name.toLowerCase().indexOf(search.toLowerCase())>=0);
        //   setInvoiceList(search=="" ? invoicesData : filterData)
          if(search.length == 0){
            setInvoiceList([]);
            setInvoiceList(invoicesData);
          }else{
            setInvoiceList(filterData);
            setTimeout(() => {
                Keyboard.dismiss();
            }, 4000);
          }
        } catch (error) {
          console.log("error",error);
        }
      },[search])


    
    const renderInvoices = (item:any)=>{
        return <View style={[style.row,styles.line]}>
            <Text style={[style.contant,{color:COLORS.BLACK}]}>{item.item.id}</Text>
            <Text style={[style.contant,{color:COLORS.BLACK}]}>{item.item.name}</Text>
            <Text style={[style.contant,{color:COLORS.BLACK}]}>{item.item.Count}</Text>
            <Text style={[style.contant,{color:COLORS.BLACK}]}><View style={style.greenDot}/> {item.item.isPay?'Paid':'Pending'}</Text>
            <Text style={[style.contant,{color:COLORS.BLACK}]}>{item.item.Total}</Text>
            <View>
                <TouchableOpacity style={[style.button,{width:130},style.borderRadius5]} onPress={() => item.item.isPay ? setIsActive(0) : setIsActive(1)}>
                    <Text style={[style.font14, style.buttonTxt]}>{item.item.isPay?'View Invoice':'Pay Bill'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    const renderPhoneInvoices = (item:any)=>{
        return (
          <View style={[styles.line]}>
            <View style={{flexDirection:'row',flex:1}}>
              <View style={[style.column,{flex:0.6}]}>
                <View style={[style.row,]}>
                  <Text style={[style.contant, style.font14, {flex: 0.45}]}>
                    #{item.item.id}
                  </Text>
                  <Text style={[ style.contant, style.font14, style.boldTxt, {flex: 1}, ]}>
                    <Text style={[style.grayText,]}>Name:</Text> {item.item.name}
                  </Text>
                </View>
                <View style={[style.row, style.mtb10]}>
                  <Text style={[ style.contant, style.font14, style.boldTxt, {flex: 0.31}, ]}>
                    <Text style={style.grayText}>Count:</Text>
                    {item.item.Count}
                  </Text>
                  <Text style={[ style.contant, style.font14, style.boldTxt, {flex: .5}, ]}>
                    <Text style={style.grayText}>Status:</Text>
                     {item.item.isPay ? 'Paid' : 'Pending'}
                  </Text>
                  {/* <Text style={[ style.contant, style.font14, style.boldTxt, {flex: 0.3}, ]}>
                    <Text style={style.grayText}>Total:</Text>
                    {item.item.Total}
                  </Text> */}
                </View>
                <View style={[style.row]}>
                  <Text style={[ style.contant, style.font14, style.boldTxt, {flex: 0.4}, ]}>
                    <Text style={style.grayText}>Total:</Text>
                    {item.item.Total}
                  </Text>
                </View>
              </View>
              <View style={[{alignContent:'center',alignItems:'center',flex:.4},style.mt20]}>
                <TouchableOpacity style={[style.button,{width:130},style.borderRadius5]}  onPress={() => item.item.isPay ? setIsActive(0) : setIsActive(1)}>
                    <Text style={[style.font14, style.buttonTxt]}>{item.item.isPay?'View Invoice':'Pay Bill'}</Text>
                </TouchableOpacity>
            </View>
            </View>
            
          </View>
        );
    }
    return (

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={'always'} style={style.contant}>
        <View style={[style.row, style.mtb10]}>
          {isTablet() && (
            <View style={[style.row, {flex: 2}]}>
              <Image
                source={require('../../assets/boat1.png')}
                style={styles.profileImg}
              />
              <View style={[style.mH20, style.mt10]}>
                <Text style={[style.font12, style.grayText]}>MEMBER NAME</Text>
                <Text style={[style.font18, style.boldTxt]}>Jack Sparrow</Text>

                <Text style={[style.font12, style.grayText, style.mt10]}>
                  KNOWN AS
                </Text>
                <Text style={[style.font12, style.boldTxt]}>Jack</Text>
              </View>
            </View>
          )}

          <View style={[style.primaryLayout, style.contant,style.borderRadius5]}>
            <View style={[style.pH20, {paddingVertical: 30}]}>
              <Text style={[style.font14, style.grayText]}>Balance</Text>
              <Text style={[style.font24, style.whiteText]}>$ 0.00</Text>
            </View>
            <View style={styles.boxFooter}>
              <Text style={[style.pH20, style.font16, style.whiteText]}>
                Member Status:{' '}
                <Text style={[{color: COLORS.GREEN},style.boldTxt]}>Active</Text>
              </Text>
            </View>
          </View>
        </View>
        <View style={style.contant}>
          <Text
            style={[
              style.font16,
              style.primaryText,
              style.boldTxt,
              style.mt10
            ]}>
            {isActive == 0 ? 'Invoices' : 'Bills Pay (Apple Pay Integrate)'}
          </Text>

          <View style={[style.contant]}>
            {isActive == 0 && (
              <View style={style.contant}>
                <SearchComponent
                 searchInput={search}
                 onSearchBut={() => setsearchTxt(search)}
                 onChangeText={(txt: string) => setSearch(txt)}
                //   onChangeText={() => {}}
                  placeholder={'Search by name'}
                  isButtion={false}/>
                {invoiceList && invoiceList.length > 0 ? 
                <FlatList
                  data={invoiceList}
                  renderItem={isTablet() ? renderInvoices : renderPhoneInvoices}
                  removeClippedSubviews={false}
                  showsVerticalScrollIndicator={false}
                />
                : 
                <View style={[style.contant,style.centerItem,style.centerBox,style.mt40]}>
                  <Text style={[style.centerItem,style.font14,style.mt40]}>No Invoices Found</Text>
                  </View>}
              </View>
            )}
            {isActive == 1 && (
              <View style={[isTablet() && style.row, style.pV20]}>
                <View style={[style.row, {justifyContent: 'space-around'}]}>
                  <View>
                  <TouchableOpacity
                    style={[
                      {width: 130, height: 100,
                        borderColor:COLORS.PRIMARY,
                        borderWidth:1,
                        borderRadius:8,
                        alignContent:'center',
                        alignItems:'center',
                        paddingVertical:scaleHeight(10),
                        paddingHorizontal:10},
                      style.centerItem,
                      isTablet() && style.mr10,
                    ]}>
                    <Icon
                      name="qrcode"
                      style={style.pH20}
                      size={30}
                      color={COLORS.PRIMARY}
                    />
                  <Text style={[style.font14, style.boldTxt,style.textCenter]}>Scan QR Code</Text>
                  </TouchableOpacity>
                  </View>
                  <View>
                  <TouchableOpacity
                   style={[
                    {width: 130, height: 100,
                      borderColor:COLORS.PRIMARY,
                      borderWidth:1,
                      borderRadius:8,
                      alignContent:'center',
                      alignItems:'center',
                      paddingVertical:scaleHeight(10),
                      paddingHorizontal:10},
                    style.centerItem,
                    isTablet() && style.mr10,
                  ]}>
                    <Icon
                      name="user-o"
                      style={style.pH20}
                      size={30}
                      color={COLORS.PRIMARY}
                    />
                  <Text style={[ style.font14, style.boldTxt,style.textCenter]}>Contacts</Text>
                  </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    style.row,
                    {justifyContent: 'space-around'},
                    !isTablet() && style.mt20,
                  ]}>
                    <View>
                  <TouchableOpacity
                    style={[
                      {width: 130, height: 100,
                        borderColor:COLORS.PRIMARY,
                        borderWidth:1,
                        borderRadius:8,
                        alignContent:'center',
                        alignItems:'center',
                        paddingVertical:scaleHeight(10),
                        paddingHorizontal:10},
                      style.centerItem,
                      isTablet() && style.mr10,
                    ]}>
                    <Icon
                      name="rupee"
                      style={style.pH20}
                      size={30}
                      color={COLORS.PRIMARY}
                    />
                  <Text style={[ style.font14, style.boldTxt,style.textCenter]}>Card</Text>
                  </TouchableOpacity>
                  </View>
                  <View>
                  <TouchableOpacity
                    style={[
                      {width: 130, height: 100,
                        borderColor:COLORS.PRIMARY,
                        borderWidth:1,
                        borderRadius:8,
                        alignContent:'center',
                        alignItems:'center',
                        paddingVertical:scaleHeight(10),
                        paddingHorizontal:10},
                      style.centerItem,
                      isTablet() && style.mr10,
                    ]}>
                    <Icon
                      name="bank"
                      style={style.pH20}
                      size={30}
                      color={COLORS.PRIMARY}
                    />
                  <Text style={[style.font14, style.boldTxt,style.textCenter]}>Through Bank</Text>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
}
export default Outstanding;
const styles = StyleSheet.create({ 
    line: {
        borderBottomWidth: 1,
        borderColor: COLORS.GREEN,
        paddingVertical: normalize(15),
      },
      lineone: {
        borderBottomWidth: 1,
        borderColor: COLORS.GREEN,
      },
    boxFooter:{
        borderTopColor:COLORS.WHITE,
        borderTopWidth:1,
        paddingVertical:10,
    },
    profileImg:{
        width:normalize(isTablet()?100:50),
        height:normalize(isTablet()?80:40),
        resizeMode:'contain'
    },
    bottomBar:{
        borderColor:COLORS.GREEN,
        borderBottomWidth:1,
        paddingBottom:10
    },
    invoiceTab:{
     width:'100%',
      paddingVertical:8,
    }
})