import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { IProductData } from "../../types/product_types";
import { getProductById, editProduct } from "../../service/userservice";
import { toast } from "react-toastify";

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

      toast.success(" Product updated successfully");
      navigate("/home");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading product...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Edit Product</h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="w-full border p-2 rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full border p-2 rounded-lg"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded-lg"
        />

        {/* ✅ Only active when changed */}
        {isChanged && (
          <button
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            {saving ? "Saving..." : "Update Product"}
          </button>
        )}

        {!isChanged && (
          <p className="text-center text-sm text-gray-400">
            Edit any field to enable update
          </p>
        )}
      </form>
    </div>
  );
};

export default EditProductPage;
