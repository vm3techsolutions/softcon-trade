import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async () => {
    const res = await axiosInstance.get("/users");
    return res.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id) => {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  }
);

const usersSlice = createSlice({
  name: "allUsers",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;