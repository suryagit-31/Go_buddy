import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PageTransition from "../components/pagetransition.jsx";
import { Home, Mail, DollarSign, Search, Filter, Loader } from "lucide-react";
import axiosInstance from "../utils/axios";
import useAuthStore from "../store/useAuthstore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HousingPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { is_userlogged } = useAuthStore();
  const navigate = useNavigate();

  // Filter states
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    zipCode: "",
    minRent: "",
    maxRent: "",
    helperType: "",
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch listings from backend
  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await axiosInstance.get(`/housing?${params}`);
      setListings(response.data.listings || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load housing listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(1);
  }, []);

  // Apply filters when search input changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== "") {
        fetchListings(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchListings(1);
    setShowFilters(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      state: "",
      city: "",
      zipCode: "",
      minRent: "",
      maxRent: "",
      helperType: "",
      search: "",
    });
    fetchListings(1);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!is_userlogged) {
      toast.error("Please login to post a listing");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);
      const response = await axiosInstance.post("/housing", data);
      toast.success("Listing created successfully!");
      setListings([response.data.listing, ...listings]);
      setShowForm(false);
      reset();
      fetchListings(1); // Refresh listings
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to create listing. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

          {/* Search and Filter Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by city, state, or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
              {is_userlogged && (
                <motion.button
                  onClick={() => {
                    if (!is_userlogged) {
                      toast.error("Please login to post a listing");
                      navigate("/login");
                      return;
                    }
                    setShowForm(!showForm);
                  }}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showForm ? "Cancel" : "Post a Listing"}
                </motion.button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-white p-6 rounded-lg shadow-soft"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={filters.state}
                    onChange={(e) =>
                      handleFilterChange("state", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                    placeholder="e.g., New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                    placeholder="e.g., Brooklyn"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={filters.zipCode}
                    onChange={(e) =>
                      handleFilterChange("zipCode", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                    placeholder="e.g., 11201"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Min Rent ($)
                  </label>
                  <input
                    type="number"
                    value={filters.minRent}
                    onChange={(e) =>
                      handleFilterChange("minRent", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Max Rent ($)
                  </label>
                  <input
                    type="number"
                    value={filters.maxRent}
                    onChange={(e) =>
                      handleFilterChange("maxRent", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Helper Type
                  </label>
                  <select
                    value={filters.helperType}
                    onChange={(e) =>
                      handleFilterChange("helperType", e.target.value)
                    }
                    className="w-full rounded-md border border-neutral-300 px-3 py-2"
                  >
                    <option value="">All Types</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Paid">Paid</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}

          {/* Create Listing Form */}
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
                      min: { value: 0, message: "Rent must be positive" },
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
                      {...register("contactEmail")}
                      className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                      placeholder="Optional (uses your account email if not provided)"
                    />
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
                    disabled={submitting}
                    className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                  >
                    {submitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Listing"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Listings Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <Home className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-lg text-neutral-600">
                No housing listings found
              </p>
              {is_userlogged && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Be the first to post a listing
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <motion.div
                    key={listing._id}
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

                      <p className="text-neutral-600 mb-4 line-clamp-3">
                        {listing.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center text-neutral-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>${listing.rentPerMonth}/month</span>
                        </div>
                        <div className="flex items-center text-neutral-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <a
                            href={`mailto:${
                              listing.contactEmail || listing.userId?.email
                            }`}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            Contact
                          </a>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
                        Posted on {formatDate(listing.createdAt)}
                      </div>
                    </div>

                    <div className="px-6 py-3 bg-neutral-50 text-xs text-neutral-500">
                      Self-submitted profile. Use your own judgment. We do not
                      verify or endorse helpers.
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => fetchListings(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-neutral-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-neutral-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchListings(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-neutral-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default HousingPage;
