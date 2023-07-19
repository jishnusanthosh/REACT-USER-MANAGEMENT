import React, { useState } from 'react';
import './login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../../../Redux/userReducer';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleLogin = () => {
    axios
      .post('http://localhost:5000/login', user)
      .then((res) => {
        const { auth, token, message, user } = res.data;
        if (auth) {
          // Successful login
          const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
          const expirationDate = new Date().getTime() + expirationTime;
          localStorage.setItem('userToken', token); // Store the user token in local storage
          localStorage.setItem('expirationDate', expirationDate);
          localStorage.setItem('user', JSON.stringify(user));
          dispatch(login(user));
          navigate('/');
        } else {
          // Failed login
          alert(message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="page-container">
      <div className="login">
        <h1>Login</h1>
        <input type="text" name="email" placeholder="Enter your Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Enter your Password" onChange={handleChange} />
        <div className="button" onClick={handleLogin}>
          Login
        </div>
        <div>or</div>
        <div className="button" onClick={handleRegisterClick}>
          Register
        </div>
      </div>
    </div>
  );
}

export default Login;
