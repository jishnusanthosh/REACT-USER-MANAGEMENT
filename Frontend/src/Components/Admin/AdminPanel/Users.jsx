import React, { useEffect, useState } from 'react';
import './Users.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../../Redux/adminReducer';

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const adminAuth = Boolean(localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!adminAuth) {
      navigate('/admin/login');
    }
  }, [adminAuth, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filteredResults = users.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
    setFilteredUsers(filteredResults);
  }, [users, searchQuery]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/admin/deleteUser/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('adminToken');

    // Dispatch admin logout action
    dispatch(adminLogout());

    // Redirect to the admin login page
    navigate('/admin/login');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="users-container">
      <div className="users-table-container">
        <div className="logout-button btn btn-danger" onClick={handleLogout}>
          Logout
        </div>
        <h1>Admin Dashboard</h1>
        <hr />

        <div className="users-header">
          <Link to="/admin/create" className="btn btn-success">
            Add New User
          </Link>
        </div>

        <Form>
          <Form.Group controlId="searchForm">
            <Form.Control type="text" placeholder="Search by Name or Email" onChange={handleSearch} />
          </Form.Group>
        </Form>

        <table className="users-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email Address</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <Link to={`/admin/update/${user._id}`} className="btn btn-primary">
                      Update
                    </Link>

                    <Button className="btn btn-danger" onClick={(e) => handleDelete(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
