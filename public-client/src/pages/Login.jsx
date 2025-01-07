import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import register from '../assets/register-back.svg'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser, resetLoginState } from '../store/Login/loginSlice'


const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {loading} = useSelector((state)=> state.register)
  
  useEffect(()=>{
    if(sessionStorage.getItem("chat-app-user")){
      navigate("/")
    }
  }, [])

  const [formData, setFormData] = useState({
       username : "",
       password : "", 
  })

  const toastOptions = {
      position: "bottom-right",
      autoClose : 8000,
      pauseOnHover: true,
      draggable : true,
      theme : 'dark'
  }

  const {username,  password } = formData

   const handleValidation = () => {
      const validationErrorList = [];
  
      if (username.trim().length === 0) {
           validationErrorList.push("username is required.");
      }
  
      if (password.length === 0) {
           validationErrorList.push("password is required");
      }
  
      if (validationErrorList.length > 0) {
          validationErrorList.forEach((error) => {
               toast.error(error, toastOptions);
          });
           return false;
      }
  
      return true; 
  };

  
  

  const handleChange = (ev)=>{
        setFormData((prevData) =>({
            ...prevData,
            [ev.target.name] : ev.target.value
        }))
  }

  const submitHandler = (ev)=>{
        ev.preventDefault()
        const userData = {
          username, 
          password,
        }
        if(handleValidation()){
          dispatch(loginUser(userData))
          .unwrap()
          .then((data)=>{
            toast.info(data.message , toastOptions)
            sessionStorage.setItem("chat-app-user", JSON.stringify(data.data))
            dispatch(resetLoginState());
            navigate("/");
          })
          .catch((error)=>{
            toast.error(error.message , toastOptions)
          })
        }
        
  }
  return (
      <>
        <FormContainer>
          <div className="form-section">
            <div className="brand">
              <img src={Logo} alt="Logo" />
              <h1>frenzy</h1>
            </div>
    
            <form onSubmit={submitHandler}>
              <input
                type="text"
                placeholder="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {loading ? <button disabled={true}>Loading</button> :  <button type="submit">Login</button>}
              <span>
                Don't have an account? <Link to="/register">Register</Link>
              </span>
            </form>
          </div>
    
          <div className="image-section">
            <img src={register} alt="Register Background" className="background-register-image" />
          </div>
        </FormContainer>
        <ToastContainer />
        </>
      );
};
  


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
      padding-bottom : 1rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    background-color: #131324;
    height : 100vh;
  }

  .image-section {
    width: 50%; /* Adjust image section width */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    a {
      color: #4e0eff;
    } 
  }

  /* Responsive Design */
  @media screen and (max-width: 1024px) {
    flex-direction: column;
    .form-section {
      width: 100%;
      padding: 2rem;
    }
    .image-section {
      width: 100%;
      height: auto;
      margin-top: 2rem;
    }
  }

  @media screen and (max-width: 768px) {
    .form-section {
      padding: 1rem; /* Reduce padding for smaller screens */
    }
    .image-section {
      display: none; /* Hide the image section on very small screens (mobile) */
    }
    form {
      padding: 1.5rem; /* Adjust form padding on mobile */
    }
    .brand {
      gap: 0.5rem;
    }
    h1 {
      font-size: 1.5rem; /* Adjust header size for mobile */
    }
  }

  @media screen and (max-width: 480px) {
    .form-section {
      padding: 1rem;
    }
    h1 {
      font-size: 1.25rem;
    }
    input {
      font-size: 0.9rem; /* Reduce font size for smaller screens */
    }
    button {
      font-size: 0.9rem; /* Adjust button size for mobile */
    }
  }
`;




export default Login