
import DeviceInfo from "react-native-device-info";
import axios from "./axios";
import Config from 'react-native-config';
import crashlytics from '@react-native-firebase/crashlytics';

export const tokenGenrator = async () => {
  const response = await axios.post(`${Config.SOA_BASE_URL}registration-login/login`);
  return response.data;
};

export const RegisterUser = async(requestData) => {
  const headers = {
    'User-Agent': 'mobile'
  };
    const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/register`, requestData, {headers})
    return response;
}

export const loginUser = async (requestData) => {
  const headers = {
    'User-Agent': 'mobile'
  }; 
  console.log(`${Config.SOA_BASE_URL}auth/member/login`)
    const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/login`, requestData,{headers})
    return response;
}
export const isFirstUser = async (userName) => {
    const response = await axios.get(`${Config.SOA_BASE_URL}auth/member/first-TimeUser/${userName}`)
    return response;
}

export const  LogOut= async (requestData,) => {
    const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/logout`, requestData)
    return response;
}
export const forgotPassword = async (requestData) => {
    const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/forgot-password`, requestData)
    return response;
}
export const updatePassword = async (requestData) => {
    const response = await axios.post(`${Config.SOA_BASE_URL}member/update-password`, requestData)
    return response;
}
export const ResetPassword = async (id,requestData) => {
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/reset-password?username=${id}`, requestData);
  return response;
};


export const otpVerification = async (requestData) => {
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/verify`, requestData);
  return response;
};
export const resendOtp = async (requestData) => {
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/resend-otp`, requestData);
  return response;
};
export const getMember = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-member`, requestData,{headers});
  return response;
};
export const getAllMembers = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-allMember`, requestData,{headers});
  return response;
};
export const getAllMembersFav = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-allMember-favFlag`, requestData,{headers});
  return response;
};
export const getMemberById = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-member/${id}`,{headers});
  return response;
};
export const addMembersAsFavorite = async (memberId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/add-fav/${memberId}`,{headers})
  return response;
}
export const getUpcomimgBirthdays = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-upcomingBirthdays`,{headers});
  return response;
};
export const updateMemberInfo = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/updateMember-info`, requestData,{headers})
  return response;
}

export const becomeMember = async (requestData) => {
  console.log(`${Config.SOA_BASE_URL}auth/member/membership`)
  console.log(requestData)
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/membership`,requestData);
  return response;
};
export const addLinkedProfiles = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/add-linkedProfiles`,requestData,{headers});
  return response;
};
export const getLinkedProfiles = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-linked_profiles?memberId=${id}`,{headers});
  return response;
};
export const deleteLinkedProfiles = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/remove-linkedProfile?id=${id}`,{headers});
  return response;
};
export const getAllMembersNonFav = async () => {
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-allMember`);
  return response;
};
export const advertiseCrewVacancy = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/boat/advertiseCrew-vacancy`,requestData,{headers});
  return response;
};
export const validateEmail = async (email) => {
  const response = await axios.get(`${Config.SOA_BASE_URL}auth/member/validate-email?emailAddress=${email}`);
  return response;
};
export const getAllCrewAdvertisements = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-myCrewAdvertisement`,{headers});
  return response;
}
export const getAllCaptainCrewAdvertisements = async (token) => {
  const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/get-allCrewAdvertisements`);
  return response;
}

export const validateEmailFetch = (email) => {
  return fetch(`${Config.SOA_BASE_URL}auth/member/validate-email?emailAddress=${email}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON
    })
    .then(data => {
      return data; // Return parsed JSON data
    })
    .catch(error => {
      crashlytics().log(error);
      throw error;
    });
};

export const getLatestNews = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/latestNews`,{headers});
  return response;
};
export const getLatestNewsById = async (token,id) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/news/${id}`,{headers});
  return response;
};

export const updateBoatInfo = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/boat/updateBoat-details`, requestData,{headers})
  return response;
}

export const setPrimaryBoat = async (Boatid,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/boat/set-primaryBoat/${Boatid}`,{headers})
  return response;
}
export const updateBoatdetails = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/boat/updateBoat-details`,requestData,{headers})
  return response;
}
export const getMyBoats = async (token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/getMyBoats`,{headers})
  return response;
}
export const createMyBoat = async (requestData, token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/boat/create-boat`,requestData,{headers})
  return response;
}

export const getBecomeCrewMembers = async(token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-becomeCrewMember`,{headers})
  return response
}
export const getMyRequest = async(token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-myRequest`,{headers})
  return response
}

export const getRequestMemberInfo = async(id,boatId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/request-memberInfo?becomeMemberId=${id}&boatId=${boatId}`,{headers})
  return response
}

export const getApplicationsUndo = async(requestId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/undo-crewRequest?requestId=${requestId}`,{headers})
  return response
}

export const becomeCrew = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/becomeCrew-member`,requestData,{headers});
  return response;
};
export const requestToJoin = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/request-toJoinCrew`,requestData,{headers});
  return response;
};
export const getBecomeCrewApplicants = async(token,requestData,id) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/my-becomeCrewApplications`,requestData,{headers})
  return response
};

export const getMyCrewAdvertisement = async() => {
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-myCrewAdvertisement`)
  return response
};

export const getCrewApplications = async (AdvertisementId) => {
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-crewApplications?advertiseId=${AdvertisementId}`);
  return response;
};

export const getAllMyCrewApplication = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/my-crewApplications`,{headers});
  return response;
};
export const removeCrewApplication = async (applicationId) => {
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/crewMember/remove -applicant?applicationId=${applicationId}`);
  return response;
};

export const getAllMyCrewMembersByboatId = async (boatId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-CrewMembers/${boatId}`,{headers});
  return response;
};
export const deleteAdvertisedCrew = async(id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/crewMember/delete-advertiseCrew?advertiseCrewId=${id}`,{headers});
  return response;
};
export const deleteAdvertisedBecomeCrew = async(id, token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/crewMember/delete-becomeCrew?becomeCrewId=${id}`, {headers});
  return response;
}
export const getEventsFilter = async (token,value) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}event/filter-events?value=${value}`,{headers});
  return response;
};
export const getAllEvents = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}event/get-all-events`,{headers});
  return response;
};
export const updateBecomeCrew = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/update-becomeCrew`, requestData,{headers})
  return response;
}
export const updateAdvertiseCrew = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/update-advertiseCrew`, requestData,{headers})
  return response;
}
export const deleteBoat = async(id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/boat/delete-boat?boatId=${id}`,{headers});
  return response;
};
export const getPolicies = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}privacy/policy/get-policy`,{headers});
  return response;
};
export const getSponsors = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}sponsors/get-all-policy`,{headers});
  return response;
};
export const getAllSponsors = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}sponsors/get-all-sponsors`,{headers});
  return response;
};
export const getAllAwards = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}awards/get-all-awards`,{headers});
  return response;
}
export const getAllMemberBoats = async (requestData) => {
  const response = await axios.get(`${"https://sdsatracking.com"}/members/boat_location.json`, requestData)
  return response;
}
export const getMemberBoatView = async (MSI, requestData) => {
  try {
    const response = await axios.get(`https://sdsatracking.com/sdsalink/boattracks/${MSI}.json`, {
      params: requestData,
    });
    return response;
  } catch (error) {
    crashlytics().log(error);
    throw error;
  }
};
export const getRallyLocation = async (rallyName) => {
  const response = await axios.get(`${"https://sdsatracking.com"}/${rallyName}/boat_location.json`)
  return response;
}
export const addCrewMembersByBoatId = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/add-CrewMember`,requestData,{headers});
  return response;
};
export const inviteCrewMembers = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/invite-crewMember`,requestData,{headers});
  return response;
};
export const deleteCrewMember = async(crewMemberId,boatId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/crewMember/remove-crewMember?crewMemberId=${crewMemberId}&boatId=${boatId}`,{headers});
  return response;
};
export const getAllMemberStatus = async (boatId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-MemberByStatus?boatId=${boatId}`,{headers});
  return response;
};
export const getInvitations = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-MyInvitations`,{headers});
  return response;
};
export const advertiseCrewSaveDraft = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/boat/advertiseCrew-vacancy`,requestData,{headers});
  return response;
};

//Update Api (To move boat advertisement to closed)
export const advertiseCrewCloseVacancy = async (requestData,token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/update-advertiseCrew`,requestData,{headers});
  return response;
};
export const darftCloseAdvertiseCrew = async (type="Draft",token) => {
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/get-CrewAdvertisementsByType?type=${type}`,{headers});
  return response;
};

export const deleteCloseVacancy = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/update-advertiseCrew`,{headers}, requestData);
  return response;
};

export const applicationInviteCrew = async (invId) => {
  console.warn(`${Config.SOA_BASE_URL}member/crewMember/accept-RejectCrewInvitation`)
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/invite-crewApplicant?applicationId=${invId}`)

  return response;
}

export const applicationNotInterested = async (invId,val) => {

  const response = await axios.delete(`${Config.SOA_BASE_URL}member/crewMember/remove-applicant?applicationId=${invId}`)

  return response;
}


export const getCrewRequest = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-CrewRequest`,{headers});
  return response;
};
export const getCrewInvitations = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-CrewInvitations`,{headers});
  return response;
};
export const acceptBecomeCrew = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/accept-rejectBecomeCrewMember?requestId=${id}&value=Accepted`,{headers})
  return response;
}
export const rejectBecomeCrew = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/accept-rejectBecomeCrewMember?requestId=${id}&value=Rejected`,{headers})
  return response;
}
export const acceptCrewInvitation = async (inviteId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/accept-RejectCrewInvitation?inviteId=${inviteId}&value=Accepted`,{headers})
  return response;
}
export const rejectCrewInvitation = async (inviteId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/accept-RejectCrewInvitation?inviteId=${inviteId}&value=Rejected`,{headers})
  return response;
}

export const getInviteApplicants = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-invitedApplicants`,{headers});
  return response;
};

export const acceptOrRejectInvitation = async (inviteId,token, value) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/crewMember/accept-RejectJoinRequest?applicationId=${inviteId}&value=${value}`,{headers})
  return response;
}
export const getAllForms = async (category,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}form/fetch-allForm/${category}`,{headers});
  return response;
};
export const submitForm = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}form/form-response`,requestData,{headers})
  return response;
};
export const submitRallyForm = async (id,requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}event/payment?eventParticipantId=${id}`,requestData,{headers})
  return response;
};
export const volunteerSubmitForm = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}form/volunteerSubmit-form`,requestData,{headers})
  return response;
};
export const getJointsBoat = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/get-InvitedBoats`,{headers})
  return response;
};
export const getNotificationsByMemberId = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}appnotification/get-member-notification/${id}`,{headers});
  return response;
};
export const getNotificationsByNotificationId = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}appnotification/get-notification/${id}`,{headers});
  return response;
};
export const readNotificationById = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}appnotification/set-notificationRead/${id}`,{headers});
  return response;
};
export const readAllNotificationsByMemberId = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}appnotification/set-allnotificationRead/${id}`,{headers});
  return response;
};
export const clearNotificationById= async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}appnotification/clear-notification/${id}`,{headers});
  return response;
};
export const clearAllNotificationByMemberId= async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}appnotification/clear-allnotification/${id}`,{headers});
  return response;
};
export const getUsersCustomAttributes = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}attribute/get-attributeForMember/${id}`,{headers});
  return response;
};
export const updateUsersCustomAttributes = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}attribute/update-multipleCustomAttribute`,requestData,{headers});
  return response;
};
export const getAllWebinars = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}webinar/get-allWebinar`,{headers});
  return response;
};
export const getWebinarById = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}webinar/getWebinarById?webinarId=${id}`,{headers});
  return response;
};
export const getUpcomingWebinars = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}webinar/get-upComingWebinars`,{headers});
  return response;
};
export const getPastWebinars = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}webinar/get-pastWebinars`,{headers});
  return response;
};
export const registerWebinars = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}webinar/register-toWebinar`,requestData,{headers});
  return response;
};
export const findCrewFilters = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/crewMember/fetch-byFilters`,requestData,{headers});
  return response;
};
export const findBoatFilters = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/boat/fetch-byFilters`,requestData,{headers});
  return response;
};
export const getStatsCapture = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/stats-capture`,{headers});
  return response;
};
export const getAllGroups = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/member-group/get-allGroup`,{headers});
  return response;
};
export const getUserGroups = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/get-allUserGroup`,{headers});
  return response;
};
export const getAllLoggedinUserGroups = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/messaging/groups/get-all`,{headers});
  return response;
};
export const createPost = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/messages/groupChat/addMessage`,requestData,{headers});
  return response;
};
export const getAllPost = async (limit,offset,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/messages/groupChatLimit/${limit}?isPublic=false&offset=${offset}`,{headers});
  return response;
};
export const getAllPublicPosts = async (limit,offset,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/messages/groupChatLimit/${limit}?isPublic=true&offset=${offset}`,{headers});
  return response;
};
export const getPostById = async (messageId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/message/groupChat/byId/${messageId}`,{headers});
  return response;
};
export const likePostById = async (postId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/like/post?postId=${postId}`,{headers});
  return response;
};
export const addPostComment = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/message/groupChat/add-comment`,requestData,{headers});
  return response;
};
export const deleteComment = async(id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/message/groupChat/delete-comment/${id}`,{headers});
  return response;
};
export const getPrivatePostById = async (id,limit,offset,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/message/groupChat/get-allPrivateGroup/${id}?limit=${limit}&offset=${offset}`,{headers});
  return response;
};
export const getBoatByMMSI = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  try {
    const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/getBoatDetails-byMMSI?mmsiId=${id}`,{headers});
  return response;
  } catch (error) {
    throw error
  }
};
export const connectedUsersChat = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/connected/membersChat`,{headers});
  return response;
}
export const getUserUnreadCount = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/unreadCount`,{headers});
  return response;
}
export const getCrewAdvertisementById = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/boat/getCrewAdvertisementById?advertiseId=${id}`,{headers});
  return response;
};
export const getCrewApplicationById = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}member/crewMember/get-application?applicationId=${id}`,{headers});
  return response;
};
export const getHonorsByType = async (type,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}awards/get-AllHonorBasedOnTypes/${type}`,{headers});
  return response;
};
export const getAwardByType = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}awards/get-award/${id}`,{headers});
  return response;
};
export const getAllBadges = async (token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}awards/get-AllBadges`,{headers});
  return response;
};
export const updateToken = async (memberId,token,FcmToken,requestData,os) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/update-token/${memberId}?token=${FcmToken}&deviceType=${os}`,requestData,{headers});
  return response;
};
export const deleteMember = async(id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/delete-member/${id}`,{headers});
  return response;
};
export const createFeedback = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/create-feedback`,requestData,{headers});
  return response;
};
export const deletePost = async(id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/delete/Post?postId=${id}`,{headers});
  return response;
};
export const updatePost = async (id,requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/update/post?postId=${id}`,requestData,{headers});
  return response;
};
export const createSOAGroupHandler = async (requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/member-group/create`, requestData,{headers});
  return response;
};

export const addMembersToGroup = async (groupId,requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/${groupId}/add-newMember`,requestData,{headers});
  return response;
};
export const joinToGroup = async (groupId,memberId,requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/join-group?groupId=${groupId}&memberId=${memberId}`,requestData,{headers});
  return response;
};

export const deleteGroupById = async (groupId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.delete(`${Config.SOA_BASE_URL}member/member-group/${groupId}/delete-group`,{headers});
  return response;
};
export const changeGroupUserScope = async (groupId,userId,role,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/update-member?groupId=${groupId}&memberId=${userId}&chatRole=${role}`,{headers});
  return response;
};
export const deleteMemberFromGroup = async (groupId,memberId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/${groupId}/remove-member?memberId=${memberId}`,"",{headers});
  return response;
};
export const updateGroup = async (groupId,newGroupName,groupProfileUrl,isMessageAllowed,isPrivate,isAdminOnly,requestData,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/${groupId}/update-groupNameAndProfile?newGroupName=${newGroupName}&groupProfileUrl=${groupProfileUrl}&isMessageAllowed=${isMessageAllowed}&isPrivate=${isPrivate}&isAdminOnly=${isAdminOnly}`,requestData,{headers});
  return response;
};
export const getPostNotificationsByMemberId = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.get(`${Config.SOA_BASE_URL}appnotification/get-PostNotificationCount?memberId=${id}`,{headers});
  return response;
};
export const readPostNotificationBymemberId = async (id,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}appnotification/read-postNotifications?memberId=${id}`,{headers});
  return response;
};
export const firstTimeUserSetPassword = async (id,requestData) => {
  const response = await axios.post(`${Config.SOA_BASE_URL}auth/member/first-TimeUser/setPassword?username=${id}`, requestData);
  return response;
};
export const getBoatRallyTrack = async (rallyName,boatnameMMSI,MMSI,requestData) => {
  try {
    const response = await axios.get(`https://sdsatracking.com/${rallyName}/boattracks/${boatnameMMSI}.json?${MMSI}`, {
      params: requestData,
    });
    return response;
  } catch (error) {
    crashlytics().log(error);
    throw error;
  }
};
export const leaveGroup = async (groupId,memberId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.post(`${Config.SOA_BASE_URL}member/member-group/leave-group?groupId=${groupId}&memberId=${memberId}`,"",{headers});
  return response;
};
export const transferGroupOwnership = async (groupId,memberId,token) => {
  const headers = {
    authorization: `Bearer ${token}`
  };
  const response = await axios.put(`${Config.SOA_BASE_URL}member/member-group/transfer-owner-ship?groupId=${groupId}&memberId=${memberId}`,"",{headers});
  return response;
};