import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { login } from "../../service/userservice";
import { loginSchema } from "../../validation/login_validation";
import type { LoginForm } from "../../validation/login_validation";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/user_slice";

const LoginPage = () => {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginForm, string>>
  >({});

  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const result = loginSchema.safeParse(form);

    if (result.success) {
      setErrors({});
      setIsValid(true);
    } else {
      const fieldErrors: Partial<Record<keyof LoginForm, string>> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginForm;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsValid(false);
    }
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      setLoading(true);
      setApiError(null);
      const res = await login(form);

      if (res.success) {
        dispatch(setUser(res.user));
        navigate("/home", { replace: true });
      } else {
        setApiError(res.message || "Login failed");
      }
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Login to continue 🚀</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-2 border rounded-xl outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          {/* API error */}
          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
              {apiError}
            </p>
          )}

          {/* Submit */}
          <button
            disabled={!isValid || loading}
            className={`w-full flex justify-center items-center gap-2 py-2 rounded-xl font-semibold transition ${
              isValid
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/" className="text-indigo-600 font-semibold cursor-pointer">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
