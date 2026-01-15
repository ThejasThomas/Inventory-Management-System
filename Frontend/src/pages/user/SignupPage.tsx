import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { signup } from "../../service/userservice";
import { signupSchema, type SignupForm } from "../../validation/signup_validation";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [form, setForm] = useState<SignupForm>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupForm, string>>
  >({});

  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const result = signupSchema.safeParse(form);

  if (result.success) {
    setErrors({});
    setIsValid(true);
  } else {
    const fieldErrors: Partial<Record<keyof SignupForm, string>> = {};

    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof SignupForm;
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
      await signup(form);
      alert("Account created successfully 🎉");
      setForm({ fullName: "", email: "", phoneNumber: "", password: "" });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup failed");
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
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl outline-none ${
                  errors.fullName ? "border-red-500" : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

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
                  errors.email ? "border-red-500" : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-xl outline-none ${
                  errors.phoneNumber ? "border-red-500" : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phoneNumber}
              </p>
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
                  errors.password ? "border-red-500" : "focus:ring-2 focus:ring-indigo-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

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
            Sign Up
          </button>
        </form>
      </motion.div>
      <p className="text-center text-sm text-gray-500 mt-6">
  Already have an account?{" "}
  <Link
    to="/login"
    className="text-indigo-600 font-semibold hover:underline"
  >
    Login
  </Link>
</p>

    </div>
  );
};

export default SignUpPage;
