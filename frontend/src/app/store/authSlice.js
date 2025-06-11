import { createSlice } from "@reduxjs/toolkit";

const initialState = {
user: null,
token: null,
isAuthenticated: false,
};

// Safe parsing inside browser environment
if (typeof window !== "undefined") {
try {
const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");


if (storedToken && storedUser) {
  initialState.token = storedToken;
  initialState.user = JSON.parse(storedUser);
  initialState.isAuthenticated = true;
}
} catch (error) {
console.error("Error parsing user data from localStorage:", error);
}
}

const authSlice = createSlice({
name: "auth",
initialState,
reducers: {
loginSuccess(state, action) {
const { user, token } = action.payload;
state.user = user;
state.token = token;
state.isAuthenticated = true;


  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
},
signupSuccess(state, action) {
  const { user, token } = action.payload;
  state.user = user;
  state.token = token;
  state.isAuthenticated = true;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
},
logout(state) {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
},
setUser(state, action) {
  const { user, token } = action.payload;
  state.user = user;
  state.token = token;
  state.isAuthenticated = true;

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
},
},
});

export const { loginSuccess, signupSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;