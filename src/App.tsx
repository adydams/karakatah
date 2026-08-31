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
import Overview from "./pages/adminDashboard/Overview";
import Finance from "./pages/adminDashboard/Finance";
import AdminHomeLayout from "./pages/adminDashboard/AdminHomeLayout";
import Orders from "./pages/adminDashboard/Orders";
import Categories from "./pages/adminDashboard/Categories";
import Subcategories from "./pages/adminDashboard/Subcategories";
import Brands from "./pages/adminDashboard/Brands";
import Products from "./pages/adminDashboard/Products";
import Customer from "./pages/adminDashboard/Customer";
import Transactions from "./pages/adminDashboard/Transactions";
import Shipment from "./pages/adminDashboard/Shipment";
import AuditTrail from "./pages/adminDashboard/AuditTrail";
import Permissions from "./pages/adminDashboard/Permissions";
import Help from "./pages/adminDashboard/Help";
import Settings from "./pages/adminDashboard/Settings";
import Auth from "./pages/adminDashboard/Auth";
import AdminManagement from "./pages/AdminManagement";
import { LoginProvider } from "./contexts/LoginProvider";
import { ModalProvider } from "./contexts/ModalProvider";
import Modal from "./components/Modal";
import ProtectedRouteAdmin from "./components/adminDashboard/ProtectedRouteAdmin";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import StoreLayout from "./pages/adminDashboard/StoreLayout";
import PickupStations from "./pages/adminDashboard/PickupStations";
import StoreDetails from "./pages/adminDashboard/StoreDetails";
import StoreHome from "./pages/adminDashboard/StoreHome";
import StoreAdd from "./pages/adminDashboard/StoreAdd";
import StoreEdit from "./pages/adminDashboard/StoreEdit";
import BecomeSeller from "./pages/BecomeSeller";
import DriverDashboard from "./pages/DriverDashboard";
import InvoiceTracking from "./pages/InvoiceTracking";
import Profile from "./pages/Profile";
import VendorFinance from "./pages/VendorFinance";

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
        {
          path: "finance",
          element: (
            <ProtectedRoute>
              <VendorFinance />
            </ProtectedRoute>
          ),
        },
        {
          path: "become-a-partner",
          element: <BecomeSeller />,
        },
      ],
    },
    {
      path: "/payment-success",
      element: <PaymentSuccess />,
    },
    {
      path: "/payment-failed",
      element: <PaymentFailed />,
    },
    {
      path: "/invoice/:orderId",
      element: <InvoiceTracking />,
    },
    {
      path: "/driver/dashboard",
      element: (
        <ProtectedRoute>
          <DriverDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
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
        <ProtectedRouteAdmin />
      ),
      children: [
        {
          element: <AdminHomeLayout />,
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
              path: "sub-categories",
              element: <Subcategories />,
            },
            {
              path: "brands",
              element: <Brands />,
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
              path: "stores",
              element: <StoreLayout />,
              children: [
                {
                  index: true,
                  element: <StoreHome />,
                },
                {
                  path: "add",
                  element: <StoreAdd />,
                },
                {
                  path: "edit/:storeId",
                  element: <StoreEdit />,
                },
                {
                  path: ":storeId",
                  element: <StoreDetails />,
                },
              ],
            },
            {
              path: "transactions",
              element: <Transactions />,
            },
            {
              path: "finance",
              element: <Finance />,
            },
            {
              path: "shipment",
              element: <Shipment />,
            },
            {
              path: "pickup-stations",
              element: <PickupStations />,
            },
            {
              path: "audit-trail",
              element: <AuditTrail />,
            },
            {
              path: "permissions",
              element: <Permissions />,
            },
            {
              path: "help",
              element: <Help />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
            {
              path: "admin-management",
              element: <AdminManagement />,
            },
            {
              path: "profile",
              element: <Profile />,
            },
          ],
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
              <Modal />
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
