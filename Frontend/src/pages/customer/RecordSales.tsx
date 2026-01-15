
import { useEffect, useState } from "react"
import { getCustomers } from "../../service/userservice"
import type { ICustomerData } from "../../types/customer_type"
import SalesCard from "../../components/SalesCard"
import { motion } from "framer-motion"
import { ShoppingBag } from "lucide-react"

const LIMIT = 6

const SalesPage = () => {
  const [sales, setSales] = useState<ICustomerData[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const totalPages = Math.ceil(total / LIMIT)

  useEffect(() => {
    fetchSales()
  }, [page])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const res = await getCustomers({ page, limit: LIMIT })
      setSales(res.customers)
      setTotal(res.total)
    } catch (err) {
      console.error("Failed to fetch sales", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-slate-900 p-3 rounded-lg">
          <ShoppingBag className="text-white h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-light text-slate-900 tracking-tight">Sales Records</h1>
          <p className="text-slate-500 font-light mt-1">Manage customer transactions</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-slate-400 font-light">Loading sales...</div>
        </div>
      )}

      {!loading && sales.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl shadow-sm"
        >
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-light">No sales records found.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sales.map((sale, i) => (
          <motion.div
            key={sale.customerId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <SalesCard sale={sale} />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg font-light text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
          >
            Previous
          </motion.button>

          <span className="font-light text-slate-600">
            Page <span className="text-slate-900 font-semibold">{page}</span> of{" "}
            <span className="text-slate-900 font-semibold">{totalPages}</span>
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg font-light text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default SalesPage
