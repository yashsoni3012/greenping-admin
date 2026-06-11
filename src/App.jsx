import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Analytics from './pages/Analytics'
import Products from './pages/Products'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Faq from './pages/Faq'
import ContactUs from './pages/ContactUs'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="faq" element={<Faq />} />
          <Route path="contact" element={<ContactUs />} />
          {/* <Route path="users" element={<Users />} /> */}
          {/* <Route path="analytics" element={<Analytics />} /> */}
          {/* <Route path="products" element={<Products />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
