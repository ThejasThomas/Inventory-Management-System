"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteProduct, getMyProducts } from "../../service/userservice"
import type { IProductData } from "../../types/product_types"
import ProductCard from "../../components/ProductCard"
import { useDispatch } from "react-redux"
import { setProducts } from "../../store/slices/product_slice"
import { Package, Loader } from "lucide-react"
import MainLayout from "../../components/MainLayout"

const LIMIT = 6

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setLocalProducts] = useState<IProductData[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const totalPages = Math.ceil(total / LIMIT)

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getMyProducts({ page, limit: LIMIT })
      setLocalProducts(res.products)
      dispatch(setProducts(res.products))
      setTotal(res.total)
    } catch (error) {
      console.error("Failed to fetch products", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setLocalProducts((prev) => {
        const updated = prev.filter((p) => p.productId !== id)
        if (updated.length === 0 && page > 1) {
          setPage((p) => p - 1)
        }
        return updated
      })
      setTotal((prev) => prev - 1)
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-indigo-600" size={40} />
            Inventory Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage your products and inventory efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
            <p className="text-indigo-100 text-sm font-medium">Total Products</p>
            <p className="text-3xl font-bold mt-2">{total}</p>
          </div>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => navigate("/add-product")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg font-medium"
        >
          <span>➕</span> Add New Product
        </button>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-indigo-600 mr-2" size={32} />
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No products added yet</p>
            <p className="text-gray-500 mt-2">Start by adding your first product</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} onDelete={handleDelete} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pb-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  ⬅ Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        p === page
                          ? "bg-indigo-600 text-white"
                          : "bg-white border-2 border-gray-300 hover:border-indigo-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  Next ➡
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default HomePage
