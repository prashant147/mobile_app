import { View, Text, TouchableOpacity, BackHandler } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';
import { LinearProgress } from 'react-native-elements';
import style from '../styles/style';
import COLORS from '../styles/theme/color';
import { normalize } from '../styles/utilities/dimentions';
import Icon from 'react-native-vector-icons/AntDesign';
import { StyleSheet } from 'react-native';
import MembersContext from './Members/MembersContext';

const Webview = ({ route }) => {
    const {setHideChatbotMember, setHideChatbot } = useContext(MembersContext);  
    const isTablet = DeviceInfo.isTablet();
    const navigation = useNavigation();
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [loading, setLoading] = useState(true);
    const [siteName, setSiteName] = useState('');
    useFocusEffect(
        React.useCallback(() => {
            setHideChatbotMember(true)
            setHideChatbot(true)
        })
    )
    useEffect(() => {
        const backAction = () => {
            if (canGoBack) {
                webViewRef.current.goBack();
                return true;
            } else if (route?.params?.path) {
                setHideChatbotMember(false)
                setHideChatbot(false)
                navigation.navigate(route.params.path);
                return true;
            } else {
                setHideChatbotMember(false)
                setHideChatbot(false)
                navigation.navigate('Home');
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [canGoBack, navigation, route]);

    useEffect(() => {
        if (route?.params?.link) {
            const urlParts = route.params.link.split('/');
            if (urlParts.length > 2) {
                const domain = urlParts[2];
                setSiteName(domain);
            }
        }
    }, [route?.params?.link]);

    const closeHandler = () => {
        if (route?.params?.path) {
            setHideChatbotMember(true)
            setHideChatbot(true)
            if(route.params.path ==='Rallies'){
                navigation.navigate(route.params.path,{item:route.params.id});
            }else{
                navigation.navigate(route.params.path);
            };
        } else {
            setHideChatbotMember(true)
            setHideChatbot(true)
            navigation.navigate('Home');
        }
    }
    const handleGoBack = () => {
        if (canGoBack) {
            webViewRef.current.goBack();
        } else if (route?.params?.path) {
            if(route.params.path ==='Rallies'){
                navigation.navigate(route.params.path,{item:route.params.id});
            }else{
                navigation.navigate(route.params.path);
            }
        } else {
            navigation.navigate('Home');
        }
    };
    const handleGoForward = () => {
        if (canGoForward) {
            webViewRef.current.goForward();
        }
    };

    return (
        <View style={style.contant}>
            <View style={[style.row]}>
                <View style={[style.contant]}>
                    <View style={[styles.header, style.pH10, style.row, style.centerBox, style.between]}>
                        <View style={[style.row, style.centerBox]}>
                            <TouchableOpacity style={[style.row, style.centerBox, style.centerItem, { opacity: canGoBack ? 1 : 0.5 }]} disabled={!canGoBack} onPress={handleGoBack}>
                                <Icon name="arrowleft" size={25} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[style.row, style.centerBox, style.centerItem, style.mH10, { opacity: canGoForward ? 1 : 0.5 }]} disabled={!canGoForward} onPress={handleGoForward}>
                                <Icon name="arrowright" size={25} color="#fff" />
                            </TouchableOpacity>

                            <Text style={[styles.url, style.mH10]}>{siteName.length > 35 ? siteName.substring(0, 35).concat('...') : siteName}</Text>
                        </View>
                        <TouchableOpacity onPress={closeHandler}>
                            <Icon name="close" size={25} color="#fff" />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            {loading && (
                <LinearProgress color={COLORS.PRIMARY} style={[styles.loader]} />
            )}
            <View
                style={[
                    style.contant,
                    style.mtb10,
                    style.mH10,
                ]}>
                <WebView
                    ref={webViewRef}
                    source={{ uri: route?.params?.link }}
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => setLoading(false)}
                    onNavigationStateChange={(navState) => {
                        setCanGoBack(navState.canGoBack);
                        setCanGoForward(navState.canGoForward);
                    }}
                    style={{backgroundColor:'transparent'}}
                />
            </View>
        </View>
    );
};

export default Webview;
const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.PRIMARY,
        height: normalize(45),
        width: '100%'
    },
    url: {
        fontSize: 14,
        color: 'white',
        fontFamily:'Roboto-Regular',
    },
    loader: {
        height: normalize(6)
    },
    navBtns: {
        height: normalize(30),
        width: normalize(40)
    }
})