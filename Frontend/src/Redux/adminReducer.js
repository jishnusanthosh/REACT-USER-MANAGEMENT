import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: false,
  reducers: {
    adminLogin: (state) => {
      return true;
    },
    adminLogout: (state) => {
      return false;
    },
  },
});

export const { adminLogin, adminLogout } = adminSlice.actions;

export const selectAdminAuth = (state) => state.admin;

export default adminSlice.reducer;
