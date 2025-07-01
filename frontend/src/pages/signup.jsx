import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PageTransition from "../components/pagetransition.jsx";
import { useAuth } from "../context/authcontext.jsx";
import { EyeOff, Eye } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formdata, setformdata] = useState({
    Fullname: "",
    email: "",
    phonenumber: "",
    age: "",
    password: "",
    confirmpassword: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      navigate("/");
    } catch (err) {
      setError("Failed to create an account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              Create your account
            </h2>
            <p className="mt-2 text-neutral-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Log in
              </Link>
            </p>
          </div>

          <motion.div
            className="mt-8 bg-white py-8 px-4 shadow-soft sm:rounded-lg sm:px-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error && (
              <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Full name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        Fullname: e.target.value,
                      });
                    }}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.name ? "border-error-500" : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        email: e.target.value,
                      });
                    }}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.email ? "border-error-500" : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        phonenumber: e.target.value,
                      });
                    }}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.phone ? "border-error-500" : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
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
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    type="number"
                    autoComplete="age"
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        age: e.target.value,
                      });
                    }}
                    min="18"
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.age ? "border-error-500" : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("age", {
                      required: "Age is required",
                      min: {
                        value: 18,
                        message: "Must be 18 or older",
                      },
                    })}
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.age.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        password: e.target.value,
                      });
                    }}
                    autoComplete="off"
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.password
                        ? "border-error-500"
                        : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-base-content/40 opacity-30" />
                    ) : (
                      <Eye className="w-5 h-5 text-base-content/40 opacity-30 " />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="off"
                    onChange={(e) => {
                      setformdata({
                        ...formdata,
                        confirmPassword: e.target.value,
                      });
                    }}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.confirmPassword
                        ? "border-error-500"
                        : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-neutral-700"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SignupPage;
