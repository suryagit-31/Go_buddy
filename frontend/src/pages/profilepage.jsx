import React, { useState, useEffect, useRef } from "react";
import PageTransition from "../components/pagetransition";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
  Shield,
  Check,
  X,
  Save,
  Edit3,
  UserCircle,
  Briefcase,
  Heart,
  AlertCircle,
  Loader,
} from "lucide-react";
import useAuthStore from "../store/useAuthstore";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);
  const {
    authUser,
    UpdateProfile,
    UploadProfilePicture,
    is_updatingprofile,
    setIsUpdatingProfile,
  } = useAuthStore();
  const [userData, setUserData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    city: authUser?.city || "",
    age: authUser?.age || "",
    languages: authUser?.languages || "",
    bio: authUser?.bio || "",
    emergencyContact: authUser?.emergencyContact?.name || "",
    emergencyPhone:
      authUser?.emergencyContact?.phone || authUser?.emergencyphone || "",
    medicalConditions: authUser?.medicalConditions || "",
  });

  useEffect(() => {
    if (authUser) {
      setUserData({
        name: authUser?.name || "",
        email: authUser?.email || "",
        phone: authUser?.phone || "",
        city: authUser?.city || "",
        age: authUser?.age || "",
        languages: authUser?.languages || "",
        bio: authUser?.bio || "",
        emergencyContact: authUser?.emergencyContact?.name || "",
        emergencyPhone:
          authUser?.emergencyContact?.phone || authUser?.emergencyphone || "",
        medicalConditions: authUser?.medicalConditions || "",
      });
    }
  }, [authUser]);

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
    value: userData[field] || "",
    onChange: isEditing
      ? (e) => setUserData({ ...userData, [field]: e.target.value })
      : undefined,
    disabled: !isEditing,
    className: `mt-2 block w-full rounded-lg border transition-all duration-200 ${
      isEditing
        ? "border-neutral-300 bg-white px-4 py-3 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        : "border-transparent bg-neutral-50 px-4 py-3"
    }`,
  });

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setIsUploadingPicture(true);
    try {
      await UploadProfilePicture(file);
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-neutral-600 text-lg">
              Manage your personal information and preferences
            </p>
          </motion.div>

          {/* Profile Header Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6">
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                    {authUser?.profilePicture?.url ? (
                      <img
                        src={authUser.profilePicture.url}
                        alt={authUser?.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary-600">
                        {getInitials(authUser?.name)}
                      </span>
                    )}
                    {isUploadingPicture && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={handleProfilePictureClick}
                        disabled={isUploadingPicture}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isUploadingPicture ? (
                          <Loader className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Pencil className="w-5 h-5 text-white" />
                        )}
                      </motion.button>
                    </>
                  )}
                </motion.div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {authUser?.name || "User"}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-primary-100 text-lg mb-4"
                  >
                    {authUser?.email}
                  </motion.p>
                  {authUser?.city && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center md:justify-start gap-2 text-primary-100"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{authUser.city}</span>
                    </motion.div>
                  )}
                </div>

                {/* Edit Button */}
                <AnimatePresence mode="wait">
                  {!isEditing ? (
                    <motion.button
                      key="edit"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit Profile
                    </motion.button>
                  ) : (
                    <motion.button
                      key="cancel"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold border-2 border-white/30 hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Personal Information Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: "name",
                    label: "Full Name",
                    icon: UserRound,
                    type: "text",
                    field: "name",
                  },
                  {
                    id: "email",
                    label: "Email Address",
                    icon: Mail,
                    type: "email",
                    field: "email",
                    disabled: true,
                  },
                  {
                    id: "phone",
                    label: "Phone Number",
                    icon: Phone,
                    type: "tel",
                    field: "phone",
                  },
                  {
                    id: "age",
                    label: "Age",
                    icon: Calendar,
                    type: "number",
                    field: "age",
                  },
                  {
                    id: "city",
                    label: "City",
                    icon: MapPin,
                    type: "text",
                    field: "city",
                  },
                  {
                    id: "languages",
                    label: "Languages",
                    icon: Languages,
                    type: "text",
                    field: "languages",
                    placeholder: "English, Spanish, French",
                  },
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <label
                        htmlFor={field.id}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2"
                      >
                        <Icon className="w-4 h-4 text-primary-600" />
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        {...inputProps(field.field)}
                        disabled={field.disabled || !isEditing}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Bio Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <label
                  htmlFor="bio"
                  className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2"
                >
                  <Briefcase className="w-4 h-4 text-primary-600" />
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  {...inputProps("bio")}
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                />
              </motion.div>
            </motion.div>

            {/* Emergency Information Card */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-red-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-200">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">
                    Emergency Information
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    This information will only be shared with your travel
                    companion in case of emergency
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: "emergencyContact",
                    label: "Emergency Contact Name",
                    icon: Heart,
                    type: "text",
                    field: "emergencyContact",
                  },
                  {
                    id: "emergencyPhone",
                    label: "Emergency Phone",
                    icon: Phone,
                    type: "tel",
                    field: "emergencyPhone",
                  },
                ].map((field, index) => {
                  const Icon = field.icon;
                  return (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <label
                        htmlFor={field.id}
                        className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2"
                      >
                        <Icon className="w-4 h-4 text-red-600" />
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.id}
                        {...inputProps(field.field)}
                        className={`mt-2 block w-full rounded-lg border transition-all duration-200 ${
                          isEditing
                            ? "border-red-300 bg-white px-4 py-3 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-transparent bg-red-50/50 px-4 py-3"
                        }`}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Medical Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6"
              >
                <label
                  htmlFor="medicalConditions"
                  className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Medical Conditions
                </label>
                <textarea
                  id="medicalConditions"
                  rows={3}
                  {...inputProps("medicalConditions")}
                  placeholder="Any medical conditions or allergies..."
                  className={`resize-none ${
                    isEditing
                      ? "border-red-300 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-transparent bg-red-50/50"
                  }`}
                />
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex justify-end gap-4 pt-6"
                >
                  <motion.button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 text-neutral-700 bg-white border-2 border-neutral-300 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-200 flex items-center gap-2 shadow-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={is_updatingprofile}
                    className="px-6 py-3 text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {is_updatingprofile ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
