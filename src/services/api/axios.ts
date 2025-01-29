import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { navigate } from '../../routes/NavigationRef';

let headers = {};

const axiosInstance = axios.create({

});
let alertShown = false; 
axiosInstance.interceptors.request.use(
  async function (config) {
    const accessToken = await AsyncStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    config.headers["Content-Type"] = `application/json`;
    return config;
  },
  function (error) {
    console.log("error",error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response =>
    new Promise((resolve, reject) => {
      resolve(response);
    }),

  error => {
    console.log('error.response',error.response); 
    AsyncStorage.getItem('accessToken').then(accessToken => {
      if (accessToken) {
        if (error && error.response && error.response.data && error.response.data.body) {
          if (error.response.data.body === 'User is Inactive') {

            AsyncStorage.clear();
    
            if (!alertShown) {
              alertShown = true;
              Alert.alert(
                'Your account has been expired',
                `Please activate your account through sdsa.membercliks.net`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('pressed');
                      navigate('authStack');
                      alertShown = false;
                    },
                  },
                ],
                { cancelable: false }
              );
            }
          }
        }
      }
    });
    if (!error.response) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    if (error.response.status === 400) {      
      return new Promise((resolve, reject) => {
        reject(error.response.data.message);
      });
    } else if (error.response.status === 403) {
      return new Promise((resolve, reject) => {
        reject(403);
      });
    } else {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  },
);

export default axiosInstance;
