// import { createSlice } from '@reduxjs/toolkit';

// const userSlice = createSlice({
//   name: 'user',
//   initialState: null,
//   reducers: {
//     login: (state) => {

//       return true; 
//     },
//     logout: (state) => {
     
//       return false; 
//     },
//   },
// });

// export const { login, logout } = userSlice.actions;

// export const selectUser = (state) => state.user;

// export default userSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    login: (state, action) => {
      return action.payload; // Set the user data as the state
    },
    logout: () => null, // Reset the state to null upon logout
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
