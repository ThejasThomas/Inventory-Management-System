import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { login } from "../../service/userservice";
import { loginSchema } from "../../validation/login_validation";
import type { LoginForm } from "../../validation/login_validation";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/user_slice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginForm, boolean>>
  >({});

  useEffect(() => {
    const result = loginSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      setIsValid(true);
    } else {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginForm;
        if (touched[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsValid(false);
    }
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isValid) return;

    try {
      setLoading(true);
      setApiError(null);
      const res = await login(form);
      console.log('ress',res)
      if (res.success) {
        dispatch(setUser(res.user));
        navigate("/home", { replace: true });
      } else {
        toast.error(res.message || "Invalid email or password", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 overflow-hidden">
      <div className="w-full max-w-6xl h-full flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Left Side: Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 h-[70vh] lg:h-[80vh] max-h-[500px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden relative"
        >
          {/* Different Image: Modern dashboard/secure access theme - Replace with your own */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')",
            }}
          ></div>
          <div className="relative z-10 text-center text-white px-6">
            <h2 className="text-4xl font-bold mb-4">Access InventoryPro</h2>
            <p className="text-xl font-light opacity-90">
              Securely manage your inventory with advanced analytics and
              real-time insights.
            </p>
            {/* Optional: Add a subtle icon or logo here */}
            <div className="mt-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                {/* Add your logo icon here */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2 max-w-md bg-white rounded-3xl shadow-2xl p-6 lg:p-8 flex flex-col justify-center h-[70vh] lg:h-[80vh] max-h-[500px]"
        >
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 font-light text-sm lg:text-base">
              Login to your InventoryPro dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 lg:space-y-6 flex-1"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-2xl outline-none transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <span>•</span> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-2xl outline-none transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 bg-gray-50"
                  }`}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <span>•</span> {errors.password}
                </p>
              )}
            </div>

            {/* API error */}
            {apiError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-2xl border border-red-200">
                {apiError}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={!isValid || loading}
              className={`w-full flex justify-center items-center gap-2 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-200 transform ${
                isValid && !loading
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-200">
            Don’t have an account?{" "}
            <Link
              to="/"
              className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
