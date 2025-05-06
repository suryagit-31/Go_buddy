import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PageTransition from "../components/pagetransition.jsx";
import { Home, Mail, DollarSign } from "lucide-react";

const mockListings = [
  {
    id: "1",
    state: "New York",
    city: "Brooklyn",
    zipCode: "11201",
    rentPerMonth: 800,
    description:
      "Seeking a companion to share a 2-bedroom apartment. Quiet neighborhood, close to public transport.",
    contactEmail: "jane@example.com",
    helperType: "Volunteer",
    createdAt: "2024-03-15",
  },
  // Add more mock listings as needed
];

const HousingPage = () => {
  const [listings, setListings] = useState(mockListings);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const newListing = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setListings([newListing, ...listings]);
    setShowForm(false);
    reset();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900">
              Find Housing Companions
            </h1>
            <p className="mt-2 text-lg text-neutral-600">
              Connect with trusted companions for shared housing
            </p>
          </div>

          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="mb-8 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showForm ? "Cancel" : "Post a Listing"}
          </motion.button>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-white p-6 rounded-lg shadow-soft"
            >
              <h2 className="text-xl font-semibold mb-4">
                Post a Roommate Listing
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      State
                    </label>
                    <input
                      type="text"
                      {...register("state", { required: "State is required" })}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      City
                    </label>
                    <input
                      type="text"
                      {...register("city", { required: "City is required" })}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      {...register("zipCode", {
                        required: "Zip code is required",
                      })}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Rent Per Month ($)
                  </label>
                  <input
                    type="number"
                    {...register("rentPerMonth", {
                      required: "Rent amount is required",
                    })}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  />
                  {errors.rentPerMonth && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.rentPerMonth.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Room Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      {...register("contactEmail", {
                        required: "Email is required",
                      })}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    />
                    {errors.contactEmail && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700">
                      Helper Type
                    </label>
                    <select
                      {...register("helperType", {
                        required: "Helper type is required",
                      })}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                    >
                      <option value="Volunteer">Volunteer</option>
                      <option value="Paid">Paid</option>
                      <option value="Student">Student</option>
                    </select>
                    {errors.helperType && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.helperType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-md">
                  <p>
                    This is a self-submitted profile. Please use your own
                    judgment before confirming travel or accommodation. We do
                    not verify or endorse helpers.
                  </p>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Post Listing
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                className="bg-white rounded-lg shadow-soft overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {listing.city}, {listing.state}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
                      {listing.helperType}
                    </span>
                  </div>

                  <p className="text-neutral-600 mb-4">{listing.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-neutral-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>${listing.rentPerMonth}/month</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Mail className="h-4 w-4 mr-2" />
                      <a
                        href={`mailto:${listing.contactEmail}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Contact
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                    Posted on {listing.createdAt}
                  </div>
                </div>

                <div className="px-6 py-3 bg-neutral-50 text-xs text-neutral-500">
                  Self-submitted profile. Use your own judgment. We do not
                  verify or endorse helpers.
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HousingPage;
