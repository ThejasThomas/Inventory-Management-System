import type React from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Package, FileText, Hash, IndianRupee } from "lucide-react";
import {
  addProductSchema,
  type AddProductForm,
} from "../../validation/add_product_validation";
import { addProduct } from "../../service/userservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<AddProductForm>({
    name: "",
    description: "",
    quantity: 0,
    price: 1,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddProductForm, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof AddProductForm, boolean>>
  >({});
  // const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
  if (Object.keys(touched).length === 0) return;

  const result = addProductSchema.safeParse({
    ...form,
    quantity: Number(form.quantity),
    price: Number(form.price),
  });

  if (result.success) {
    setErrors({});
  } else {
    const fieldErrors: Partial<Record<keyof AddProductForm, string>> = {};
    result.error.issues.forEach((err) => {
      const field = err.path[0] as keyof AddProductForm;
      fieldErrors[field] = err.message;
    });
    setErrors(fieldErrors);
  }
}, [form, touched]);


  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  if (name === "quantity" || name === "price") {
    if (value === "") {
      setForm((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const num = Number(value);
    if (!isNaN(num)) {
      setForm((prev) => ({ ...prev, [name]: num }));
    }
    return;
  }

  setForm((prev) => ({ ...prev, [name]: value }));
};


  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setTouched({ name: true, description: true, quantity: true, price: true });

  const payload = {
    ...form,
    quantity: Number(form.quantity),
    price: Number(form.price),
  };

  const result = addProductSchema.safeParse(payload);
  if (!result.success) return;

  try {
    setLoading(true);
    setApiMessage(null);

    const response = await addProduct(payload); // matches IProductData
    toast.success(response?.message || "Product added successfully");

    setTimeout(() => navigate("/home"), 800);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to add product");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-100 p-4 rounded-full">
              <Package className="text-slate-700 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">
            Add New Product
          </h1>
          <p className="text-slate-500 mt-2 font-light">
            Create a new product inventory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Product Name
            </label>
            <div className="relative">
              <Package className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter product name"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none ${
                  touched.name && errors.name
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-xs text-red-600 mt-1 font-light">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                placeholder="Enter product description"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none resize-none ${
                  touched.description && errors.description
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.description && errors.description && (
              <p className="text-xs text-red-600 mt-1 font-light">
                {errors.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Quantity
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none appearance-none ${
                  touched.quantity && errors.quantity
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.quantity && errors.quantity && (
              <p className="text-xs text-red-600 mt-1 font-light">
                {errors.quantity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">
              Price
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none appearance-none ${
                  touched.price && errors.price
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.price && errors.price && (
              <p className="text-xs text-red-600 mt-1 font-light">
                {errors.price}
              </p>
            )}
          </div>

          {apiMessage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-light text-slate-600"
            >
              {apiMessage}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg font-light transition-all bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 mt-8"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Adding..." : "Add Product"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductPage;
