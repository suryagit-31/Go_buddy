import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const FlightSearchForm = ({ compact = false }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: "",
      to: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data) => {
    navigate("/search", { state: { searchData: data } });
  };

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-soft p-6 ${
        compact ? "max-w-2xl mx-auto" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        Search Flights
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div
          className={`grid ${
            compact
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-3"
          } gap-4`}
        >
          <div>
            <label
              htmlFor="from"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              From
            </label>
            <input
              id="from"
              type="text"
              placeholder="City or airport"
              className={`w-full p-3 text-lg rounded-md border ${
                errors.from ? "border-error-500" : "border-neutral-300"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("from", { required: "From location is required" })}
            />
            {errors.from && (
              <p className="mt-1 text-sm text-error-600">
                {errors.from.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="to"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              To
            </label>
            <input
              id="to"
              type="text"
              placeholder="City or airport"
              className={`w-full p-3 text-lg rounded-md border ${
                errors.to ? "border-error-500" : "border-neutral-300"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("to", { required: "To location is required" })}
            />
            {errors.to && (
              <p className="mt-1 text-sm text-error-600">{errors.to.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className={`w-full p-3 text-lg rounded-md border ${
                errors.date ? "border-error-500" : "border-neutral-300"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-error-600">
                {errors.date.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white text-lg font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Search
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FlightSearchForm;
