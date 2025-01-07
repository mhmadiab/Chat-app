
export const host = process.env.REACT_APP_API_URL || "http://localhost:8555";
export const setAvatarRoute = `${host}/api/auth/setavatar`
export const allUsersRoute = `${host}/api/auth/allusers`
export const sendMessageRoute = `${host}/api/messages/addmessage`
export const getAllMessagesRoute = `${host}/api/messages/getmessages`