import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import type { IProductData } from "../../types/product_types";
import { getProductById, editProduct } from "../../service/userservice";
import { toast } from "react-toastify";
import { Loader2, Edit, Package, FileText, Hash, IndianRupee } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<IProductData>({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
  });

  const [original, setOriginal] = useState<IProductData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);

        setForm(res.product);
        setOriginal(res.product);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const isChanged =
    original &&
    (form.name !== original.name ||
      form.description !== original.description ||
      form.quantity !== original.quantity ||
      form.price !== original.price);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "quantity" || name === "price"
          ? Number(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isChanged) return;

    try {
      setSaving(true);
      await editProduct(id, form);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="animate-spin text-slate-600" size={40} />
            <p className="text-slate-700 font-light">Loading product details...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <p className="text-red-600 font-light">{error}</p>
        </motion.div>
      </div>
    );
  }

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
              <Edit className="text-slate-700 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">Edit Product</h1>
          <p className="text-slate-500 mt-2 font-light">Update your product details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Product Name</label>
            <div className="relative">
              <Package className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter product description"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none resize-none border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-light text-slate-700 mb-2">Quantity</label>
              <div className="relative">
                <Hash className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none appearance-none border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-slate-700 mb-2">Price</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none appearance-none border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>
          </div>

          {!isChanged && (
            <p className="text-center text-sm text-slate-500 font-light mt-4">
              Edit any field to enable updates
            </p>
          )}

          {isChanged && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={saving}
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-light transition-all disabled:opacity-60 mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin mr-2 inline" size={18} />
                  Updating...
                </>
              ) : (
                "Update Product"
              )}
            </motion.button>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default EditProductPage;