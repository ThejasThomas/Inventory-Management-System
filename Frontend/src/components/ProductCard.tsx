
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { IProductData } from "../types/product_types"
import { Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

interface Props {
  product: IProductData
  onDelete: (id: string) => Promise<void>
}

const ProductCard = ({ product, onDelete }: Props) => {
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!product.productId) {
      console.error("Product ID missing")
      return
    }
    try {
      setLoading(true)
      await onDelete(product.productId)
      setConfirmOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between border border-slate-200 hover:border-slate-300"
      >
        <div>
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-base font-semibold text-slate-900 line-clamp-2">{product.name}</h2>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
            >
              Qty: {product.quantity}
            </motion.span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 mb-4">{product.description}</p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold text-slate-900"
          >
            ₹{product.price}
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/edit-product/${product.productId}`)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
          >
            <Edit size={16} />
            Edit
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 transition font-medium"
          >
            <Trash2 size={16} />
            Delete
          </motion.button>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg border border-slate-200"
          >
            <h3 className="text-lg font-semibold text-slate-900">Delete Product?</h3>
            <p className="text-sm text-slate-600 mt-3">
              Are you sure you want to delete <span className="font-medium text-slate-900">{product.name}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
              >
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={handleDelete}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Delete"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default ProductCard
