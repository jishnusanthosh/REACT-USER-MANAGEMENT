import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = user;

    if (name && email && password) {
      axios
        .post('http://localhost:5000/admin/CreateUser', user)
        .then((res) => {
          alert('Registered successfully');
          console.log(res);
          navigate('/admin')
        })
        .catch((error) => {
          alert('Error occurred during registration');
          console.error(error);
        });
    } else {
      alert('Invalid input');
    }
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Create New User</h2>
          <div className='mb-2'>
            <label htmlFor='nameInput'>Name</label>
            <input
              type='text'
              name='name'
              value={user.name}
              id='nameInput'
              placeholder='Enter Name'
              className='form-control'
              onChange={handleChange}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='emailInput'>Email Address</label>
            <input
              type='email'
              name='email'
              value={user.email}
              id='emailInput'
              placeholder='Enter Email address'
              className='form-control'
              onChange={handleChange}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='passwordInput'>Password</label>
            <input
              type='password'
              name='password'
              value={user.password}
              id='passwordInput'
              placeholder='Password'
              className='form-control'
              onChange={handleChange}
            />
          </div>
          <button type='submit' className='btn btn-success'>
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
