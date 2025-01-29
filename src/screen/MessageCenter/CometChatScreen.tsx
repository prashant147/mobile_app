import React, { useState,useContext, useEffect, useCallback, useRef } from "react";
import {View,Text,TouchableOpacity,StyleSheet,Modal,ScrollView, Dimensions, KeyboardAvoidingView, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {addMembersToGroup, createSOAGroupHandler, joinToGroup, transferGroupOwnership, updateGroup } from "../../services/api/auth";
import style from "../../styles/style";
import Menu from "../../routes/Menu";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MembersContext from "../Members/MembersContext";
import {
  CometChatGroups,
  CometChatTheme,
  CometChatContextProvider,
  GroupsStyleInterface,
  CometChatUIKit,
  CometChatThreadedMessages,
} from "@cometchat/chat-uikit-react-native";
import { normalize, scaleHeight } from "../../styles/utilities/dimentions";
import { checkPermissions, permissionAlert, sliceString } from "../../styles/utilities/variables";
import COLORS from "../../styles/theme/color";
import s3 from "../../services/aws-config";
import Config from "react-native-config";
import ImagePicker from "react-native-image-crop-picker";
import ImageCompressor from "react-native-compressor";
import { MessageListConfigurationInterface } from "@cometchat/chat-uikit-react-native/src/CometChatMessageList";
import axios from "axios";
import ScopeModal from "./ScopeModal";
import GroupMemberActionModal from "./GroupMemberActionModal";
import MembersListModal from "./MembersListModal";
import CreateGroupModal from "./CreateGroupModal";
import LeaveOrDeleteGroupModal from "./LeaveOrDeleteGroupModal";
import { getCometPushNotificationPreferences, getLoggedInUserUnreadCount } from "../../services/CometUtils";
import AddMembersListModal from "./AddMembersListModal";
import CometchatConversationsComponents from "./Components/CometchatConversationsComponents";
import MessagesMembersListComponent from "./Components/MessagesMembersListComponent";
import { customDateSeparatorPattern, EmptyGroupsStateView, EmptyStateView, fetchAndStorePreferences, generateMessageDateString, GetLoadingStateView, getStoredPreferences } from "./Components/CometVariables";
import GroupListItemComponent from "./Components/RenderItems/GroupListItemComponent";
import CustomHeaderComponent from "./Components/CustomHeaderComponent";
import ChatDetailsComponent from "./Components/ChatDetailsComponent";
import CustomBubbleView from "./Components/CustomBubbleView";
import RenderSeletedUsersComponent from "./Components/RenderItems/RenderSeletedUsersComponent";
import RenderAddMembersComponents from "./Components/RenderItems/RenderAddMembersComponents";
import RenderGroupInfoUsersComponent from "./Components/RenderItems/RenderGroupInfoUsersComponent";
import RenderGroupUsersTansferComponent from "./Components/RenderItems/RenderGroupUsersTansferComponent";
import GroupDetailsComponent from "./Components/GroupDetailsComponent";
import CustomProfileViewComponent from "./Components/CustomProfileViewComponent";

const CometChatScreen = () => {
  const {setHideChatbotMember,setHideChatbot,setSelectedMenu,loggedInUser,chatMessage,setChatMessage,ChatData,setChatData,accessToken,setMsgUnreadCount,setMsgUnreadCountUpdate,} = useContext(MembersContext);
  const hasFetched = useRef(false);
  const hasFetchedCometMembers = useRef(false);
  const hasFetchedLoggedInUserId = useRef(false);
  const loggedInUserID = useRef('');
  const [membersList, setMembersList] = useState([]);
  const [selectedMember, setSelectedMember] = useState<CometChat.User>(null);
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group>(null);
  const [message, setMessage] = React.useState<CometChat.TextMessage | undefined>(undefined);
  const [selectedGroupIsAdminOnly, setSelectedGroupIsAdminOnly] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [selectedGroupInfo, setSelectedGroupInfo] = useState(null);
  const [selectedGroupInfoShow, setSelectedGroupInfoShow] = useState(false);
  const [selectedGroupInfoModal, setSelectedGroupInfoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Chats");
  const [showList, setShowList] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [updateGroupModal, setUpdateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameErr, setGroupNameErr] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupDescError, setGroupDescError] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [addMemberModalSearch, setAddMemberModalSearch] = useState("");
  const [groupMemberSearch, setGroupMemberSearch] = useState("");
  const [cometUsers, setCometUsers] = useState<any>([]);
  const [addMembersGroupList, setaddMembersGroupList] = useState<any>([]);
  const [createGroupLoader, setCreateGroupLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImagePreView, setSelectedImagePreview] = useState("");
  const [selectedImageErr, setSelectedImageErr] = useState("");
  const [isImageLoding, setIsImageLoding] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [publicGroup, setPublicGroup] = useState(false);
  const [publicGroupNameDetails, setPublicGroupDetails] = useState(null);
  const [publicGroupDesShow, setPublicGroupDesShow] = useState(false);
  const [userLoaderId, setUserLoaderId] = useState('');
  const [addMember, setAddmember] = useState(false);
  const [userRoleInGroup , setUserRoleInGroup ] = useState('');
  const [showScopeModal , setShowScopeModal ] = useState(false);
  const [showActionModal , setShowActionModal ] = useState(false);
  const [showActionOn , setShowActionOn] = useState(null);
  const [showActionType , setShowActionType] = useState('');
  const [userScope , setUserScope ] = useState(null);
  const [showScopeDropDown , setShowScopeDropDown] = useState(false);
  const [leaveOrDeleteModal , setLeaveOrDeleteModal] = useState(false);
  const [leaveOrDeleteType , setLeaveOrDeleteType] = useState('');
  const [transferOwnerShipModal , setTransferOwnerShipModal] = useState(false);
  const [transferOwnerShipSearch , setTransferOwnerShipSearch] = useState('');
  const [selectedMemberShow , setSelectedMemberShow] = useState(false);
  const [addMemberLoader , setAddMemberLoader] = useState(false);
  const [adminOnly , setAdminOnly] = useState(false);
  const [muteToggleGrp , setMuteToggleGrp] = useState(false);
  const [muteToggleUser , setMuteToggleUser] = useState(false);

  const tabData = ["Chats", "Users", "Groups"];

  let myTheme: CometChatTheme = new CometChatTheme({});
  myTheme.palette.setPrimary({
    light: "#6851d6",
    dark: "#6851d6",
  });
  console.log('re rendered cometChatScreen');
  

  useEffect(()=>{ 
    if(chatMessage){
      const { receiverType, receiver, sender } = JSON.parse(chatMessage.message);
      const conversationWith = receiverType === 'group' ? { guid: receiver } : { uid: sender };
      const payload = { conversationType: receiverType, conversationWith };
      setChatLoading(true)
      handleConversationPress(payload);
    }

    if (ChatData && ChatData.id && ChatData.type) {
      const payload = {
        conversationType: ChatData.type,
        conversationWith: ChatData.type === 'group' ? { guid: ChatData.id } : { uid: ChatData.id }
      };
      setChatLoading(true)
      handleConversationPress(payload);
    }if(ChatData && ChatData.member && ChatData.type === 'user'){
      setChatLoading(true)
      startConversationHandler(ChatData.member)
    }
  },[chatMessage,ChatData])



  const fetchCometMembersHandler = useCallback(async (page = 1) => {
    if (hasFetchedCometMembers.current) return; // Prevent multiple calls
  
    const headers = {
      'apikey': Config.REST_API_KEY
    };
  
    try {
      const response = await axios.get(`https://${Config.APP_ID}.api-us.cometchat.io/v3/users`, {
        headers,
        params: {
          searchIn: '',
          perPage: 1000,
          page: page,
        }
      });
  
      const fetchedUsers = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
  
      setCometUsers(prevUsers => {
        const existingUids = new Set(prevUsers.map(user => user.uid));
        const uniqueUsers = fetchedUsers.filter(user => !existingUids.has(user.uid));
        return [...prevUsers, ...uniqueUsers];
      });
  
      setaddMembersGroupList(prevList => {
        const existingUids = new Set(prevList.map(user => user.uid));
        const uniqueUsers = fetchedUsers.filter(user => !existingUids.has(user.uid));
        return [...prevList, ...uniqueUsers];
      });
  
      // If we have fetched all users, mark as fetched
      if (fetchedUsers.length < 1000) {
        hasFetchedCometMembers.current = true;
      } else {
        await fetchCometMembersHandler(page + 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);
  
  
  const fetchUserIDHandler = useCallback(async ()=>{
    if (hasFetchedLoggedInUserId.current) return; 
    const getUserId = await AsyncStorage.getItem('userId');
    if (getUserId){
      loggedInUserID.current = getUserId;
      hasFetchedLoggedInUserId.current = true
    }
  },[])
  useEffect(() => {
      fetchUserIDHandler()
      fetchCometMembersHandler()
      setHideChatbotMember(true);
      setHideChatbot(true);
      setShowList(false);
      setSelectedMenu(5);
      setSelectedMember(null);
      setSelectedGroup(null);
      setMessage(null) 
      setSelectedGroupInfoModal(false)
      setTransferOwnerShipModal(false)
    }, [])


  const groupsStyle: GroupsStyleInterface = {
    backgroundColor: "#f3f3f3",
  };

  const getListItemViewGrp = (group: CometChat.Group) => {
    return <GroupListItemComponent group={group} onPress={handleGroupPress} />;
  };
  const getMessOption = (loggedInUser, messageObject, theme, group) => {
    let defaultOption = CometChatUIKit.getDataSource().getTextMessageOptions(
      loggedInUser,
      messageObject,
      theme,
      group
    );
    const sendMessagePrivatelyOption = defaultOption.find(option => option.id === "sendMessagePrivately");
    if (sendMessagePrivatelyOption) {
      sendMessagePrivatelyOption.onPress = () => {
        setSelectedGroup(null)
        CometChat.getUser(messageObject.sender.uid).then(
          (user) => {
            setSelectedMember(user);
            setChatMessage(null)
            setSelectedGroup(null);
            setMessage(null) // hide the thread messages
            setSelectedGroupMembers([]) 
            setSelectedGroupIsAdminOnly(false) 
            setSelectedMemberShow(false) // hide member details
            setSelectedGroupInfo(null) // hide group details 
            setAddMemberModal(false) // hide add member modal
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );

      };
    }
  
    return defaultOption;
  };
  const getTemplates = () => {
    const defaultTemplates = CometChatUIKit.getDataSource().getAllMessageTemplates(
        new CometChatTheme({})
    );
    defaultTemplates.forEach((template) => {
        template.options = (
            loggedInUser: User,
            messageObject: BaseMessage,
            theme: CometChatTheme,
            group?: Group | undefined
        ) => getMessOption(loggedInUser, messageObject, theme, group);
    });
    return defaultTemplates;
  };

  const tabSwicthHandler =(e)=>{
    setSelectedTab(e);
  }
  const uploadImageHandler = async () => {
    const hasPermissions = await checkPermissions();
      if (!hasPermissions) {
        permissionAlert()
        return; 
      }
    setIsImageLoding(true);
    ImagePicker.openPicker({
      mediaType: "photo",
      cropping: false,
      cropperActiveWidgetColor: "#FFFFFF",
    }).then(async (image) => {
      const result = await ImageCompressor.Image.compress(image.path, {
        quality: 0.8,
      });
      setIsImageLoding(true);
      const fileContent = await fetch(result);
      const blob = await fileContent.blob();
      const reader = new FileReader();
      const blobUriPromise = new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
      
      const blobUri = await blobUriPromise;
      setSelectedImagePreview(blobUri)
      if (result) {
        const fileName = result.split("/").pop();
        setIsImageLoding(true);
        const params = {
          Bucket: Config.BUCKET_NAME,
          Key: `${Config.DIRECTORY_NAME}/${loggedInUser.id}/${fileName}`,
          Body: blob,
        };
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading image:", err);
            setIsImageLoding(false);
          } else {
            setSelectedImage(`${Config.DIRECTORY_URL}/${data.key}`);
            setSelectedImageErr('')
            setIsImageLoding(false);
          }
        });
      }
    }).catch(error =>{
      setIsImageLoding(false)
    });
  };
  const createGroupHandler = async () => {
    setGroupNameErr('')
    setSelectedImageErr('')
    setGroupDescError('')
    let isValid = true
    if (groupName === "") {
      setGroupNameErr('Group name is required')
      isValid = false
    
    }
    if (groupDesc === "") {
      setGroupDescError('Group description is required')
      isValid = false
    
    }
   
    const payload = {
      groupName: groupName,
      description: groupDesc,
      addMemberToGroup: {
        admins: [],
        moderators: [],
        participants: selectedItems,
      },
      groupProfileUrl: selectedImage === ''? 'https://dev-admin.qennect.com/media/37bb8a66-9af2-47aa-8f10-e934f37e4752/groupImage.jpg' : encodeURI(selectedImage),
      isMessageAllowed: true,
      isPrivate: true,
      isAdminOnly: adminOnly,
    };

   if(isValid){ setCreateGroupLoader(true);
    let response = null
    try {
       response = await createSOAGroupHandler(payload,accessToken);
      console.log("Local Group created successfully:", response);
      if(response.status === 200){
        setCreateGroupLoader(false);
        setCreateGroupModal(false);
        setGroupDesc("");
        setSelectedImage("");
        setSelectedImagePreview('');
        setGroupName("");
        setSelectedItems([]);
        setAddMemberModal(false);
        setAdminOnly(false)
        CometChat.getGroup(response?.data.id).then(
          (group) => {
            setSelectedGroup(group);
            setSelectedMember(null);
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );
      }
    } catch (error) {
       console.error("Error creatong Local Group:", error,payload);
        setCreateGroupLoader(false);
        setGroupDesc("");
        setGroupName("");
        setSelectedItems([]);
        setAddMemberModal(false);
     }
     
   }
  };
  const updateGroupHandler = async () => {
    setGroupNameErr('')
    setSelectedImageErr('')
    setGroupDescError('')
    let isValid = true
    if (groupName === "") {
      setGroupNameErr('Group name is required')
      isValid = false
    
    }
    if (groupDesc === "") {
      setGroupDescError('Group description is required')
      isValid = false
    
    }
   
    const payload = {
      description:groupDesc
  }
  let groupImage = selectedImage === ''? 'https://dev-admin.qennect.com/media/37bb8a66-9af2-47aa-8f10-e934f37e4752/groupImage.jpg' :encodeURI(selectedImage)

   if(isValid){ setCreateGroupLoader(true);
    let response = null
    try {
       response = await updateGroup(selectedGroup?.getGuid(),groupName,groupImage,true,true,adminOnly,payload,accessToken);
      console.log("Local Group updated successfully:", response);
      if(response.status === 200){
        const GUID = `${selectedGroup?.getGuid()}`;
        setCreateGroupLoader(false);
        setCreateGroupModal(false);
        setGroupDesc("");
        setSelectedImage("");
        setSelectedImagePreview('');
        setGroupName("");
        setSelectedItems([]);
        setAdminOnly(false)
        CometChat.getGroup(GUID).then(
          (group) => {
            setSelectedGroup(group);
            setSelectedMember(null);
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );
    setUpdateGroupModal(false)
      }
    } catch (error) {
       console.log("Error updating Local Group:", error,payload);
       setCreateGroupLoader(false);
       setCreateGroupLoader(false);
       setGroupDesc("");
       setGroupName("");
       setSelectedItems([]);
     }
  }
  };
  const editGroupHandler =()=>{
    setUpdateGroupModal(true)
    const metaData = selectedGroup.getMetadata()
    if(metaData){
      console.log('',metaData, metaData && metaData.tags && metaData?.tags[0] === 'ADMIN_ONLY');
      setAdminOnly(metaData && metaData.tags && metaData?.tags[0] === 'ADMIN_ONLY')
      
    }
    setGroupName(selectedGroup?.getName())
    setGroupDesc(selectedGroup?.getDescription())
    if(selectedGroup?.getIcon()){
      setSelectedImage(selectedGroup?.getIcon())
      if(selectedGroup?.getIcon() === 'https://dev-admin.qennect.com/media/37bb8a66-9af2-47aa-8f10-e934f37e4752/groupImage.jpg'){
        setSelectedImagePreview('')
      }else{
        setSelectedImagePreview(selectedGroup?.getIcon())
      }
    }
  }
  const cancelGroupCreateHandler =()=>{
    setSelectedGroupInfoShow(true)
    setCreateGroupModal(false);
    setUpdateGroupModal(false)
    setGroupName('');
    setGroupNameErr('');
    setGroupDescError('')
    setSelectedImage('');
    setSelectedImagePreview('');
    setSelectedImageErr('');
    setGroupDesc('');
    setSelectedItems([])
    setAddMemberModal(false)
    setAddMemberModalSearch('')
  }
  const onBackHandler = ()=>{
    setSelectedMember(null);
    setSelectedGroup(null);
    setSelectedTab("Chats");
    setSelectedMemberShow(false)
    setSelectedGroupInfo(null)
    setSelectedGroupInfoShow(false)
    getLoggedInUserUnreadCount(setMsgUnreadCount,setMsgUnreadCountUpdate)
    setSelectedGroupInfoModal(false)
    setMessage(null)
    setTransferOwnerShipModal(false)
    setAddMemberModal(false)
    setMuteToggleGrp(false)
    setMuteToggleUser(false)
  }
  const handleConversationPress = useCallback(async (uid) => {
    try {
      setMessage(null);
      setSelectedGroupMembers([]);
      setSelectedGroupIsAdminOnly(false);
      setSelectedMemberShow(false);
      setSelectedGroupInfo(null);
      setAddMemberModal(false);
     
  
      // Fetch preferences from local storage
    let userPreferences = await getStoredPreferences();
    
    if (!userPreferences) {
      console.log("Fetching preferences from API...");
      userPreferences = await fetchAndStorePreferences(); // Fetch from API if local storage is empty
    }
    
      const mutedGuids = userPreferences?.mutedGuids || {};
      const mutedUids = userPreferences?.mutedUids || {};
    
      if (uid.conversationType === "group") {  
        try {
          const group = await CometChat.getGroup(uid.conversationWith.guid);
          if (group) {
            const metaData = group?.getMetadata();
            if (metaData?.tags?.includes("ADMIN_ONLY")) {
              try {
                const response = await axios.get(
                  `https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${uid.conversationWith.guid}/members?perPage=1000&page=1&scope=admin`,
                  { headers: { apikey: Config.REST_API_KEY } }
                );
                if (response.status === 200) {
                  setSelectedGroupMembers(response.data.data.map(item => item.uid));
                  setSelectedGroupIsAdminOnly(true);
                }
              } catch (error) {
                console.error("Group members fetch error:", error);
              }
            }
  
            setSelectedTab("Chats");
            setSelectedGroup(group);
            setUserRoleInGroup(group.getScope());
            setMuteToggleGrp(mutedGuids.hasOwnProperty(group.getGuid()));
            setSelectedMember(null);
            if (uid?.unreadMessageCount > 0) { 
              try {
                await axios.post(
                  `https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${uid.conversationWith.guid}/conversation/read`,
                  null,
                  { headers: { apikey: Config.REST_API_KEY, onBehalfOf: loggedInUserID.current } }
                );
              } catch (error) {
                console.error("Unread API error:", error);
              }
            }
          }
        } catch (error) {
          console.error("Group fetch error:", error);
        }
      } else {
        try {
          const user = await CometChat.getUser(uid.conversationWith.uid);
          if (user) {
            setSelectedMember(user);
            setSelectedGroup(null);
            setMuteToggleUser(mutedUids.hasOwnProperty(user.getUid()));
          }
        } catch (error) {
          console.error("User fetch error:", error);
        }
      }
    } catch (error) {
      console.error("General error in handleConversationPress:", error);
    } finally {
      setChatMessage(null);
      setChatData(null);
    }
  },[]);
  
  
  const handleGroupPress = async (uid) => {
    setPublicGroupDesShow(false)
    if (uid.type === "public") {
    const userId = await CometChat.getLoggedinUser();

    const groupMembersRequest = new CometChat.GroupMembersRequestBuilder(uid.guid)
      .setLimit(100)
      .setSearchKeyword(userId?.getUid())
      .build();

    groupMembersRequest.fetchNext().then(
      (groupMembers) => {
        const isMember = groupMembers.some(member => member.uid === userId?.getUid());
        if (isMember) {
          CometChat.getGroup(uid.guid).then(
          async (group) => {
              const metaData = group?.getMetadata()
              if (metaData && metaData?.tags[0] === 'ADMIN_ONLY') {
              try {
                const headers = {
                  'apikey': Config.REST_API_KEY
                };
                
                const response = await axios.get(`https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${uid.guid}/members?perPage=1000&page=1&scope=admin`,{headers})
                if(response.status === 200){
                  const filterAdmins = response.data.data.map(item => item.uid)
                  setSelectedGroupMembers(filterAdmins)
                  setSelectedGroupIsAdminOnly(true)
                  console.log("Group Member list fetched successfully:",filterAdmins);
                }
                
              } catch (error) {
                console.log("Group Member list fetching failed with exception:",error);
              }
            }
              setPublicGroup(false);
              setSelectedTab("Chats");
              setSelectedGroup(group);
              setSelectedMember(null);
            },
            (error) => {
              console.error("Fetching group failed with error:", error);
            }
          );
        } else {
          setPublicGroup(true)
          setPublicGroupDetails(uid)
        }
      },
      (error) => {
        console.error("Fetching group members failed with error:", error);
        setPublicGroup(true)
        setPublicGroupDetails(uid)
      }
    );

    } else {
      CometChat.getGroup(uid.guid).then(
        (group) => {
          const metaData = group?.getMetadata()
          if (metaData && metaData?.tags[0] === 'ADMIN_ONLY') {
            let limit = 100;
            let groupMemberRequest = new CometChat.GroupMembersRequestBuilder(
              uid.guid
            )
              .setLimit(limit)
              .build();

            groupMemberRequest.fetchNext().then(
              (groupMembers) => {
                const filterAdmins = groupMembers.filter(item => item?.scope ==='admin').map(item => item.getUid())
                setSelectedGroupMembers(filterAdmins)
                setSelectedGroupIsAdminOnly(true)
                console.log(
                  "Group Member list fetched successfully:",
                  filterAdmins
                );
              },
              (error) => {
                console.log(
                  "Group Member list fetching failed with exception:",
                  error
                );
              }
            );
          }
          setSelectedTab("Chats");
          setSelectedGroup(group);
          setSelectedMember(null);
        },
        (error) => {
          console.error("User fetching failed with error:", error);
        }
      );
    }
  };
  const startConversationHandler = (member) => {
    setShowList(false);
    if (member.type === "group") {
      setAddMemberModal(true);
    } else {
      setUserLoaderId(member.id)
      CometChat.getUser(member.id).then(
        (user) => {
          setSelectedMember(user);
      setUserLoaderId('')
          setSelectedGroup(null);
        },
        (error) => {
          console.error("member", member);
          const payload = {
            uid: member.id,
            name: member.firstName + member.lastName,
            ...(member.profileUrl && { avatar: encodeURI(member.profileUrl) }),
            metadata: {
              "@private": {
                email: member.username,
              },
            },
          };

          CometChat.createUser(payload, Config.AUTH_KEY).then(
            (user) => {
              console.log("User created successfully:", { user });
              CometChat.getUser(user.uid).then(
                (user) => {
                  setSelectedMember(user);
                  setUserLoaderId('')
                  
                  setSelectedGroup(null);
                },
                (error) => {
                  setUserLoaderId('')
                }
              );
            },
            (error) => {
              setUserLoaderId('')
              
              console.error("User creation failed with error:", { error });
            }
          );
        }
      );
    setChatData(null)
    setChatLoading(false)
    }
  };
  const changeUserScopeHandler =(item)=>{
    setShowScopeModal(true)
    setUserScope(item)
  }
  const actionHandler =(item,actionType)=>{
    setShowActionType(actionType)
    setShowActionOn(item)
    setShowActionModal(true)

  }
  const transferOwnerShipHandler = async (item) => {
    try {
      const response = await transferGroupOwnership(selectedGroup?.getGuid(),item.uid,accessToken);
      if (response.status === 200) {
        CometChat.transferGroupOwnership(selectedGroup?.guid, item.uid).then(
          () => {
            console.log("Successfully transferred ownership of the group.");
          },
          (error) => {
            console.log("Could not transfer ownership of the group: ", error);
          }
        );
        groupDetailsHandler(selectedGroup, "transfer");
      }
    } catch (error) {
      console.error("transfer Owner error", error);
    }
  };
  const handleSelectMembers = (item) => {
    const isChecked = selectedItems.some((m) => m === item.uid);
    if (isChecked) {
      setSelectedItems((prevMentors) =>
        prevMentors.filter((m) => m !== item.uid && m !== "public")
      );
    } else {
      setSelectedItems((prev) => {
        const updatedItems = prev;
        return [...updatedItems, item.uid];
      });
    }
  };
  const userDetailsHandler =()=>{
    setSelectedMemberShow(true)
  }
  const groupDetailsHandler =async(group,type)=>{
  const headers = {
    'apikey': Config.REST_API_KEY
  };
  try {
    const response = await axios.get(`https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${group.guid}/members?perPage=1000&page=1`,{headers})
    setSelectedGroupInfo(response.data.data)
    setSelectedGroupInfoShow(true)
  if(type === 'show'){
    setSelectedGroupInfoShow(false)
    setSelectedGroupInfoModal(true)
    setShowScopeDropDown(true)
  }
    CometChat.getGroup(group.guid).then(
      (item) => {
        setSelectedGroup(item);
        setUserRoleInGroup(item.getScope())
        setSelectedMember(null);
      },
      (error) => {
        console.error("User fetching failed with error:", error);
      }
    );
    
    setSelectedTab('Chats')
    if( type ==='transfer'){
      setLeaveOrDeleteModal(false)
      setTransferOwnerShipModal(false)
    }
  } catch (error) {
    console.log('error groupDetails',error);  
  }
  }
  const addMemberModalHandler = () => {
    setAddMemberLoader(false)
    const existingUsers = selectedGroupInfo.map(item => item.uid);
    const filteredExisting = cometUsers.filter(item => !existingUsers.includes(item.uid));
    setaddMembersGroupList(filteredExisting);
    setAddMemberModal(true);
    setAddmember(true);
    setSelectedGroupInfoShow(false)
  };
  const addMemberHandler = async()=>{
    if(addMember){
      setAddMemberLoader(true)
  const payload = {
    admins: [],
  moderators: [],
    participants:selectedItems 
  }  
try {  
  const response = await addMembersToGroup(selectedGroup?.getGuid(),payload,accessToken)
  if(response.status === 200){ 
  setSelectedGroupInfoShow(true)
  setSelectedItems([])
  setAddMemberModal(false)
  setAddMemberModalSearch('')
  CometChat.getGroup(selectedGroup?.getGuid()).then(
    (item) => {
      
      setSelectedGroup(item);
      setSelectedGroupInfo(null)
      setSelectedGroupInfoShow(false)
      setUserRoleInGroup(item.getScope())
      setSelectedMember(null);
      setAddMemberLoader(false)
    },
    (error) => {
      setAddMemberLoader(false)
      console.error("User fetching failed with error:", error);
    }
  );
}
} catch (error) {
  console.error('error',error);
  setAddMemberLoader(false)
  
}
    }else{
      setAddMemberModal(false)
      setCreateGroupModal(true);
      setAddMemberModalSearch('')
    }
  
  }
  const joinGroupHandler = async () => {
    const password = "";
    const groupTypes = CometChat.GROUP_TYPE.PUBLIC;
    const payload = {
      participants:[loggedInUser.id] 
    }  
   try {
    const response = await joinToGroup(publicGroupNameDetails.guid,loggedInUser.id,{},accessToken)
    if (response.status === 200){
      console.log('join group success',response.data);
      
    }
   } catch (error) {
    console.error('join group error',error);
    
   }
    CometChat.joinGroup(publicGroupNameDetails.guid, groupTypes, password).then(
      (group) => {
        console.log("Group joined successfully:", group);
        CometChat.getGroup(publicGroupNameDetails.guid).then(
          (group) => {
            const metaData = group?.getMetadata();
            if (metaData && metaData?.tags[0] === "ADMIN_ONLY") {
              let limit = 100;
              let groupMemberRequest = new CometChat.GroupMembersRequestBuilder(
                publicGroupNameDetails.guid
              )
                .setLimit(limit)
                .build();
  
              groupMemberRequest.fetchNext().then(
                (groupMembers) => {
                  const filterAdmins = groupMembers
                    .filter((item) => item?.scope === "admin")
                    .map((item) => item.getUid());
                  setSelectedGroupMembers(filterAdmins);
                  setSelectedGroupIsAdminOnly(true);
                  console.log(
                    "Group Member list fetched successfully:",
                    filterAdmins
                  );
                },
                (error) => {
                  console.log(
                    "Group Member list fetching failed with exception:",
                    error
                  );
                }
              );
            }
            setPublicGroup(false);
            setSelectedTab("Chats");
            setSelectedGroup(group);
            setSelectedMember(null);
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );
      },
      (error) => {
        console.error("Group joining failed with exception:", error);
        CometChat.getGroup(publicGroupNameDetails.guid).then(
          (group) => {
            setPublicGroup(false);
            setSelectedTab("Chats");
            setSelectedGroup(group);
            setSelectedMember(null);
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );
      }
    );
  };
  const bannedMembersHandler = async () => {
    const headers = {
      'apikey': Config.REST_API_KEY
    };
  
    try {
      const response = await axios.get(`https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${selectedGroup?.getGuid()}/bannedusers`, {headers});
  
      const bannedUsers = response.data.data;
      setSelectedGroupInfo(bannedUsers);
      setShowScopeDropDown(false)
      setSelectedGroupInfoShow(false)
      setSelectedGroupInfoModal(true);
    
    } catch (error) {
      console.error('Error fetching banned users:', error);
    }
  };
  const leaveOrDeleteGroupHandler = async(type)=>{
    setLeaveOrDeleteModal(true)
    setLeaveOrDeleteType(type)
    if(selectedGroup.getOwner() === loggedInUser.id){
      const headers = {
        'apikey': Config.REST_API_KEY
      };
      try {
        const response = await axios.get(`https://${Config.APP_ID}.api-us.cometchat.io/v3/groups/${selectedGroup.getGuid()}/members?perPage=1000&page=1`,{headers})
        setSelectedGroupInfo(response.data.data)
    
     
        CometChat.getGroup(selectedGroup.getGuid()).then(
          (item) => {
            setSelectedGroup(item);
            setUserRoleInGroup(item.getScope())
            setSelectedMember(null);
          },
          (error) => {
            console.error("User fetching failed with error:", error);
          }
        );
      } catch (error) {
        console.error('error groupDetails',error);  
      }
    }
   
  }

  const renderSelectedUsers = ({ item ,index}) => {
   return <RenderSeletedUsersComponent item={item} handleSelectMembers={handleSelectMembers} index={index} selectedItems={selectedItems} />
  };

  const renderAddMembers = ({ item }) => (
    <RenderAddMembersComponents handleSelectMembers={handleSelectMembers} item={item} selectedItems={selectedItems}/>
  );
  const renderGroupInfoUsers = ({ item }) => {
    return <RenderGroupInfoUsersComponent 
    actionHandler={actionHandler} 
    changeUserScopeHandler={changeUserScopeHandler}
    item={item}
    loggedInUser={loggedInUser}
    loggedInUserID={loggedInUserID.current}
    selectedGroup={selectedGroup}
    showScopeDropDown={showScopeDropDown}
    userRoleInGroup={userRoleInGroup}
    />
  };
  const renderGroupUsersTransferOwnership = ({ item }) => { 
    return (
    <RenderGroupUsersTansferComponent 
    item={item}
    loggedInUser={loggedInUser}
    transferOwnerShipHandler={transferOwnerShipHandler}

    />
    );
  };
  const closeGroupDetailsHandler = ()=>{
    setSelectedGroupInfo(null);
    setSelectedGroupInfoShow(false)
  }
  const CustomHeaderView = ({user,group,}: {user?: CometChat.User | undefined;group?: CometChat.Group | undefined;}) => {
  return <CustomHeaderComponent group={group} groupDetailsHandler={groupDetailsHandler} onBackHandler={onBackHandler} user={user} userDetailsHandler={userDetailsHandler}/>
  };
  const GroupDetails = () => {
    return (
    <GroupDetailsComponent 
    addMemberModalHandler={addMemberModalHandler}
    bannedMembersHandler={bannedMembersHandler}
    closeGroupDetailsHandler={closeGroupDetailsHandler}
    editGroupHandler={editGroupHandler}
    groupDetailsHandler={groupDetailsHandler}
    leaveOrDeleteGroupHandler={leaveOrDeleteGroupHandler}
    loggedInUser={loggedInUser}
    muteToggleGrp={muteToggleGrp}
    selectedGroup={selectedGroup}
    setMuteToggleGrp={setMuteToggleGrp}
    userRoleInGroup={userRoleInGroup}
    
    />
    );
  };

  const onThreadRepliesPressHandler = (messageObject: CometChat.BaseMessage) => {
    CometChat.getMessageDetails(messageObject.getId()).then((message: any) => {
      setMessage(message);
    })
  }

  const GetCustomProfileView = () => {
    return (
  <CustomProfileViewComponent
  muteToggleUser={muteToggleUser}
  selectedMember={selectedMember}
  setMuteToggleUser={setMuteToggleUser}
  setSelectedMember={setSelectedMember}
  setSelectedMemberShow={setSelectedMemberShow}
  />
    );
  };
  let categories = ["message", "custom","interactive"];
  const messageListConfiguration: MessageListConfigurationInterface = {
      messageRequestBuilder: new CometChat.MessagesRequestBuilder()
        .setCategories(categories)
        .setLimit(100)
        .hideReplies(true),
        datePattern: generateMessageDateString,
        dateSeparatorPattern: customDateSeparatorPattern,
        scrollToBottomOnNewMessages: true,
        EmptyStateView: EmptyStateView,
        onThreadRepliesPress:onThreadRepliesPressHandler,
        templates:getTemplates(),
    };
  return (
    <View style={[style.contant,styles.bgAsh]}>
      {!selectedGroup  && !selectedMember && 
      <View style={style.sidepanelcolor}>
        <Menu selectIndex={5}></Menu>
      </View>}
      <KeyboardAvoidingView style={[style.contant]}>
      <CometChatContextProvider theme={myTheme}>
        <View style={[style.contant]}>
        {selectedGroupInfoModal &&  
        <MembersListModal 
          showModal={selectedGroupInfoModal}
          cancelHandler={()=>{setSelectedGroupInfoModal(false);setGroupMemberSearch('');setSelectedGroupInfoShow(true)}}
          search={groupMemberSearch}
          setSearch={setGroupMemberSearch}
          data={selectedGroupInfo}
          selectedItems={selectedItems}
          renderItem={renderGroupInfoUsers}
          title={'Members'}
          addHandler={() => {setCreateGroupModal(true);setAddMemberModal(false);setGroupMemberSearch('')}}
        />}
         <AddMembersListModal 
          showModal={transferOwnerShipModal}
          cancelHandler={()=>{setTransferOwnerShipModal(false);setTransferOwnerShipSearch('')}}
          search={transferOwnerShipSearch}
          setSearch={setTransferOwnerShipSearch}
          data={selectedGroupInfo}
          selectedItems={[]}
          renderItem={renderGroupUsersTransferOwnership}
          title={'Transfer Ownership'}
          addHandler={() => {setTransferOwnerShipModal(false);setTransferOwnerShipSearch('')}}
          loader={false}
          />
      
          {selectedMember && !selectedMemberShow && !message && (
            <ChatDetailsComponent
              user={selectedMember}
              onBack={onBackHandler}
              messageListConfiguration={messageListConfiguration}
              CustomHeaderComponent={CustomHeaderView}
            />
          )}

          {selectedGroup && !selectedGroupInfo && !addMemberModal && !message && (
            <ChatDetailsComponent
              group={selectedGroup}
              onBack={onBackHandler}
              selectedGroupMembers={selectedGroupMembers}
              selectedGroupIsAdminOnly={selectedGroupIsAdminOnly}
              loggedInUser={loggedInUser}
              messageListConfiguration={messageListConfiguration}
              CustomHeaderComponent={CustomHeaderView}
            />
          )}
          {(selectedGroup || selectedMember) && message &&
          <CometChatThreadedMessages
            parentMessage={message}
            title={`Thread`}
            BubbleView={(props) => CustomBubbleView({ ...props, message })}
            onClose={()=>setMessage(null)} 
            messageComposerConfiguration={{
              keyboardAvoidingViewProps: {
                behavior: Platform.OS === "ios" ? "padding" : "height",
              }
            }} 
          />}
          
          {selectedGroup && selectedGroupInfo && selectedGroupInfoShow && <GroupDetails/>}
          {selectedMember && selectedMemberShow && <GetCustomProfileView/>}
          {!showList && !selectedGroup && !selectedMember && (
            <View style={{ flex: 1,}}>
              <View style={[style.mtb20]}>
                <View  style={[styles.tabStyle,style.mH10,style.row]}>
                  {tabData?.map((e: string) => (
                    <TouchableOpacity style={[styles.tabsContainer,selectedTab === e && styles.selectedTab,style.contant]} onPress={() => {tabSwicthHandler(e)}} >
                      <Text style={[style.textCenter,styles.colorWhite,styles.font16,selectedTab === e && {fontWeight: "bold",color: COLORS.PRIMARY,},]}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            <View style={{ flexGrow: 1 }}>
                {selectedTab === "Chats" && (chatLoading ? <GetLoadingStateView/> :
                <CometchatConversationsComponents 
                handleConversationPress={handleConversationPress}
                />
                )}
                {selectedTab === "Users" && (
                  <MessagesMembersListComponent
                  startConversationHandler={startConversationHandler}
                  userLoaderId={userLoaderId}
                  hasFetched={hasFetched}
                  membersList={membersList}  
                  setMembersList={setMembersList}  

                  />
                )}
                {selectedTab === "Groups" && (
              <View style={[style.pH10]}>
              <TouchableOpacity onPress={() => {setAddMemberModal(true);setaddMembersGroupList(cometUsers);setAddmember(false);setAdminOnly(false)}} style={{flexDirection: "row",alignItems: "center",borderBottomColor: "#ccc",paddingVertical: 10,paddingHorizontal: 20,}}>
                <View style={[styles.avatar]}>
                    <MaterialIcons name="groups" size={30} color={"#ffffff"}/>
                </View>
                <Text style={[style.font16, style.boldTxt, style.mb5]}>
                  Create New Group
                </Text>
              </TouchableOpacity>
              <CometChatGroups
                hideSeperator={true}
                title=""
                hideSearch={false}
                ListItemView={getListItemViewGrp}
                groupsStyle={groupsStyle}
                LoadingStateView={GetLoadingStateView}
                emptyStateText="No groups found"
                EmptyStateView={EmptyGroupsStateView}
              />
            </View>
                )}
            </View>
            </View>
          )}
        </View>
      </CometChatContextProvider>
      </KeyboardAvoidingView>
      
   
      <CreateGroupModal
      showModal={createGroupModal}
      setAddMemberModal={setAddMemberModal}
      setShowModal={setCreateGroupModal}
      cancelHandler={cancelGroupCreateHandler}
      selectedImage={selectedImage}
      selectedImagePreview={selectedImagePreView}
      setSelectedImagePreview={setSelectedImagePreview}
      selectImageHandler={uploadImageHandler}
      setLoading={setIsImageLoding}
      isLoading={isImageLoding}
      selectedImageErr={selectedImageErr}
      groupName={groupName}
      setGroupName={setGroupName}
      setGroupNameError={setGroupNameErr}
      groupNameError={groupNameErr}
      groupDes={groupDesc}
      setGroupDes={setGroupDesc}
      setGroupDescError={setGroupDescError}
      groupDescError={groupDescError}
      data={cometUsers}
      renderItem={renderSelectedUsers}
      createGroupHandler={createGroupHandler}
      setSelectedImage={setSelectedImage}
      createGroupLoader={createGroupLoader}
      showUsersList={true}
      Title={'Create'}
      setAdminOnly={setAdminOnly}
      adminOnly={adminOnly}
      userRoleInGroup={userRoleInGroup}
      />
      <CreateGroupModal
      showModal={updateGroupModal}
      setAddMemberModal={setAddMemberModal}
      setShowModal={setUpdateGroupModal}
      cancelHandler={cancelGroupCreateHandler}
      selectedImage={selectedImage}
      selectedImagePreview={selectedImagePreView}
      setSelectedImagePreview={setSelectedImagePreview}
      selectImageHandler={uploadImageHandler}
      setLoading={setIsImageLoding}
      isLoading={isImageLoding}
      selectedImageErr={selectedImageErr}
      groupName={groupName}
      setGroupName={setGroupName}
      setGroupNameError={setGroupNameErr}
      groupNameError={groupNameErr}
      groupDes={groupDesc}
      setGroupDes={setGroupDesc}
      setGroupDescError={setGroupDescError}
      groupDescError={groupDescError}
      data={cometUsers}
      renderItem={renderSelectedUsers}
      createGroupHandler={updateGroupHandler}
      setSelectedImage={setSelectedImage}
      createGroupLoader={createGroupLoader}
      showUsersList={false}
      Title={'Update'}
      setAdminOnly={setAdminOnly}
      adminOnly={adminOnly}
      userRoleInGroup={userRoleInGroup}
      />
      <AddMembersListModal 
      showModal={addMemberModal}
      cancelHandler={cancelGroupCreateHandler}
      search={addMemberModalSearch}
      setSearch={setAddMemberModalSearch}
      data={addMembersGroupList}
      selectedItems={selectedItems}
      renderItem={renderAddMembers}
      title={'Add Members'}
      addHandler={addMemberHandler}
      loader={addMemberLoader}
      />
      
        <Modal
          visible={publicGroup}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPublicGroup(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer]}>
                <TouchableOpacity onPress={()=>setPublicGroup(false)}  style={{alignSelf:'flex-end'}}>
                <AntDesign name="close" size={25} color="#000" />
                </TouchableOpacity >
                <View>
                    <Text style={[style.textCenter,style.font20,style.mtb10,style.primaryText,style.boldTxt,publicGroupNameDetails?.description ?undefined :styles.mb30]}>Are you sure want to join {publicGroupNameDetails?.name}?</Text>
                    {publicGroupNameDetails?.description &&(
                    publicGroupNameDetails?.description.length > 100 ?
                    (<Text style={[styles.joinGroupText]} ><Text style={[style.boldTxt]}>Group description:</Text> {publicGroupDesShow ? publicGroupNameDetails?.description : sliceString(publicGroupNameDetails?.description,100) }<Text onPress={()=>setPublicGroupDesShow((prev)=>!prev)} style={[style.font16,style.boldTxt]}>{publicGroupDesShow ? 'less' : 'more'}</Text> </Text>)
                    :
                    <Text style={[styles.joinGroupText]} ><Text style={[style.boldTxt]}>Group description:</Text> {publicGroupNameDetails?.description}</Text>
                    )}
                    <View style={[style.contentBetween,{marginHorizontal:Dimensions.get('screen').width * 0.02}]}>
                    <TouchableOpacity style={[style.button,style.whiteLayout,{width:Dimensions.get('screen').width * 0.25}]} onPress={()=>setPublicGroup(false)}>
                    <Text style={[style.buttonTxt,style.primaryText,style.boldTxt,{fontSize:normalize(16),}]}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.button,style.primaryLayout,{width:Dimensions.get('screen').width * 0.25}]} onPress={joinGroupHandler}>
                    <Text style={[style.buttonTxt,style.whiteText,style.boldTxt,{fontSize:normalize(16),}]}>Yes</Text>
                    </TouchableOpacity>
                    </View>
                </View>    
            </View>
          </View>
        </Modal>
      {showScopeModal && 
      <ScopeModal 
      show={showScopeModal} 
      setShow={setShowScopeModal} 
      user={userScope} 
      group={selectedGroup} 
      groupMembers={selectedGroupInfo} 
      setGroupMembers={setSelectedGroupInfo}
      userScopeInGroup={userRoleInGroup}
      />}
      <GroupMemberActionModal 
      show={showActionModal} 
      setShow={setShowActionModal} 
      user={showActionOn} 
      group={selectedGroup} 
      setGroup={setSelectedGroup}
      groupMembers={selectedGroupInfo} 
      setGroupMembers={setSelectedGroupInfo} 
      actionType={showActionType}
      />
    
      <LeaveOrDeleteGroupModal 
      show={leaveOrDeleteModal}
      setShow={setLeaveOrDeleteModal}
      selectedGroup={selectedGroup}
      setSelectedGroup={setSelectedGroup}
      setSelectedGroupInfo={setSelectedGroupInfo}
      type={leaveOrDeleteType}
      setShowListModal={setTransferOwnerShipModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mb30:{
    marginBottom:30
  },
  joinGroupText:{
    ...style.mtb10,
    color:COLORS.PRIMARY,
    marginBottom:30,
    fontSize:16
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    // height: normalize(150),
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
   selectedTab: {
    backgroundColor: COLORS.WHITE,
  },
  button: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  username: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    color: COLORS.BLACK,
    fontWeight: "bold",
  },
  avatar: {
    marginRight: 7,
    backgroundColor: COLORS.DARK_PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  colorWhite: {
    color: "white",
  },
  bgAsh: {
    backgroundColor: "#f3f3f3",
  },
  border: {
    borderWidth: 0.2,
    borderColor: COLORS.GREY,
    marginVertical: scaleHeight(20),
  },
  tabStyle: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(10),
    justifyContent: "space-between",
    padding: 5,
  },
  font16:{
    fontSize:16
  }
});

export default CometChatScreen;
