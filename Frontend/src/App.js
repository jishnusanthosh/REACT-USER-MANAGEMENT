import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, login } from './Redux/userReducer';
import axios from 'axios';

import Homepage from './Components/User/homepage/homepage/Homepage';
import Login from './Components/User/homepage/login/Login';
import Register from './Components/User/homepage/register/Register';
import UserProfile from './Components/User/homepage/UserProfile'; // Correct import path

import Users from './Components/Admin/AdminPanel/Users';
import CreateUser from './Components/Admin/AdminPanel/CreateUser';
import UpdateUser from './Components/Admin/AdminPanel/UpdateUser';
import AdminLogin from './Components/Admin/login/AdminLogin';

function App() {
  const user = useSelector(selectUser);
  const adminAuth = Boolean(localStorage.getItem('adminToken'));

  console.log(adminAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const storedAdminToken = localStorage.getItem('adminToken');
      const storedUserToken = localStorage.getItem('userToken');
      const currentPath = window.location.pathname;

      if (currentPath.startsWith('/admin')) {
        if (!storedAdminToken) {
          navigate('/admin/login');
        }
        // Skip token validation and user checking for admin routes
        return;
      }

      if (currentPath === '/register') {
        navigate('/register');
        return;
      }

      if (!storedUserToken) {
        navigate('/login');
      } else if (!user) {
        try {
          const response = await axios.get('http://localhost:5000/validateToken', {
            headers: {
              Authorization: `Bearer ${storedUserToken}`,
            },
          });

          const { auth, user } = response.data;
          if (auth) {
            dispatch(login(user));
          } else {
            console.log('Token not valid');
            navigate('/login');
          }
        } catch (error) {
          console.log('Token validation error:', error);
          navigate('/login');
        }
      }
    };

    checkToken();
  }, [dispatch, navigate, user]);

  return (
    <div className="App">
      <Routes>
        {/* User routes */}
        {!localStorage.getItem('userToken') ? (
          <Route path="/login" element={<Login />} />
        ) : (
          <Route path="/" element={<Homepage />} />
        )}
        {localStorage.getItem('userToken') ? (
          <Route path="/" element={<Homepage />} />
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="/register" element={<Register />} />

        {localStorage.getItem('userToken') && (
          <>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<UserProfile />} /> {/* Correct component name */}
          </>
        )}

        {/* Admin routes */}
        <>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Users />} />
          <Route path="/admin/create" element={<CreateUser />} />
          <Route path="/admin/update/:id" element={<UpdateUser />} />
        </>
      </Routes>
    </div>
  );
}

export default App;
