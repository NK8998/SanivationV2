import {createSlice} from "@reduxjs/toolkit";



const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isLoggedIn: false,
      userData: null, // Initialize userData as null
    },
    reducers: {
      userLoggedIn: (state, action) => {
        state.isLoggedIn = true;
        state.userData = action.payload; // Set user data when logged in
      },
      userLoggedOut: (state) => {
        state.isLoggedIn = false;
        state.userData = null; // Clear user data when logged out
      },
    },
  });
  
  export const { userLoggedIn, userLoggedOut } = authSlice.actions;
  
  export default authSlice.reducer;