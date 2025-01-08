import styled from "styled-components"
import Picker from 'emoji-picker-react'
import {IoMdSend} from 'react-icons/io'
import {BsEmojiSmileFill} from 'react-icons/bs'
import { useState, useRef } from "react"

const ChatInput = ({handleSendMessage , handleTyping , handleStopTyping}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [message , setMessage] = useState('')

    const typingTimeout = useRef(null);

    const HandleEmojiPicker = ()=>{
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (emojiData) => {
        const { emoji } = emojiData
        setMessage((prev) => prev + emoji)
    }

    const handleChange = (e)=>{
      setMessage(e.target.value)
      handleTyping()
      debounceStopTyping();
    }

    const debounceStopTyping = () => {
      if (typingTimeout.current) {
          clearTimeout(typingTimeout.current)
      }
      typingTimeout.current = setTimeout(() => {
          handleStopTyping(); 
      }, 1000)
  }

    const sendChat = (event)=>{
       event.preventDefault()
       if(message.length > 0){
        handleSendMessage(message)
        setMessage('')
        handleStopTyping()
       }
    }


  return (
    <Container>
        <div className="button-container">
            <div className="emoji">
                <BsEmojiSmileFill onClick={HandleEmojiPicker}/>
                {
                    showEmojiPicker && <div className="emoji-wrapper">
                        <Picker onEmojiClick={handleEmojiClick} theme="dark"/>
                    </div>
                }
            </div>
        </div>
        <form className="input-container" onSubmit={(e)=> sendChat(e)}>
            <input type="text" value={message} onChange={handleChange}/>
            <button className="submit">
                <IoMdSend onClick={sendChat}/>
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (max-width: 720px) {
      grid-template-columns: 10% 90%;
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    .emoji-wrapper {
        position: absolute;
        top: -470px; /* Adjust as needed */
        }
      .emoji-picker-react {
        position: absolute !important;
        top: -350px;
        left : 0;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`


export default ChatInput