import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../utils/axios";
import { toast } from "react-hot-toast";

<<<<<<< HEAD
const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      is_signingup: false,
      is_loggingin: false,
      is_userlogged: false,
      is_updatingprofile: false,
      ischeckingAuth: false,
      setIsUpdatingProfile: (value) => set({ is_updatingprofile: value }),
      checkAuth_validity: async () => {
        try {
          set({ ischeckingAuth: true });
          const res = await axiosInstance.get("/user/check");
          set({
            authUser: res.data,
            ischeckingAuth: false,
            is_userlogged: true,
          });
        } catch (error) {
          // Clear stored auth if token is invalid
          set({ authUser: null, is_userlogged: false });
          // Clear localStorage on auth failure
          localStorage.removeItem("auth-storage");
        } finally {
          set({ ischeckingAuth: false });
        }
      },
      Signup: async (data) => {
        set({ is_signingup: true });
        try {
          const res = await axiosInstance.post("/user/signup", data);
=======
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
      const res = await axiosInstance.get(
        "https://go-buddy-1-3scd.onrender.com/user/check"
      );
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
      const res = await axiosInstance.post(
        "https://go-buddy-1-3scd.onrender.com/user/signup",
        data
      );
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af

          set({
            authUser: res.data,
            is_signingup: false,
            is_userlogged: true,
          });
        } catch (error) {
          console.error("Signup failed:", error);
          toast.error(error.response?.data?.message || error.message);
          set({ is_signingup: false, authUser: null, is_userlogged: false });
        } finally {
          set({ is_signingup: false });
        }
      },

<<<<<<< HEAD
      Login: async (data) => {
        set({ is_loggingin: true });
        try {
          const res = await axiosInstance.post("/user/login", data);
          set({
            authUser: res.data,
            is_loggingin: false,
            is_userlogged: true,
          });
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
          set({ authUser: null, is_userlogged: false });
        } finally {
          set({ is_loggingin: false });
        }
      },

      UpdateProfile: async (data) => {
        set({ is_updatingprofile: true });
        try {
          const res = await axiosInstance.put("/user/updateprofile", data);
          const { message, ...userData } = res.data;

          if (userData && (userData.name || userData.email || userData._id)) {
            set({
              authUser: userData,
              is_updatingprofile: false,
              is_userlogged: true,
            });
          } else {
            await useAuthStore.getState().checkAuth_validity();
          }

          toast.success(message || "Profile updated successfully");
          return res.data;
        } catch (error) {
          console.error("Profile update failed:", error);
          toast.error(error.response?.data?.message || error.message);
          throw error;
        } finally {
          set({ is_updatingprofile: false });
        }
      },

      UploadProfilePicture: async (file) => {
        try {
          const formData = new FormData();
          formData.append("profilePicture", file);

          const res = await axiosInstance.post(
            "/user/upload-profile-picture",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (res.data.user) {
            set({
              authUser: res.data.user,
              is_userlogged: true,
            });
          } else if (res.data.profilePicture) {
            set((state) => ({
              authUser: {
                ...state.authUser,
                profilePicture: res.data.profilePicture,
              },
            }));
          } else {
            throw new Error("Invalid response from server");
          }

          await useAuthStore.getState().checkAuth_validity();
          toast.success("Profile picture uploaded successfully");
          return res.data;
        } catch (error) {
          console.error("Profile picture upload failed:", error);
          toast.error(
            error.response?.data?.message || "Failed to upload profile picture"
          );
          throw error;
        }
      },

      Logout: async () => {
        try {
          const res = await axiosInstance.post("/user/logout");
          set({ authUser: null, is_userlogged: false });
          // Clear localStorage on logout
          localStorage.removeItem("auth-storage");
          toast.success(res.data.message);
        } catch (error) {
          console.error(
            "Logout error:",
            error.response?.data?.message || error.message
          );
          set({ authUser: null, is_userlogged: false });
          localStorage.removeItem("auth-storage");
          toast.error(error.response?.data?.message || error.message);
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage key
      partialize: (state) => ({
        // Only persist authUser and is_userlogged, not loading states
        authUser: state.authUser,
        is_userlogged: state.is_userlogged,
      }),
=======
  Login: async (data) => {
    set({ is_loggingin: true });
    try {
      const res = await axiosInstance.post(
        "https://go-buddy-1-3scd.onrender.com/user/login",
        data
      );
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
      const res = await axiosInstance.put(
        "https://go-buddy-1-3scd.onrender.com/user/updateprofile",
        data
      );
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
      const res = await axiosInstance.post(
        "https://go-buddy-1-3scd.onrender.com/user/logout"
      );
      set({ authUser: null });
      set({ is_userlogged: false });
      toast.success(res.data.message);
    } catch (error) {
      console.log(
        "error in logout ",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || error.message);
>>>>>>> 30b81bf8857f2dc693297013e31a48c449b043af
    }
  )
);

export default useAuthStore;
