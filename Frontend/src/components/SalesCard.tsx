
import type { ICustomerData } from "../types/customer_type"
import { motion } from "framer-motion"
import { User, MapPin, Phone, Calendar } from "lucide-react"

interface Props {
  sale: ICustomerData
}

const SalesCard = ({ sale }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-slate-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-slate-100 p-2 rounded">
              <User className="h-4 w-4 text-slate-700" />
            </div>
            <h2 className="text-lg font-light text-slate-900">{sale.customerName}</h2>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar size={14} />
          <span className="text-xs font-light">{new Date(sale.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-slate-400" />
          <p className="text-slate-600 font-light">{sale.address}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 font-light mb-1">Product</p>
            <p className="text-sm font-light text-slate-900">{sale.productName}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 font-light mb-1">Quantity</p>
            <p className="text-sm font-light text-slate-900">{sale.quantity}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone size={16} className="text-slate-400" />
          <p className="text-slate-600 font-light">{sale.mobileNumber}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default SalesCard
