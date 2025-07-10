import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import PageTransition from "../components/pagetransition.jsx";
import useAuthStore from "../store/useAuthstore.js";
import { EyeOff, Eye } from "lucide-react";
const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { Login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await Login(data);
    } catch (err) {
      setError("Invalid email or password");
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
              Log in to your account
            </h2>
            <p className="mt-2 text-neutral-600">
              Or{" "}
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                create a new account
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
                    autoComplete="current-password"
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.password
                        ? "border-error-500"
                        : "border-neutral-300"
                    } rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-base`}
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.password.message}
                    </p>
                  )}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-base-content/40 opacity-30" />
                    ) : (
                      <Eye className="w-5 h-5 text-base-content/40 opacity-30" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 accent-primary-600 focus:ring-blue-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-neutral-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
