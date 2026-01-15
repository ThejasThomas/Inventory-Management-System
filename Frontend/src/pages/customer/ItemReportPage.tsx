"use client"

import { useEffect, useState } from "react"
import { itemReport } from "../../service/userservice"
import type { IItemReportEntity } from "../../types/item_report_type"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { motion } from "framer-motion"
import { Package, ShoppingCart, TrendingUp, Download } from "lucide-react"
import * as XLSX from "xlsx" // Install via: npm install xlsx
import jsPDF from "jspdf" // Install via: npm install jspdf
import autoTable from "jspdf-autotable" // Install via: npm install jspdf-autotable (for table support)

const ItemReportPage = () => {
  const [items, setItems] = useState<IItemReportEntity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItemReport()
  }, [])

  const fetchItemReport = async () => {
    try {
      setLoading(true)
      const res = await itemReport()
      setItems(res.items)
    } catch (error) {
      console.error("Failed to fetch item report", error)
    } finally {
      setLoading(false)
    }
  }

  // Export to Excel
  const exportToExcel = () => {
    if (items.length === 0) return

    const exportData = items.map((item) => ({
      Product: item.productName,
      "Total Orders": item.totalSales,
      "Quantity Sold": item.totalQuantity,
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Item Report")
    XLSX.writeFile(wb, "Item_Report.xlsx")
  }

  // Export to PDF
  const exportToPDF = () => {
    if (items.length === 0) return

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Item Sales Report", 14, 20)

    // Add summary
    const totalProducts = items.length
    const totalSales = items.reduce((sum, i) => sum + i.totalSales, 0)
    const totalQuantity = items.reduce((sum, i) => sum + i.totalQuantity, 0)
    doc.setFontSize(12)
    doc.text(`Total Products: ${totalProducts}`, 14, 40)
    doc.text(`Total Orders: ${totalSales}`, 14, 50)
    doc.text(`Total Quantity Sold: ${totalQuantity}`, 14, 60)

    // Add table
    autoTable(doc, {
      head: [["Product", "Total Orders", "Quantity Sold"]],
      body: items.map((item) => [item.productName, item.totalSales, item.totalQuantity]),
      startY: 70,
      theme: "grid",
      styles: { fontSize: 10 },
    })

    doc.save("Item_Report.pdf")
  }

  // Print the page
  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-slate-400 font-light">Loading report...</div>
      </div>
    )
  }

  const totalProducts = items.length
  const totalSales = items.reduce((sum, i) => sum + i.totalSales, 0)
  const totalQuantity = items.reduce((sum, i) => sum + i.totalQuantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-3 rounded-lg">
            <Package className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">Item Sales Report</h1>
            <p className="text-slate-500 font-light mt-1">Product performance analytics</p>
          </div>
        </div>

        {/* Export Buttons */}
        <motion.div
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Download className="text-slate-500 h-4 w-4" />
          <div className="flex gap-1">
            <button
              onClick={handlePrint}
              className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              title="Print"
            >
              Print
            </button>
            <button
              onClick={exportToExcel}
              className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              title="Excel"
              disabled={items.length === 0}
            >
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              title="PDF"
              disabled={items.length === 0}
            >
              PDF
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Products", value: totalProducts, icon: Package },
          { label: "Total Orders", value: totalSales, icon: ShoppingCart },
          { label: "Total Quantity Sold", value: totalQuantity, icon: TrendingUp },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-light text-slate-600 mb-2">{card.label}</p>
                <p className="text-3xl font-light text-slate-900">{card.value}</p>
              </div>
              <div className="bg-slate-100 p-3 rounded-lg">
                <card.icon className="text-slate-700 h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
      >
        <h2 className="text-xl font-light text-slate-900 mb-6">Best Selling Products</h2>

        {items.length === 0 ? (
          <p className="text-center text-slate-500 font-light py-8">No sales data available.</p>
        ) : (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="productName" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
                <Bar dataKey="totalQuantity" fill="#1e293b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 overflow-x-auto"
      >
        <h2 className="text-xl font-light text-slate-900 mb-6">Item Details</h2>

        {items.length === 0 ? (
          <p className="text-center text-slate-500 font-light py-8">No items available.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-sm font-light text-slate-600">Product</th>
                <th className="px-6 py-3 text-left text-sm font-light text-slate-600">Total Orders</th>
                <th className="px-6 py-3 text-left text-sm font-light text-slate-600">Quantity Sold</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <motion.tr
                  key={item.productName}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-light text-slate-900">{item.productName}</td>
                  <td className="px-6 py-4 font-light text-slate-600">{item.totalSales}</td>
                  <td className="px-6 py-4 font-light text-slate-600">{item.totalQuantity}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .min-h-screen, .min-h-screen * { visibility: visible; }
          .min-h-screen { position: absolute; left: 0; top: 0; width: 100%; }
          .flex.items-center.justify-between { page-break-inside: avoid; }
          .grid { page-break-inside: avoid; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  )
}

export default ItemReportPage