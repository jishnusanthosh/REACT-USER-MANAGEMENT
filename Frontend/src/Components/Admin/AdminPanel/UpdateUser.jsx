import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/getUser/${id}`)
      .then((result) => {
        console.log(result);
        setUser(result.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const adminToken = localStorage.getItem('adminToken'); // Get the admin token from local storage

    axios
      .put(`http://localhost:5000/admin/updateUser/${id}`, user, {
        headers: {
          Authorization: `Bearer ${adminToken}` // Set the authorization header with the admin token
        }
      })
      .then((res) => {
        console.log(res);
        alert('User updated successfully');
        navigate('/admin');
      })
      .catch((err) => {
        alert('Error occurred during user update');
        console.error(err);
      });
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
          <h2>Update User</h2>
          <div className='mb-2'>
            <label htmlFor='nameInput'>Name</label>
            <input
              type='text'
              id='nameInput'
              name='name'
              placeholder='Enter Name'
              className='form-control'
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='emailInput'>Email Address</label>
            <input
              type='email'
              id='emailInput'
              name='email'
              placeholder='Enter Email address'
              className='form-control'
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='passwordInput'>Password</label>
            <input
              type='password'
              id='passwordInput'
              name='password'
              placeholder='Password'
              className='form-control'
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <button type='submit' className='btn btn-primary'>
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
