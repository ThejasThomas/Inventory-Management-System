import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteProduct, getMyProducts } from "../../service/userservice"
import type { IProductData } from "../../types/product_types"
import ProductCard from "../../components/ProductCard"
import { useDispatch } from "react-redux"
import { setProducts } from "../../store/slices/product_slice"
import { Package, Loader, Search, Plus } from "lucide-react"
import MainLayout from "../../components/MainLayout"

const LIMIT = 6
const DEBOUNCE_DELAY = 500

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setLocalProducts] = useState<IProductData[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const totalPages = Math.ceil(total / LIMIT)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    fetchProducts()
  }, [page, debouncedSearch])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getMyProducts({ page, limit: LIMIT, search: debouncedSearch })
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600 mt-1">Manage your products and inventory</p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Package className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (e.target.value === "") {
                setPage(1)
              }
            }}
            className="w-full md:w-96 pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              {search ? "Try adjusting your search criteria" : "Get started by adding your first product"}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/add-product")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
              >
                <Plus size={20} />
                Add Product
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.productId}
                  product={product} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        p === page
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                >
                  Next
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