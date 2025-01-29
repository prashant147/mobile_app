import axios from '../api/axios';   
import { GET_BOAT_LIST, MEMBERS_LIST } from './routes';




export const getBoatList = async () => {
    const response = await axios.get(GET_BOAT_LIST);
    return response.data;
  };


  export const getMemberList = async () => {
    const response = await axios.post(MEMBERS_LIST);
    return response.data;
  };


 