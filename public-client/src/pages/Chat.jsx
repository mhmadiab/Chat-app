import styled from 'styled-components'
import axios from 'axios'
import { useState, useEffect , useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { allUsersRoute , host } from '../utils/APIroutes'
import Contact from '../components/Contact'
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from 'socket.io-client'

const Chat = () => {

  const navigate = useNavigate()

  const socket = useRef()

  const [contacts , setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)


  useEffect(()=>{
    const protect = async()=>{
      if(!sessionStorage.getItem("chat-app-user")){
        navigate("/login")
      }else{
        setCurrentUser(await JSON.parse(sessionStorage.getItem("chat-app-user")))
        setIsLoaded(true)
      }
    }
    protect()
  },[])


  //socket is initialized and user is registered only when user is logged in 
  useEffect(()=>{
    if(currentUser){
      socket.current = io(host)
      socket.current.emit("add-user" , currentUser._id)
    }
  },[currentUser])

  useEffect(()=>{
    const fetchUsers = async()=>{
        if(currentUser){
          if(currentUser.isAvatarImageSet){
            const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
            setContacts(data.data.data)
          }else{
            navigate("/avatar")
          }
        }
    }
    fetchUsers()
  },[currentUser, navigate])


  const handleChatChange = (chat) =>{
    setCurrentChat(chat)
  }


  return (
    <Container>
      <div className="container">
          <Contact contacts={contacts} currentUser={currentUser} chatChange={handleChatChange}  />
          {isLoaded && currentChat === undefined ? <Welcome currentUser={currentUser}/> : <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />}
          
      </div>
    </Container>
  )
}

const Container = styled.div`
 height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
`

export default Chat