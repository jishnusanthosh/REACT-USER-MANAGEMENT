import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../Redux/userReducer';
import axios from 'axios';
import './homepage.css';

function Homepage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('userToken');
      console.log(token);
      if (!token) {
        navigate('/login');
      } else {
        try {
          const response = await axios.get('http://localhost:5000/validateToken', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { auth } = response.data;
          if (!auth) {
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
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  console.log('User:', user);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="page-container">
      <div className="homepage">
        <h1>Welcome to the Homepage</h1>
        {user && (
          <React.Fragment>
            
            <p>Hello, {user.name}</p>
          </React.Fragment>
        )}
        <div className="button" onClick={handleProfileClick}>
          Profile
        </div>
        <div className="button" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}

export default Homepage;
