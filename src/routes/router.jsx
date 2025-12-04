import { api } from "../api";
import { createBrowserRouter, redirect } from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import UrlsPage  from "../pages/UrlsPage/UrlsPage";
import UrlInfoPage  from "../pages/UrlInfoPage/UrlInfoPage";
import AboutPage  from "../pages/AboutPage/AboutPage";
import Layout  from "../components/Layout/Layout";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export async function handleLogin({ request }) {
  const formData = await request.formData();
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  try {
    const result  = await api.auth.login(data);

    localStorage.setItem("authToken", result.token);
    const payload = JSON.parse(atob(result.token.split(".")[1]));

    localStorage.setItem("userId", payload.sub);   
    localStorage.setItem("role", payload.role);  

    return redirect("/urls");
  } catch (err) {

    if (err.response?.status === 400) {
      return { error: err.response.data.error || "Validation error" };
    }

    if (err.response?.status === 401) {
      return { error: "Invalid username or password" };
    }

    return { error: "Unexpected error, please try again later" };
  }
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <LoginPage />, action: handleLogin },
      { path: "urls", element: <UrlsPage /> },
      { path: "urls/:id", element: <UrlInfoPage /> },
      { path: "about", element: <AboutPage /> },
       { path: "*", loader: () => redirect("/urls") },
    ],
  },
]);
