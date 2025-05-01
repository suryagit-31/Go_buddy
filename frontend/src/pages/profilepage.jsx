import React, { useState } from "react";
import PageTransition from "../components/pagetransition";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { UserRound, Mail, Phone, Globe2, Languages } from "lucide-react";
import { useAuth } from "../context/authcontext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "(123) 456-7890",
      city: "New York",
      languages: "English, Spanish",
      bio: "Retired teacher who loves traveling and experiencing new cultures. I prefer having a companion when traveling for safety and companionship.",
      emergencyContact: "Jane Doe",
      emergencyPhone: "(987) 654-3210",
      medicalConditions:
        "Mild arthritis, high blood pressure (controlled with medication)",
    },
  });

  const onSubmit = (data) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-soft rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-primary-50">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">
                  My Profile
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-600">
                  Personal details and travel preferences
                </p>
              </div>
              {!isEditing && (
                <motion.button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Profile
                </motion.button>
              )}
            </div>

            <div className="border-t border-neutral-200">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Full name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.name
                              ? "border-error-500"
                              : "border-neutral-300"
                          } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                          {...register("name", {
                            required: "Name is required",
                          })}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-error-600">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          {...register("email")}
                          disabled
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Phone number
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.phone
                              ? "border-error-500"
                              : "border-neutral-300"
                          } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                          {...register("phone", {
                            required: "Phone number is required",
                          })}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-error-600">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      {/* City */}
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.city
                              ? "border-error-500"
                              : "border-neutral-300"
                          } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                          {...register("city", {
                            required: "City is required",
                          })}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-error-600">
                            {errors.city.message}
                          </p>
                        )}
                      </div>

                      {/* Languages */}
                      <div>
                        <label
                          htmlFor="languages"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Languages spoken
                        </label>
                        <input
                          type="text"
                          id="languages"
                          className={`mt-1 block w-full rounded-md border ${
                            errors.languages
                              ? "border-error-500"
                              : "border-neutral-300"
                          } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                          {...register("languages", {
                            required: "Languages are required",
                          })}
                        />
                        {errors.languages && (
                          <p className="mt-1 text-sm text-error-600">
                            {errors.languages.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
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
                        className={`mt-1 block w-full rounded-md border ${
                          errors.bio ? "border-error-500" : "border-neutral-300"
                        } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                        {...register("bio")}
                      />
                    </div>

                    {/* Emergency Info */}
                    <div className="bg-neutral-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-neutral-900 mb-3">
                        Emergency Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="emergencyContact"
                            className="block text-sm font-medium text-neutral-700"
                          >
                            Emergency contact
                          </label>
                          <input
                            type="text"
                            id="emergencyContact"
                            className={`mt-1 block w-full rounded-md border ${
                              errors.emergencyContact
                                ? "border-error-500"
                                : "border-neutral-300"
                            } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                            {...register("emergencyContact", {
                              required: "Emergency contact is required",
                            })}
                          />
                          {errors.emergencyContact && (
                            <p className="mt-1 text-sm text-error-600">
                              {errors.emergencyContact.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="emergencyPhone"
                            className="block text-sm font-medium text-neutral-700"
                          >
                            Emergency phone
                          </label>
                          <input
                            type="text"
                            id="emergencyPhone"
                            className={`mt-1 block w-full rounded-md border ${
                              errors.emergencyPhone
                                ? "border-error-500"
                                : "border-neutral-300"
                            } py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500`}
                            {...register("emergencyPhone", {
                              required: "Emergency phone is required",
                            })}
                          />
                          {errors.emergencyPhone && (
                            <p className="mt-1 text-sm text-error-600">
                              {errors.emergencyPhone.message}
                            </p>
                          )}
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
                          className="mt-1 block w-full rounded-md border border-neutral-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          {...register("medicalConditions")}
                        />
                        <p className="mt-1 text-xs text-neutral-500">
                          This information will only be shared with your travel
                          companion in case of emergency
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </motion.button>
                  </div>
                </form>
              ) : (
                // View mode rendering (unchanged from your original)
                <div className="px-4 py-5 sm:p-6">
                  {/* ... display-only version remains unchanged ... */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
