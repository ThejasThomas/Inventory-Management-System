
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/user/SignupPage"
import LoginPage from "./pages/user/LoginPage"
import HomePage from "./pages/user/HomePage"
import ProtectedRoute from "./utils/protected/ProtectRoute"
// import { useDispatch } from "react-redux"
// import type { AppDispath } from "./store/store"
// import { useEffect } from "react"
// import { refreshSessionThunk } from "./store/slices/user_slice"
import AddProductPage from "./pages/product/AddProductPage"
import EditProductPage from "./pages/product/EditProductPage"
import AddCustomerPage from "./pages/customer/AddCustomerPage"
import SalesPage from "./pages/customer/RecordSales"
import SalesReportPage from "./pages/customer/Reports"
import ItemReportPage from "./pages/customer/ItemReportPage"
import MainLayout from "./components/MainLayout"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import PublicRoute from "./utils/protected/public_route"


function App() {
  // const dispatch = useDispatch<AppDispath>()

  // useEffect(() => {
  //   dispatch(refreshSessionThunk())
  // }, [dispatch])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <PublicRoute>
      <SignUpPage />
    </PublicRoute>} />
          <Route path="/login" element={<PublicRoute>
      <LoginPage />
    </PublicRoute>} />

          {/* Protected routes with MainLayout */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddProductPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <EditProductPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-customer"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AddCustomerPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-report"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <SalesReportPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/item-report"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ItemReportPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
       <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="colored"
      />
    </>
  )
}

export default App
