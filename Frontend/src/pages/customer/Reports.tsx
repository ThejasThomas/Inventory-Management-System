"use client";

import { useEffect, useState } from "react";
import { salesReport } from "../../service/userservice";
import type { ISalesReportEntity } from "../../types/sales_report_type";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Download } from "lucide-react";
import * as XLSX from "xlsx"; // Install via: npm install xlsx
import jsPDF from "jspdf"; // Install via: npm install jspdf
import autoTable from "jspdf-autotable"; // Install via: npm install jspdf-autotable (for table support)

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

const SalesReportPage = () => {
  const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily");
  const [data, setData] = useState<ISalesReportEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [type]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await salesReport(type);
      setData(formatData(res.report, type));
    } catch (err) {
      console.error("Failed to fetch report", err);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (
    report: ISalesReportEntity[],
    type: "daily" | "weekly" | "monthly"
  ) => {
    return report.map((r) => {
      let label = "";
      if (type === "daily") label = `${r.period.day}/${r.period.month}`;
      if (type === "weekly") label = `Week ${r.period.week}`;
      if (type === "monthly") label = `${r.period.month}/${r.period.year}`;
      return { ...r, label };
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    if (data.length === 0) return;

    const exportData = data.map((item) => ({
      "Total Sales": item.totalSales,
      "Total Quantity": item.totalQuantity,
      // Add more fields from ISalesReportEntity if needed (e.g., period details)
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Report");
    XLSX.writeFile(wb, `Sales_Report_${type}.xlsx`);
  };

  // Export to PDF
  const exportToPDF = () => {
    if (data.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(
      `Sales Report - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      14,
      20
    );

    // Add summary
    const totalSales = data.reduce((a, b) => a + b.totalSales, 0);
    const totalQuantity = data.reduce((a, b) => a + b.totalQuantity, 0);
    doc.setFontSize(12);
    doc.text(`Total Sales: ${totalSales}`, 14, 40);
    doc.text(`Total Quantity: ${totalQuantity}`, 14, 50);

    // Add table
    autoTable(doc, {
      head: [[ "Total Sales", "Total Quantity"]],
      body: data.map((item) => [item.totalSales, item.totalQuantity]),
      startY: 60,
      theme: "grid",
      styles: { fontSize: 10 },
    });

    doc.save(`Sales_Report_${type}.pdf`);
  };

  // Print the page
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-3 rounded-lg">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-light text-slate-900 tracking-tight">
              Sales Report
            </h1>
            <p className="text-slate-500 font-light mt-1">
              Analyze your sales performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.select
            whileHover={{ scale: 1.02 }}
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg font-light text-slate-900 cursor-pointer hover:border-slate-300 transition-all"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </motion.select>

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
                disabled={loading || data.length === 0}
              >
                Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                title="PDF"
                disabled={loading || data.length === 0}
              >
                PDF
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-pulse text-slate-400 font-light">
            Loading report...
          </div>
        </div>
      )}

      {!loading && data.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-2xl shadow-sm"
        >
          <p className="text-slate-500 font-light">No sales data available</p>
        </motion.div>
      )}

      {!loading && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                label: "Total Sales",
                value: data.reduce((a, b) => a + b.totalSales, 0),
                icon: TrendingUp,
              },
              {
                label: "Total Quantity",
                value: data.reduce((a, b) => a + b.totalQuantity, 0),
                icon: BarChart3,
              },
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
                    <p className="text-sm font-light text-slate-600 mb-2">
                      {card.label}
                    </p>
                    <p className="text-3xl font-light text-slate-900">
                      {card.value}
                    </p>
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
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 mb-8"
          >
            <h2 className="text-xl font-light text-slate-900 mb-6">
              Sales Trend
            </h2>
            <div className="w-full h-[350px]">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#1e293b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
          >
            <h2 className="text-xl font-light text-slate-900 mb-6">
              Quantity Sold
            </h2>
            <div className="w-full h-[350px]">
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="totalQuantity"
                    fill="#1e293b"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </>
      )}

      {/* Print Styles - Hide non-essential elements when printing */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .min-h-screen, .min-h-screen * { visibility: visible; }
          .min-h-screen { position: absolute; left: 0; top: 0; width: 100%; }
          .flex.items-center.justify-between { page-break-inside: avoid; }
          .grid { page-break-inside: avoid; }
          button, select { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SalesReportPage;
