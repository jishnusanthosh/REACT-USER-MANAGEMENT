import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../Redux/userReducer';
import { Link } from 'react-router-dom'; 
import './userProfile.css';

function UserProfile() {
  const user = useSelector(selectUser);

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      <br />
      <br />
      <div className="profile-info">
        {user ? (
          <React.Fragment>
            {user.profilePicture ? (
              <img
                src={`http://localhost:5000/uploads/${user.profilePicture}`}
                alt="Profile"
                className="profile-picture-img"
              />
            ) : (
              <div className="placeholder">No profile picture</div>
            )}
            <br />
            <br />
            <h3>Name: {user.name}</h3>
            <br />
            <p>Email: {user.email}</p>
          </React.Fragment>
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
}

export default UserProfile;
