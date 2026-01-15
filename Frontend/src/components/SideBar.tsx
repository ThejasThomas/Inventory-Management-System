
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Home, Plus, Users, BarChart3, FileText, ShoppingCart } from "lucide-react"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Add Product", path: "/add-product", icon: Plus },
    { label: "Add Customer", path: "/add-customer", icon: Users },
    { label: "View Sales", path: "/sales", icon: ShoppingCart },
    { label: "Item Sale", path: "/item-report", icon: BarChart3 },
    { label: "Sales Report", path: "/sales-report", icon: FileText },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-indigo-500">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart size={28} />
            Inventory
          </h1>
          <p className="text-indigo-200 text-sm mt-1">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active ? "bg-white text-indigo-600 shadow-lg" : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full" />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4 p-4 bg-indigo-500 rounded-lg text-sm text-center">
          <p className="text-indigo-100">Welcome to Inventory</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
