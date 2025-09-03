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
      ],
    },
    {
      path: "/register",
      element: <GuestOnly><Register /></GuestOnly>,
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
      <ReactQueryDevtools initialIsOpen={false} />
      <UserProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
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
      </UserProvider>
    </QueryClientProvider>
  );
}
