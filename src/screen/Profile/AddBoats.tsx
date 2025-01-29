import { useCallback, useEffect, useState,useContext } from "react";
import MembersContext from "../Members/MembersContext";
import { Image, ScrollView, Text, TouchableOpacity, View,StyleSheet } from "react-native"
import COLORS from "../../styles/theme/color";
import TextFeild from "../../components/TextFeild";
import { isTablet } from "react-native-device-info";
import style from "../../styles/style";
import Icon from "react-native-vector-icons/Feather";
import { normalize } from "../../styles/utilities/dimentions";
import { launchImageLibrary } from "react-native-image-picker";
import CheckBox from "react-native-check-box";
import { createMyBoat, getAllMembersFav, updateBoatdetails } from "../../services/api/auth";
import DateTimePickerBox from "../../components/dateTimeBox";
import { ActivityIndicator } from 'react-native-paper';
import Config from 'react-native-config';
import s3 from '../../services/aws-config';
import { useFocusEffect } from "@react-navigation/native";
import DropdownSelector from "../../components/DropdownSelector";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import RenderDropdown from "../BecomeMember/RenderDropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { checkPermissions, permissionAlert } from "../../styles/utilities/variables";
import { CometChat } from "@cometchat/chat-sdk-react-native";

const AddBoat = ({setIsAddBoat,isAddBoat,selBoat,setSelBoat,updateSuccess,setUpdateSuccess}:any) => { 
    const [isPrimary, setIsPrimary] = useState(false)
    const [isLodering, setIsLodering] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [memberList, setMemberList] = useState([]);
    const [boatNameErr,setBoatNameErr] = useState('');
    const token =  AsyncStorage.getItem('accessToken');
    useFocusEffect(
      useCallback(() => {
          loadMemberList()
      return () => {
        console.log('Screen is unfocused. Cleanup if needed.');
        // Perform cleanup or unsubscribe from any event listeners here
      };
    }, [])
  );
  const loadMemberList = async()=>{
    try {
      setIsLoader(true)
      const response = await getAllMembersFav(token);
      if(response.status === 200){
    setMemberList(response.data.map((e:any) => {
      return{label:e.firstName +" " + e.lastName, value:e.id}
    }));
    setIsLoader(false)
  }
    } catch (error) {
      setIsLoader(false)
      
    }
    
  }
  
    const selectImage = async() => {
      const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      }
      ImagePicker.openPicker({
        width: normalize(80),
        height: normalize(80),
        mediaType:'photo',
        cropping: true,
        cropperActiveWidgetColor:"#FFFFFF",
      }).then(async (image)=>{
        const selectedFile = image
        const fileContent = await fetch(selectedFile.path);
        const blob = await fileContent.blob();
        if (selectedFile) {
          const fileName = selectedFile.path.split('/').pop();
          setIsLodering(true);
          const params = {
            Bucket: Config.BUCKET_NAME,
            Key: `${Config.DIRECTORY_NAME}/boats/${fileName}`,
            Body: blob,
          };
          console.log("params",params)
          s3.upload(params, (err, data) => {
            if (err) {
              console.error("Error uploading image:", err);
              setIsLodering(false);
            } else {
              
              setSelBoat({
                ...selBoat,
                image:`${Config.DIRECTORY_URL}/${data.key}`
            })
              setIsLodering(false);
            }
          });
        }
      })

      
    };
    const onClickSaveBoat = async()=>{
      setBoatNameErr("")
      let isValid = true;
      if(!selBoat){
        setBoatNameErr('Boat name is required'); 
        isValid = false;
      }else if (!selBoat.boatName) {
        setBoatNameErr('Boat name is required'); 
        isValid = false;
      }
      if(isValid){
      setIsLodering(true)  
       if(selBoat?.id){
        const payload_data = {
          id:selBoat?.id,
          boatName: selBoat.boatName,
          image:selBoat.image,
          coOwner: selBoat.coOwner?.toString(),
          captain: selBoat.captain?.toString(), 
          homePort: selBoat.homePort,
          beam: selBoat.beam,
          mmsi: selBoat.mmsi,
          length: selBoat.length,
          draft:selBoat.draft,
          make: selBoat.make,
          colour: selBoat.colour,
          isPrimary:isPrimary,
          offShoreEmailAddress:selBoat.offShoreEmailAddress,
          facebookUrl:selBoat.facebookUrl,
          instagramUrl:selBoat.instagramUrl,
          boatWebsiteUrl:selBoat.boatWebsiteUrl
        }
        try {
          let res = await updateBoatdetails(payload_data,token);
        if(res.status === 200){
          if(isPrimary){
            try {
              let user = new CometChat.User(loggedInUser.id);
              const name = `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}${selBoat?.boatName ? ` - ${selBoat.boatName}` : ""}`;
              user.setName(name);
      
              CometChat.updateUser(user, Config.AUTH_KEY).then(
                (user) => {
                  console.log("user updated", user);
                },
                (error) => {
                  console.log("error", error);
                }
              );    
             } catch (error) {
             }
          }
          setIsLodering(false)
          setIsAddBoat(!isAddBoat)
        }
        } catch (error) {
          setIsLodering(false)
          console.error(error)
        }
        
       }else{
        const payload = {
          boatName: selBoat.boatName,
          image:selBoat.image,
          coOwner: selBoat.coOwner?String(selBoat.coOwner):null,
          captain: selBoat.captain?String(selBoat.captain):null,
          homePort: selBoat.homePort,
          beam: selBoat.beam,
          mmsi: selBoat.mmsi,
          length: selBoat.length,
          draft:selBoat.draft,
          make: selBoat.make,
          colour: selBoat.colour,
          isPrimary:isPrimary,
          offShoreEmailAddress:selBoat.offShoreEmailAddress,
          facebookUrl:selBoat.facebookUrl,
          instagramUrl:selBoat.instagramUrl,
          boatWebsiteUrl:selBoat.boatWebsiteUrl
        }
        try {
          setIsLodering(true)
          let res = await createMyBoat(payload, token);
          if(res.status === 200){ 
            if(isPrimary){
              try {
                let user = new CometChat.User(loggedInUser.id);
                const name = `${loggedInUser?.firstName || ""} ${loggedInUser?.lastName || ""}${selBoat?.boatName ? ` - ${selBoat.boatName}` : ""}`;
                user.setName(name);
        
                CometChat.updateUser(user, Config.AUTH_KEY).then(
                  (user) => {
                    console.log("user updated", user);
                  },
                  (error) => {
                    console.log("error", error);
                  }
                );    
               } catch (error) {
               }
            }
            setIsLodering(false)
          setIsAddBoat(!isAddBoat)
        }
        } catch (error) {
          setIsLodering(false)
          console.error(error)
        }
       } 
    }   
    }

    useEffect(()=>{
      if(selBoat?.id && selBoat?.isPrimary){
        setIsPrimary(selBoat?.isPrimary)
      }
    },[selBoat])
    const {loggedInUser} = useContext(MembersContext)

    const filteredloggedInuser = memberList.filter((member:any) => {
      return member.value === loggedInUser?.id;  
    });
    
    const filteredcoOwner = selBoat?.coOwner  ? memberList.filter((member:any) => {
      return member.value === selBoat.coOwner;
    }) : [];
    const filteredMemberslist = [...filteredloggedInuser,...filteredcoOwner]
    return  <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

     <Text style={[style.font20,style.boldTxt,style.primaryText,style.mB10]}>Add Boat</Text>
  
     <View>
           <TouchableOpacity onPress={selectImage} style={styles.selectImage}>
               {isLodering ?
               <View  style={styles.loaderIcon}><ActivityIndicator theme={{ colors: { primary: COLORS.WHITE } }} /></View>:
                <View style={[styles.uploadIcon]}><Icon  name="upload" size={30} color={COLORS.WHITE} /><Text style={[style.font14,style.boldTxt,style.whiteText,style.mt5]}>Add Image</Text></View>
               } 
               {
                selBoat?.image && <Image source={{ uri: selBoat?.image }} style={{width: '100%', height: '100%',borderRadius:8}}/>
               }
           </TouchableOpacity>
         <View style={style.contant}>
         <View>
                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        boatName: txt
                    })
                }} value={selBoat?.boatName} errorMsg={boatNameErr} labelName="BOAT NAME" placeholder={'Enter Boat Name'} required={true} />
                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        make: txt
                    })
                }} value={selBoat?.make} labelName="MAKE AND MODEL" placeholder={'Enter Make and Model'} />
                 {/* <DropdownSelector
                 loading={isLoader}
                inputTitle={'CO-OWNER'}
                uniqueKey="id"
                displayKey="fullName"
                items={memberList}
                isObjectSelect={false}
                onSelectedItemsChange={(item: string) => {
                    setSelBoat({
                        ...selBoat,
                        coOwner: item
                    });
                }}
                selectedItems={selBoat?.coOwner}
                placeholder="Select Co-Owner"
            /> */}
            </View>
            <View >
                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        length: txt
                    })
                }} value={selBoat?.length} labelName="LENGTH" placeholder={'Enter Length'} />
                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        homePort: txt
                    })
                }} value={selBoat?.homePort} labelName="HAILING PORT" placeholder={'Enter Hailing Port'} />
                                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        colour: txt
                    })
                }} value={selBoat?.colour} labelName="PROMINENT FEATURES" placeholder={'Add Prominent Features'} />
                <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        mmsi: txt
                    })
                }} value={selBoat?.mmsi} labelName="MMSI" placeholder={'Enter MMSI'} />
            </View>
            <TextFeild onchange={(txt: string) => {
                setSelBoat({
                    ...selBoat,
                    offShoreEmailAddress: txt
                })
            }} value={selBoat?.offShoreEmailAddress} labelName="OFFSHORE EMAIL" placeholder={'Enter Offshore Email Address'} />
            <TextFeild onchange={(txt: string) => {
                    setSelBoat({
                        ...selBoat,
                        draft: txt
                    })
                }} value={selBoat?.draft} labelName="DRAFT" placeholder={'Enter Draft'} />                
                <TextFeild onchange={(txt: string) => {

                    setSelBoat({
                        ...selBoat,
                        beam: txt
                    })
                }} value={selBoat?.beam} labelName="BEAM" placeholder={'Enter Beam'} />
            <RenderDropdown
            name={'CO-OWNER'}
            placeholder={'Select Co-Owner'}
            data={memberList}
            value={selBoat?.coOwner || ''}
            onChange={(item)=>{
              setSelBoat({
                ...selBoat,
                coOwner: item.value
            });
            }}
            search={true}
            loading={isLoader}
            />
            <RenderDropdown
            name={'CAPTAIN'}
            placeholder={'Select Captain Name'}
            data={filteredMemberslist}
            value={selBoat?.captain || ''}
            onChange={(item)=>{
              setSelBoat({
                ...selBoat,
                captain: item.value
            });
            }}
            search={false}
            />
            <TextFeild onchange={(txt: string) => {
                setSelBoat({
                    ...selBoat,
                    facebookUrl: txt
                })
            }} value={selBoat?.facebookUrl} labelName="FACEBOOK LINK" placeholder={'Add Facebook Link'} />
            <TextFeild onchange={(txt: string) => {
                setSelBoat({
                    ...selBoat,
                    boatWebsiteUrl: txt
                })
            }} value={selBoat?.boatWebsiteUrl} labelName="WEBSITE" placeholder={'Add Website'} />
            <TextFeild onchange={(txt: string) => {
                setSelBoat({
                    ...selBoat,
                    instagramUrl: txt
                })
            }} value={selBoat?.instagramUrl} labelName="INSTAGRAM LINK" placeholder={'Add Instagram Link'} />
         <View style={[style.row]}>
            <CheckBox
              style={[style.mt10]}
              isChecked={isPrimary}
              onClick={()=>setIsPrimary(!isPrimary)}
              checkBoxColor={COLORS.PRIMARY}
            />
            <Text style={[style.font16,style.mt10, { maxWidth: '90%' }]}>Primary boat</Text>
          </View>

         <View style={style.mtb10}>
             <TouchableOpacity onPress={onClickSaveBoat} style={ [style.button,style.centerItem,{backgroundColor:COLORS.PRIMARY,height:normalize(40),marginTop:10,width:"100%"}]}>
             {isLodering ?
            <ActivityIndicator theme={{ colors: { primary: 'white' } }} />
            :
            <Text style={[style.buttonTxt,style.font16,style.whiteText,]}>Save</Text>
          }
             </TouchableOpacity>
         </View>

         </View>
        
         
     </View>
     
 </KeyboardAwareScrollView>
}
export default AddBoat;

const styles = StyleSheet.create({
selectImage:{
  backgroundColor:'rgba(52, 52, 52, 0.3)',
  width:normalize(85),
  height:normalize(80), 
  justifyContent:'center',
  alignItems:'center', 
  borderRadius:8
},
uploadIcon:{
  position:"absolute",
  zIndex:10,
  flexDirection:"column",
  justifyContent:'center',
  alignItems:'center'
},
loaderIcon:{
  position: 'absolute', 
  zIndex: 10
}
})