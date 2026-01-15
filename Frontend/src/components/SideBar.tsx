import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Plus,
  Users,
  BarChart3,
  FileText,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../store/slices/user_slice";
import type { AppDispath } from "../store/store";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispath>();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Add Product", path: "/add-product", icon: Plus },
    { label: "Add Customer", path: "/add-customer", icon: Users },
    { label: "View Sales", path: "/sales", icon: ShoppingCart },
    { label: "Item Sale", path: "/item-report", icon: BarChart3 },
    { label: "Sales Report", path: "/sales-report", icon: FileText },
    { label: "Logout", path: "/logout", icon: LogOut },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    if (path === "/logout") {
      setShowLogoutConfirm(true);
      return;
    }
    navigate(path);
  };

  const handleConfirmLogout = () => {
    dispatch(logoutThunk());
    navigate("/login", { replace: true });
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart size={28} />
            Inventory
          </h1>
          <p className="text-gray-300 text-sm mt-1">Management System</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => {
                  handleNavigation(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-indigo-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 p-4 bg-gray-700 rounded-lg text-sm text-center">
          <p className="text-gray-300">Welcome to Inventory</p>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 w-[90%] max-w-sm shadow-xl border border-gray-600">
            <h2 className="text-lg font-semibold text-white mb-2">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;