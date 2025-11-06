import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Dashboard, Products } from "./pages";
import { Layout, ThemeProvider } from "./components";
import "./App.css";

export function App() {
  return (
    <ThemeProvider>
        <Routes>
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Navigate to="/inventory/products" replace />} />
            <Route path="/inventory/products" element={<Products />} />
            <Route path="/inventory/categories" element={<div>Categories</div>} />
            <Route path="/inventory/suppliers" element={<div>Suppliers</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
    </ThemeProvider>
  );
}
