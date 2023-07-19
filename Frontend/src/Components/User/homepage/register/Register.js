import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    reEnterPassword: '',
    profilePicture: null, // Add profilePicture to the user state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];

    setUser({
      ...user,
      profilePicture: file, // Set the selected file as the profile picture
    });
  };

  const register = () => {
    const { name, email, password, reEnterPassword, profilePicture } = user;

    if (name && email && password && password === reEnterPassword) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profilePicture', profilePicture); // Append the profile picture to the FormData

      axios.post('http://localhost:5000/register', formData).then((res) => {
        alert('Registered successfully');
        navigate('/login');
        console.log(res);
      });
    } else {
      alert('Invalid input');
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="register">
      <h1>Register</h1>
      <input type="text" name="name" value={user.name} placeholder="Your Name" onChange={handleChange} />
      <input type="text" name="email" value={user.email} placeholder="Your Email" onChange={handleChange} />
      <input type="password" name="password" value={user.password} placeholder="Your Password" onChange={handleChange} />
      <input
        type="password"
        name="reEnterPassword"
        value={user.reEnterPassword}
        placeholder="Re-enter Password"
        onChange={handleChange}
      />
      <input type="file" name="profilePicture" onChange={handlePictureChange} accept="image/*" />  {/* Add the file input for profile picture */}
      <div className="button" onClick={register}>
        Register
      </div>
      <div>or</div>
      <div className="button" onClick={handleLoginClick}>
        Login
      </div>
    </div>
  );
}

export default Register;
