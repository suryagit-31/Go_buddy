import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { toast } from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  is_signingup: false,
  is_loggingin: false,
  is_userlogged: false,
  is_updatingprofile: false,
  ischeckingAuth: true,
  setIsUpdatingProfile: (value) => set({ is_updatingprofile: value }),
  checkAuth_validity: async () => {
    try {
      set({ ischeckingAuth: true });
      const res = await axiosInstance.get("/user/check");
      set({ authUser: res.data, ischeckingAuth: false, is_userlogged: true });
    } catch (error) {
      set({ authUser: null });
      // console.log("error in checking AUTH ", error);
    } finally {
      set({ ischeckingAuth: false });
    }
  },
  Signup: async (data) => {
    set({ is_signingup: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);

      set({ authUser: res.data, is_signingup: false, is_userlogged: true });
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error.response?.data?.message || error.message);
      set({ is_signingup: false, authUser: null, is_userlogged: false });
    } finally {
      set({ is_signingup: false });
    }
  },

  Login: async (data) => {
    set({ is_loggingin: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      console.log(res);
      console.log(res.data.createdAt);
      set({ authUser: res.data, is_loggingin: false, is_userlogged: true });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ is_loggingin: false });
    }
  },

  UpdateProfile: async (data) => {
    set({ is_updatingprofile: true });
    console.log(data);
    try {
      const res = await axiosInstance.put("/user/updateprofile", data);
      set({
        authUser: res.data,
        is_updatingprofile: false,
        is_userlogged: true,
      });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ is_updatingprofile: false });
    }
  },

  Logout: async () => {
    try {
      const res = await axiosInstance.post("/user/logout");
      set({ authUser: null });
      set({ is_userlogged: false });
      toast.success(res.data.message);
    } catch (error) {
      console.log(
        "error in logout ",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || error.message);
    }
  },
}));

export default useAuthStore;
