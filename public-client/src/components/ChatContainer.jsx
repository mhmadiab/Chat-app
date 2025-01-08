import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import Logout from './Logout'
import ChatInput from './ChatInput'
import axios from 'axios'
import { sendMessageRoute , getAllMessagesRoute} from '../utils/APIroutes'
import {v4 as uuidv4 }  from 'uuid'



const ChatContainer = ({currentChat , currentUser , socket , isMobile, handleCloseChat}) => {

   const [msgs , setMsgs] = useState([])
   const [arrivalMessage , setArrivalMessage] = useState(null)
   const [istyping , setIsTyping] = useState(false)
   const [typingIndicator, setTypingIndicator] = useState("");
   
  
   const handleTyping = ()=>{
    if(!socket.current) return;
    socket.current.emit('typing', {
      to : currentChat._id,
      from : currentUser._id
    })
    setIsTyping(true)
   }

   const handleStopTyping =()=>{
    if(!socket.current) return;
    socket.current.emit('stop-typing', {
      to : currentChat._id,
      from : currentUser._id
    })
    setIsTyping(false)
   }

   useEffect(() => {
    if (socket.current) {
        socket.current.on("typing", ({ from }) => {
            if (from === currentChat._id) {
                setTypingIndicator(`typing...`);
            }
        });

        socket.current.on("stop-typing", ({ from }) => {
            if (from === currentChat._id) {
                setTypingIndicator("");
            }
        });
    }
    }, [socket, currentChat]);

   const scrollRef = useRef()

   useEffect(() => {
    const fetchMessages = async () => {
        if (!currentUser || !currentChat) {
            return;
        }
        try {
            const response = await axios.post(getAllMessagesRoute, {
                from : currentUser._id,
                to : currentChat._id
            })
            setMsgs(response.data)
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    fetchMessages();
}, [currentChat, currentUser]);


  const handleSendMessage = async(message)=>{
    await axios.post(sendMessageRoute, {
            from : currentUser._id,
            to : currentChat._id,
            message : message
    })
    socket.current.emit("send-message",{
        to: currentChat._id,
        from : currentUser._id,
        message
    })
    const messages = [...msgs]
    messages.push({fromSelf : true , message : message})
    setMsgs(messages)
  }

  useEffect(()=>{
       if(socket?.current){
        socket.current.on("message-recieved" , (message)=>{
            setArrivalMessage({fromSelf : false, message : message})
        })
       }
  },[])

  useEffect(()=>{
     arrivalMessage && setMsgs((prev)=>[...prev, arrivalMessage])
  },[arrivalMessage])
 
  


  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior :  "smooth"})
  },[msgs])
  
  return (
    <>
    {
        currentChat && <Container >
            <div className="chat-header">
                <div className="user-details">
                <div className="avatar">
                    <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt=""
                    />
                </div>
                <div className="username">
                    <h3>{currentChat.username}</h3>
                </div>
                {typingIndicator && (
                  <div className="typing-indicator">
                      <p>{typingIndicator}</p>
                      <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                      </div>
                  </div>
              )}
                </div>
                <Logout />
                {
                  isMobile && <ToggleButton onClick={handleCloseChat}>X</ToggleButton>
                }
            </div>
            <div className="chat-messages">
               {
                msgs.map((message, index)=>{
                    return(
                        <div ref={scrollRef} key={index}>
                            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                                <div className="content">
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })
               }
            </div>
            <ChatInput handleSendMessage={handleSendMessage} handleTyping={handleTyping} handleStopTyping={handleStopTyping}/>
        </Container>
    }
    </>
  )
}



const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;

  @media screen and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (max-width: 720px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }

  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: #d1d1d1;
    font-style: italic;
    padding: 0.5rem 2rem;
  }

  .typing-dots span {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #d1d1d1;
    border-radius: 50%;
    animation: bounce 1.2s infinite;
  }

  .typing-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;


const ToggleButton = styled.button`
  background-color: #4f04ff21;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #4f04ff40;
  }
`;

export default ChatContainer