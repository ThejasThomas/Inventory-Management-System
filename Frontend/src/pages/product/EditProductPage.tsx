import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import type { IProductData } from "../../types/product_types";
import { getProductById, editProduct } from "../../service/userservice";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import {
  addProductSchema,
  type AddProductForm,
} from "../../validation/add_product_validation";

type EditProductFormState = {
  name: string;
  description: string;
  quantity: number | "";
  price: number | "";
};

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<EditProductFormState>({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });

  const [original, setOriginal] = useState<IProductData | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddProductForm, string>>
  >({});

  const [touched, setTouched] = useState<
    Partial<Record<keyof AddProductForm, boolean>>
  >({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);

        const product: IProductData = res.product;

        setForm({
          name: product.name,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
        });

        setOriginal(product);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  const isChanged =
    original &&
    (form.name !== original.name ||
      form.description !== original.description ||
      Number(form.quantity) !== original.quantity ||
      Number(form.price) !== original.price);

  const isValid = Object.keys(errors).length === 0;

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
    if (!id || !isChanged || !isValid) return;

    const payload: IProductData = {
      name: form.name,
      description: form.description,
      quantity: Number(form.quantity),
      price: Number(form.price),
    };

    try {
      setSaving(true);
      await editProduct(id, payload);
      toast.success("Product updated successfully");
      navigate("/home");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-light text-center mb-8">Edit Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}
          <div>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Product name"
              className={`w-full p-3 border rounded-lg ${
                touched.name && errors.name ? "border-red-400" : "border-slate-200"
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Description"
              className={`w-full p-3 border rounded-lg ${
                touched.description && errors.description
                  ? "border-red-400"
                  : "border-slate-200"
              }`}
            />
            {touched.description && errors.description && (
              <p className="text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* QUANTITY */}
          <input
            type="number"
            min={1}
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Quantity (min 1)"
            className="w-full p-3 border rounded-lg"
          />

          {/* PRICE */}
          <input
            type="number"
            min={11}
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Price (>10)"
            className="w-full p-3 border rounded-lg"
          />

          <motion.button
            disabled={!isChanged || !isValid || saving}
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Product"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductPage;
 