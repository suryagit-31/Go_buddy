import React, { useState } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  UserRound,
  Mail,
  Phone,
  Globe2,
  Languages,
  Pencil,
  MapPin,
  UserPen,
  Siren,
} from "lucide-react";
import useAuthStore from "../store/useAuthstore";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { authUser, UpdateProfile, is_updatingprofile, setIsUpdatingProfile } =
    useAuthStore();
  const [userData, setUserData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    city: authUser?.city || "",
    age: authUser?.age || "",
    languages: authUser?.languages || "",
    bio: authUser?.bio || "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalConditions: "",
  });

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    setIsUpdatingProfile(true);
    try {
      await UpdateProfile(userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const inputProps = (field) => ({
    value: userData[field],
    onChange: isEditing
      ? (e) => setUserData({ ...userData, [field]: e.target.value })
      : undefined,
    disabled: !isEditing,
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-soft rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-primary-50">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 flex justify-left items-center  ">
                  My Profile <UserPen />
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-600">
                  Personal details and travel preferences
                </p>
              </div>
              {!isEditing && (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
              )}
            </div>

            <div className="border-t border-neutral-200">
              <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="flex items-center gap-1 text-sm font-medium text-neutral-700"
                      >
                        <UserRound /> Full name
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...inputProps("name")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-neutral-700 flex items-center gap-1"
                      >
                        <Mail /> Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        disabled
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-neutral-700 flex items-center gap-1"
                      >
                        <Phone /> Phone number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        {...inputProps("phone")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="flex items-center gap-1 text-sm font-medium text-neutral-700"
                      >
                        <MapPin /> City
                      </label>
                      <input
                        type="text"
                        id="city"
                        {...inputProps("city")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        {...inputProps("age")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="languages"
                        className="flex items-center gap-1 text-sm font-medium text-neutral-700"
                      >
                        <Languages /> Languages spoken
                      </label>
                      <input
                        type="text"
                        id="languages"
                        {...inputProps("languages")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-neutral-700"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      {...inputProps("bio")}
                      className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-neutral-900 mb-3">
                      Emergency Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="emergencyContact"
                          className="flex items-center gap-1 text-sm font-medium text-neutral-700"
                        >
                          <Siren color="red" /> Emergency contact
                        </label>
                        <input
                          type="text"
                          id="emergencyContact"
                          {...inputProps("emergencyContact")}
                          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="emergencyPhone"
                          className="flex items-center gap-1 text-sm font-medium text-neutral-700"
                        >
                          Emergency phone
                        </label>
                        <input
                          type="text"
                          id="emergencyPhone"
                          {...inputProps("emergencyPhone")}
                          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="medicalConditions"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Medical conditions
                      </label>
                      <textarea
                        id="medicalConditions"
                        rows={2}
                        {...inputProps("medicalConditions")}
                        className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="mt-1 text-xs text-neutral-500">
                        This information will only be shared with your travel
                        companion in case of emergency
                      </p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={is_updatingprofile}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {is_updatingprofile ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
