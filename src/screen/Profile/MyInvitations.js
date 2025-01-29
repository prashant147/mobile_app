import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { getInvitations, getCrewRequest, getCrewInvitations, acceptCrewInvitation, rejectCrewInvitation } from '../../services/api/auth';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import style from '../../styles/style';
import { isTablet } from "react-native-device-info";
import COLORS from '../../styles/theme/color';
import { normalize } from '../../styles/utilities/dimentions';
import { ActivityIndicator } from 'react-native-paper';
import TabBox from '../../components/TabBox';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyInvitations = ({route,tabIndex}) => {
    const token = AsyncStorage.getItem('accessToken');
    const [invitationData, setInvitationData] = useState()
    const [invitationSentData, setInvitationSentData] = useState()
    const [loader, setLoader] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Invitations sent');
    const [updatedSuccess, setUpdateSuccess] = useState(false);
    const [isRejectSuccess, setIsRejectSuccess] = useState(false);
    let tabData = ["Invitations sent", "Invitations received"]
    const navigation = useNavigation();

    useEffect(()=>{
        if(tabIndex){
          setSelectedTab(tabIndex)
        }else{
          setSelectedTab('Invitations sent')
        }
        
          },[tabIndex])

    useEffect(() => {
        const getInvitationsSentData = async () => {
            try {
                const response = await getCrewRequest(token);
                if (response.status === 200) {
                    setInvitationSentData(response.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
        getInvitationsSentData()
    }, [])

    useEffect(() => {
        const getInvites = async () => {
            try {
                setLoader(true)
                const response = await getCrewInvitations(token)
                if (response.status === 200) {
                    if (response.data[0]?.message === "No Records Found") {
                        setInvitationData([])
                        setLoader(false)
                    } else {
                        setInvitationData(response.data)
                        setLoader(false)
                    }
                }
            } catch (error) {
                console.error(error)
                setLoader(false)
            }
        }
        getInvites();
    }, [isRejectSuccess,updatedSuccess])

    const acceptCrew = async (item) => {
        try {
            setUpdateSuccess(false)
            const response = await acceptCrewInvitation(item.id, token);
            if (response.status === 200) {
                setUpdateSuccess(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const rejectCrew = async (item) => {
        try {
            setIsRejectSuccess(false)
            const response = await rejectCrewInvitation(item.id, token);
            if (response.status === 200) {
                setIsRejectSuccess(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

   

    const renderInvitationsData = ({ item, index }) => {
        return (
            <View style={style.mb10}>
                <View style={style.mt5}>
                    <View style={[styles.line,style.row]}>
                        {item?.requestedBy?.profileUrl ?
                            <Image style={[styles.profileImg, style.mt10]} source={{ uri: item?.requestedBy?.profileUrl }} alt='img' /> :
                            <Image style={[styles.profileImg, style.mt10]} source={require("../../assets/avatarImage.png")} alt='img' />
                        }
                        <View style={[style.contentBetween]}>
                            <View style={[style.mt10]}>
                            <Text style={styles.memberSubText}>MEMBER NAME</Text>
                                <Text style={[style.font18, style.primaryText]} onPress={() => navigation.navigate("MemberDetails", {id: item?.requestedBy?.id, path: 'Profile'})}>
                                    {`${item?.requestedBy?.firstName} ${item?.requestedBy?.lastName}`.length > 30 ?
                                        `${item?.requestedBy?.firstName.substring(0, 30)}...` :
                                        `${item?.requestedBy?.firstName} ${item?.requestedBy?.lastName}`
                                    }
                                </Text>
                                <Text style={styles.memberSubText}>BOAT NAME</Text>
                                <Text style={[style.font14,{color:COLORS.PRIMARY}]}>
                                    {`${item?.requestedBy?.boatName ? item?.requestedBy?.boatName : "N/A"}`}
                                </Text>
                                
                            </View>
                        </View>
                        </View>  
                        <View>
                                <View style={[style.contentBetween,style.mt5]}>
                                {item?.status !== "ACCEPTED" && (
                                        <TouchableOpacity style={[styles.rejectBtn]} onPress={() => rejectCrew(item)}>
                                            <Text style={[style.textCenter, { color: COLORS.RED }]}>Reject</Text>
                                        </TouchableOpacity>
                                    )}
                                   <TouchableOpacity style={[style.primaryLayout, styles.button]} onPress={() => acceptCrew(item)}>
                                        <Text style={[style.whiteText, style.textCenter]}>Accept</Text>
                                    </TouchableOpacity>

                                    
                                </View>
                            </View>             
                </View>
            </View>
        )
    }

    const renderInvitationSentData = ({ item, index }) => {
        return (
            <View style={style.mb10}>
                <View style={style.mtb5}>
                    <View style={[style.contant]}>
                        <View style={[styles.line,style.contentAround]}>
                        <View style={[style.row]}>
                            {item?.requestedTo?.profileUrl ?
                                <Image style={[styles.profileImg,style.mt10]} source={{ uri: item?.requestedTo?.profileUrl }} alt='img' /> :
                                <Image style={[styles.profileImg,style.mt10]} source={require("../../assets/avatarImage.png")} alt='img' />
                            }
                            <View style={[style.contentBetween]}>
                                <View style={[style.mt10]}>
                                    <Text style={styles.memberSubText}>MEMBER NAME</Text>
                                    <Text style={[style.font16, style.primaryText]} onPress={() => navigation.navigate("MemberDetails", {id: item?.requestedTo?.id, path: 'Profile'})}>{item?.requestedTo?.firstName + " " + item?.requestedTo?.lastName}</Text>
                                    <View style={style.contentBetween}>
                                    <View>
                                    <Text style={styles.memberSubText}>BOAT NAME</Text>  
                                    <Text style={[style.font14,{color:COLORS.PRIMARY}]}>{item?.requestedTo?.boatName ? item?.requestedTo?.boatName : "N/A"}</Text>
                                    </View>
                                    </View>
                                </View>
                                
                            </View>
                            
                            </View>
                            <View style={[style.mt20]}> 
                            <Text style={[style.memberSubText,style.alignSelfEnd]}>Status</Text>
                                    {item?.status === 'INVITED' ? <Text style={[style.font14,{color: COLORS.YELLOW}]}>{item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : ''}</Text> : <Text style={[style.font14, { color: COLORS.GREEN }]}>
                                        {item?.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : ''}</Text>}
                            </View>
                        </View>
                        
                    </View>
                </View>
            </View>
        )
    }

    return (
        <ScrollView style={style.contant}>
            <View>
                <Text style={[isTablet() ? style.font24 : style.font16, style.primaryText, style.boldTxt, style.contant, style.mt10]}>Invitations</Text>
            </View>
            <TabBox data={tabData} selectedTab={selectedTab} onTab={(tab) => setSelectedTab(tab)}></TabBox>
            <View style={style.contant}>
                {selectedTab == "Invitations received" &&
                    <View>
                        {loader ?
                            <View style={[style.contant, style.row, style.centerItem,style.mt40]}>
                                <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} />
                            </View> :
                            <View>
                                {invitationData && invitationData.length > 0 ?
                                    <FlatList
                                        data={invitationData}
                                        renderItem={renderInvitationsData}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    :
                                    <View style={[style.contant, style.centerItem, style.centerBox, style.mt40]}>
                                        <Text style={[style.centerItem, style.font14, style.centerBox, style.mt40]}>No Records Found</Text>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                }
                {selectedTab == "Invitations sent" &&
                    <View>
                        {loader ?
                            <View style={[style.contant, style.row, style.centerItem,style.mt40]}>
                                <ActivityIndicator theme={{ colors: { primary: COLORS.PRIMARY } }} />
                            </View> :
                            <View>
                                {invitationSentData && invitationSentData.length > 0 ?
                                    <FlatList
                                        data={invitationSentData}
                                        renderItem={renderInvitationSentData}
                                        showsVerticalScrollIndicator={false}
                                    />
                                    :
                                    <View style={[style.contant, style.centerItem, style.centerBox, style.mt40]}>
                                        <Text style={[style.centerItem, style.font14, style.centerBox, style.mt40]}>No Records Found</Text>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                }
            </View>
        </ScrollView>
    )
}
export default MyInvitations;
const styles = StyleSheet.create({
    line: {
        borderTopWidth: 1,
        borderColor: COLORS.LINE
    },
    profileImg: {
        width: normalize(65),
        height: normalize(65),
        borderRadius: 8,
        marginRight: 10,
        resizeMode: 'contain',
        borderWidth:1,
        borderColor:COLORS.BORDERGREY
    },
    button: {
        width: "48%",
        height: normalize(30),
        justifyContent: "center",
        borderWidth: 0.2,
        borderRadius:8,
        borderColor: COLORS.PRIMARY
    },
    acceptBtn: {
        width: "100%",
        height: normalize(30),
        justifyContent: "center",
        borderWidth: 0.2,
        borderRadius:8,
        borderColor: COLORS.PRIMARY
    },
    rejectBtn: {
        width: "48%",
        height: normalize(30),
        justifyContent: "center",
        borderWidth: 0.2,
        borderRadius:8,
        backgroundColor:COLORS.WHITE,
        borderColor: COLORS.RED
    },
    memberSubText: {
        color: COLORS.GREY,
        fontSize: normalize(11),
        lineHeight: 20,
    }
})
