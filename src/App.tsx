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
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <UserProvider>
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
      </UserProvider>
    </QueryClientProvider>
  );
}
