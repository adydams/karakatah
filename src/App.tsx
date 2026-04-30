import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import HomeLayout from "./pages/HomeLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "./contexts/UserProvider";
import GuestOnly from "./components/GuestsOnly";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./contexts/CartProvider";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutAddress from "./pages/CheckoutAddress";
import PaymentVerify from "./pages/PaymentVerify";
import Overview from "./pages/adminDashboard/Overview";
import AdminHomeLayout from "./pages/adminDashboard/AdminHomeLayout";
import Orders from "./pages/adminDashboard/Orders";
import Categories from "./pages/adminDashboard/Categories";
import Products from "./pages/adminDashboard/Products";
import Customer from "./pages/adminDashboard/Customer";
import Report from "./pages/adminDashboard/Report";
import Transactions from "./pages/adminDashboard/Transactions";
import Shipment from "./pages/adminDashboard/Shipment";
import Help from "./pages/adminDashboard/Help";
import Settings from "./pages/adminDashboard/Settings";
import Auth from "./pages/adminDashboard/Auth";
import { LoginProvider } from "./contexts/LoginProvider";
import { ModalProvider } from "./contexts/ModalProvider";
import ProtectedRouteAdmin from "./components/adminDashboard/ProtectedRouteAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: "products/:name/:id",
          element: <ProductDetail />,
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout/address",
          element: (
            <ProtectedRoute>
              <CheckoutAddress />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/api/payments/verify",
      element: (
        <ProtectedRoute>
          <PaymentVerify />
        </ProtectedRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <GuestOnly>
          <Register />
        </GuestOnly>
      ),
    },
    {
      path: "/login",
      element: (
        <GuestOnly>
          <Login />
        </GuestOnly>
      ),
    },

    {
      path: "/dashboard",
      element: (
        <ProtectedRouteAdmin>
          <AdminHomeLayout />
        </ProtectedRouteAdmin>
      ),
      children: [
        {
          index: true,
          element: <Overview />,
        },
        {
          path: "overview",
          element: <Overview />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "categories",
          element: <Categories />,
        },
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "customers",
          element: <Customer />,
        },
        {
          path: "reports",
          element: <Report />,
        },
        {
          path: "transactions",
          element: <Transactions />,
        },
        {
          path: "shipment",
          element: <Shipment />,
        },
        {
          path: "help",
          element: <Help />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/sign-in",
      element: <Auth />,
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <LoginProvider>
        <UserProvider>
          <ModalProvider>
            <CartProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: "8px" }}
                toastOptions={{
                  success: {
                    duration: 5000,
                  },
                  error: {
                    duration: 6000,
                  },
                  style: {
                    fontSize: "14px",
                    maxWidth: "500px",
                    padding: "8px 24px",
                    backgroundColor: "#f1f5f9",
                  },
                }}
              />
            </CartProvider>
          </ModalProvider>
        </UserProvider>
      </LoginProvider>
    </QueryClientProvider>
  );
}
