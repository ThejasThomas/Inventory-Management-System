"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { addCustomer, getMyProducts } from "../../service/userservice"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../../store/store"
import { addCustomerSchema, type AddCustomerForm } from "../../validation/customer_validation"
import { setProducts } from "../../store/slices/product_slice"
import { motion } from "framer-motion"
import { User, MapPin, Phone, Package, AlertCircle } from "lucide-react"

const AddCustomerPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const reduxProducts = useSelector((state: RootState) => state.products.products)
  const [products, setProductsLocal] = useState(reduxProducts)

  const [form, setForm] = useState<AddCustomerForm>({
    customerName: "",
    address: "",
    mobileNumber: "",
    productName: "",
    quantity: 1,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof AddCustomerForm, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof AddCustomerForm, boolean>>>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (reduxProducts.length > 0) {
      setProductsLocal(reduxProducts)
      return
    }

    const fetchProducts = async () => {
      try {
        const res = await getMyProducts({ page: 1, limit: 100 })
        setProductsLocal(res.products)
        dispatch(setProducts(res.products))
      } catch (err) {
        console.error("Failed to load products")
      }
    }

    fetchProducts()
  }, [reduxProducts, dispatch])

  useEffect(() => {
    if (Object.keys(touched).length === 0) return

    const result = addCustomerSchema.safeParse(form)

    if (result.success) {
      setErrors({})
    } else {
      const fieldErrors: Partial<Record<keyof AddCustomerForm, string>> = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof AddCustomerForm
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
    }
  }, [form, touched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev: AddCustomerForm) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({
      customerName: true,
      address: true,
      mobileNumber: true,
      productName: true,
      quantity: true,
    })

    const result = addCustomerSchema.safeParse(form)
    if (!result.success) return

    try {
      setLoading(true)
      setApiError(null)
      await addCustomer(form)
      navigate("/home")
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Failed to add customer")
    } finally {
      setLoading(false)
    }
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
              <User className="text-slate-700 h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">Add Customer</h1>
          <p className="text-slate-500 mt-2 font-light">Create a new customer record</p>
        </div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-sm text-red-700 font-light">{apiError}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Customer Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter customer name"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none ${
                  touched.customerName && errors.customerName
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.customerName && errors.customerName && (
              <p className="text-xs text-red-600 mt-1 font-light">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter address"
                rows={3}
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none resize-none ${
                  touched.address && errors.address
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.address && errors.address && (
              <p className="text-xs text-red-600 mt-1 font-light">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                name="mobileNumber"
                value={form.mobileNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter mobile number"
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none ${
                  touched.mobileNumber && errors.mobileNumber
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              />
            </div>
            {touched.mobileNumber && errors.mobileNumber && (
              <p className="text-xs text-red-600 mt-1 font-light">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Product</label>
            <div className="relative">
              <Package className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <select
                name="productName"
                value={form.productName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none appearance-none ${
                  touched.productName && errors.productName
                    ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                    : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
                }`}
              >
                <option value="">Select a product</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {touched.productName && errors.productName && (
              <p className="text-xs text-red-600 mt-1 font-light">{errors.productName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-light text-slate-700 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              min={1}
              value={form.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg font-light transition-all outline-none ${
                touched.quantity && errors.quantity
                  ? "border-red-300 focus:bg-red-50 focus:ring-red-500"
                  : "border-slate-200 focus:bg-white focus:ring-2 focus:ring-slate-300"
              }`}
            />
            {touched.quantity && errors.quantity && (
              <p className="text-xs text-red-600 mt-1 font-light">{errors.quantity}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-light transition-all disabled:opacity-60 mt-8"
          >
            {loading ? "Saving..." : "Add Customer"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default AddCustomerPage
