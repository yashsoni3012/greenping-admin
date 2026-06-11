// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import {
//   Leaf, Eye, EyeOff, Lock, Mail,
//   User, Phone, AlertCircle, CheckCircle
// } from 'lucide-react'

// export default function Login() {
//   const { user, loginApi } = useAuth()
//   const navigate = useNavigate()

//   const [isRegister, setIsRegister] = useState(false)
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     password: '',
//     confirmPassword: '',
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (user) navigate('/dashboard', { replace: true })
//   }, [user, navigate])

//   const handleChange = (e) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
//     setError('')
//     setSuccess('')
//   }

//   const validateLogin = () => {
//     if (!form.email || !form.password) {
//       setError('Please fill in all fields.')
//       return false
//     }
//     return true
//   }

//   const validateRegister = () => {
//     if (!form.name || !form.email || !form.mobile || !form.password || !form.confirmPassword) {
//       setError('All fields are required.')
//       return false
//     }
//     if (form.password !== form.confirmPassword) {
//       setError('Passwords do not match.')
//       return false
//     }
//     return true
//   }

//   const formatErrors = (errorsObj) => {
//     if (!errorsObj) return 'Something went wrong.'
//     const messages = Object.entries(errorsObj).map(([field, msgs]) => {
//       const cleanField = field.charAt(0).toUpperCase() + field.slice(1)
//       return `${cleanField}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
//     })
//     return messages.join('\n')
//   }

//   const safeParseJSON = async (response) => {
//     const text = await response.text()
//     try {
//       return JSON.parse(text)
//     } catch (e) {
//       console.error('Response was not JSON:', text)
//       throw new Error(`Server returned invalid response (status ${response.status}). Check the console.`)
//     }
//   }

//   const postFormEncoded = async (url, data) => {
//     const body = new URLSearchParams(data)
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body,
//     })
//     const json = await safeParseJSON(response)
//     return { response, json }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     if (isRegister) {
//       // ---------- REGISTRATION ----------
//       if (!validateRegister()) {
//         setLoading(false)
//         return
//       }

//       try {
//         const formData = new FormData()
//         formData.append('name', form.name)
//         formData.append('email', form.email)
//         formData.append('mobile', form.mobile)
//         formData.append('password', form.password)

//         let response = await fetch('/api/admin_data/', {
//           method: 'POST',
//           body: formData,
//         })

//         if (response.status === 404) {
//           response = await fetch('/api/admin_data', {
//             method: 'POST',
//             body: formData,
//           })
//         }

//         const data = await safeParseJSON(response)
//         console.log('Registration status:', response.status, 'data:', data)

//         if (!response.ok) {
//           if (data.errors) {
//             setError(formatErrors(data.errors))
//           } else {
//             throw new Error(data.status || data.detail || 'Registration failed.')
//           }
//         } else {
//           setSuccess('Account created! You can now sign in.')
//           setTimeout(() => {
//             setIsRegister(false)
//             setSuccess('')
//             setForm({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
//           }, 1500)
//         }
//       } catch (err) {
//         setError(err.message || 'Network error. Try again.')
//       } finally {
//         setLoading(false)
//       }
//     } else {
//       // ---------- LOGIN ----------
//       if (!validateLogin()) {
//         setLoading(false)
//         return
//       }

//       try {
//         let { response, json: data } = await postFormEncoded('/api/admin_login/', {
//           email: form.email,
//           password: form.password,
//         })

//         if (response.status === 404) {
//           const retry = await postFormEncoded('/api/admin_login', {
//             email: form.email,
//             password: form.password,
//           })
//           response = retry.response
//           data = retry.json
//         }

//         console.log('Login status:', response.status, 'data:', data)

//         if (!response.ok) {
//           if (data.errors) {
//             setError(formatErrors(data.errors))
//           } else {
//             throw new Error(data.status || data.detail || 'Invalid email or password.')
//           }
//         } else {
//           // Extract token from response (adjust the field name to match your API)
//           const token = data.token || data.access_token || null
//           // Extract user data (could be inside data.user, data.data, or the whole data)
//           const userData = data.user || data.data || data

//           // Attach the token to the user object so it's stored in localStorage
//           if (token) {
//             userData.token = token
//           }

//           loginApi(userData)
//           navigate('/dashboard', { replace: true })
//         }
//       } catch (err) {
//         setError(err.message || 'Login failed.')
//       } finally {
//         setLoading(false)
//       }
//     }
//   }

//   const toggleMode = () => {
//     setIsRegister(prev => !prev)
//     setError('')
//     setSuccess('')
//     if (!isRegister) {
//       setForm(prev => ({ ...prev, name: '', mobile: '', confirmPassword: '' }))
//     }
//   }

//   return (
//     <div className="min-h-screen flex">
//       {/* Left panel (unchanged) */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 flex-col justify-between p-12 relative overflow-hidden">
//         <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
//         <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-white/5 rounded-full" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full" />

//         <div className="relative">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
//               <Leaf size={22} className="text-white" />
//             </div>
//             <span className="text-white text-2xl font-bold">GreenAdmin</span>
//           </div>
//         </div>

//         <div className="relative space-y-6">
//           <div className="space-y-2">
//             <h2 className="text-white text-4xl font-extrabold leading-tight">
//               Manage your<br />business smarter
//             </h2>
//             <p className="text-primary-200 text-lg">
//               A powerful, beautiful admin dashboard built for modern teams.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 max-w-sm">
//             {[
//               { value: '24K+', label: 'Active Users' },
//               { value: '98%',  label: 'Uptime' },
//               { value: '$1.2M', label: 'Revenue' },
//               { value: '340+', label: 'Products' },
//             ].map(stat => (
//               <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
//                 <p className="text-white text-2xl font-bold">{stat.value}</p>
//                 <p className="text-primary-200 text-sm mt-0.5">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <p className="relative text-primary-300 text-sm">
//           © {new Date().getFullYear()} GreenAdmin. All rights reserved.
//         </p>
//       </div>

//       {/* Right panel */}
//       <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
//               <Leaf size={20} className="text-white" />
//             </div>
//             <span className="text-slate-800 text-xl font-bold">GreenAdmin</span>
//           </div>

//           <div className="card p-8 sm:p-10">
//             <div className="mb-8">
//               <h1 className="text-2xl font-extrabold text-slate-800">
//                 {isRegister ? 'Create account' : 'Welcome back'}
//               </h1>
//               <p className="text-slate-500 text-sm mt-1">
//                 {isRegister
//                   ? 'Fill in the details to get started'
//                   : 'Sign in to your admin account'}
//               </p>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {isRegister && (
//                 <>
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Full name</label>
//                     <div className="relative">
//                       <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                       <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jalpa Patel" className="input-field pl-10" />
//                     </div>
//                   </div>
//                   <div className="space-y-1.5">
//                     <label className="text-sm font-medium text-slate-700">Mobile</label>
//                     <div className="relative">
//                       <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                       <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} placeholder="9876543210" className="input-field pl-10" />
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-slate-700">Email</label>
//                 <div className="relative">
//                   <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field pl-10" autoComplete="email" />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium text-slate-700">Password</label>
//                 <div className="relative">
//                   <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                   <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field pl-10 pr-11" autoComplete={isRegister ? 'new-password' : 'current-password'} />
//                   <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                 </div>
//               </div>

//               {isRegister && (
//                 <div className="space-y-1.5">
//                   <label className="text-sm font-medium text-slate-700">Confirm password</label>
//                   <div className="relative">
//                     <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input-field pl-10" autoComplete="new-password" />
//                   </div>
//                 </div>
//               )}

//               {success && (
//                 <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
//                   <CheckCircle size={15} className="flex-shrink-0" />
//                   {success}
//                 </div>
//               )}

//               {error && (
//                 <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
//                   <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
//                   {error}
//                 </div>
//               )}

//               <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
//                     </svg>
//                     {isRegister ? 'Creating account…' : 'Signing in…'}
//                   </>
//                 ) : isRegister ? 'Create Account' : 'Sign In'}
//               </button>
//             </form>

//             <div className="mt-6 text-center text-sm text-slate-500">
//               {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
//               <button type="button" onClick={toggleMode} className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
//                 {isRegister ? 'Sign in' : 'Create one'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Leaf,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function Login() {
  const { user, loginApi } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false); // new state

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password specific
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const validateLogin = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const formatErrors = (errorsObj) => {
    if (!errorsObj) return "Something went wrong.";
    const messages = Object.entries(errorsObj).map(([field, msgs]) => {
      const cleanField = field.charAt(0).toUpperCase() + field.slice(1);
      return `${cleanField}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`;
    });
    return messages.join("\n");
  };

  const safeParseJSON = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Response was not JSON:", text);
      throw new Error(
        `Server returned invalid response (status ${response.status}). Check the console.`,
      );
    }
  };

  const postFormEncoded = async (url, data) => {
    const body = new URLSearchParams(data);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = await safeParseJSON(response);
    return { response, json };
  };

  // ---------- Forgot Password Handler ----------
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}/admin-reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: forgotEmail,
        }),
      });

      console.log("Forgot password response:", response.status, data);

      if (!response.ok) {
        if (data.errors) {
          setError(formatErrors(data.errors));
        } else {
          throw new Error(data.status || data.detail || "Failed to send OTP.");
        }
      } else {
        setSuccess("OTP has been sent to your email. Check your inbox.");
        setForgotEmail("");
      }
    } catch (err) {
      setError(err.message || "Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Main Login / Register Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isRegister) {
      // ---------- REGISTRATION ----------
      if (!validateRegister()) {
        setLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("mobile", form.mobile);
        formData.append("password", form.password);

        let response = await fetch("/api/admin_data/", {
          method: "POST",
          body: formData,
        });

        if (response.status === 404) {
          response = await fetch("/api/admin_data", {
            method: "POST",
            body: formData,
          });
        }

        const data = await safeParseJSON(response);
        console.log(data);
        console.log("Registration status:", response.status, "data:", data);

        if (!response.ok) {
          if (data.errors) {
            setError(formatErrors(data.errors));
          } else {
            throw new Error(
              data.status || data.detail || "Registration failed.",
            );
          }
        } else {
          setSuccess("Account created! You can now sign in.");
          setTimeout(() => {
            setIsRegister(false);
            setSuccess("");
            setForm({
              name: "",
              email: "",
              mobile: "",
              password: "",
              confirmPassword: "",
            });
          }, 1500);
        }
      } catch (err) {
        setError(err.message || "Network error. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // ---------- LOGIN ----------
      if (!validateLogin()) {
        setLoading(false);
        return;
      }

      try {
        let { response, json: data } = await postFormEncoded(
          "/api/admin_login/",
          {
            email: form.email,
            password: form.password,
          },
        );

        if (response.status === 404) {
          const retry = await postFormEncoded("/api/admin_login", {
            email: form.email,
            password: form.password,
          });
          response = retry.response;
          data = retry.json;
        }

        console.log("Login status:", response.status, "data:", data);

        if (!response.ok) {
          if (data.errors) {
            setError(formatErrors(data.errors));
          } else {
            throw new Error(
              data.status || data.detail || "Invalid email or password.",
            );
          }
        } else {
          const token = data.token || data.access_token || null;
          const userData = data.user || data.data || data;
          if (token) {
            userData.token = token;
          }
          loginApi(userData);
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        setError(err.message || "Login failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError("");
    setSuccess("");
    if (!isRegister) {
      setForm((prev) => ({
        ...prev,
        name: "",
        mobile: "",
        confirmPassword: "",
      }));
    }
  };

  const backToLogin = () => {
    setForgotPassword(false);
    setForgotEmail("");
    setError("");
    setSuccess("");
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen flex">
      {/* Left panel (unchanged) */}
      

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf size={20} className="text-white" />
            </div>
            <span className="text-slate-800 text-xl font-bold">GreenAdmin</span>
          </div>

          <div className="card p-8 sm:p-10">
            {/* ---------- FORGOT PASSWORD VIEW ---------- */}
            {forgotPassword ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-extrabold text-slate-800">
                    Forgot password?
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Enter your email and we'll send you an OTP to reset your
                    password.
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="input-field pl-10"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                      <CheckCircle size={15} className="flex-shrink-0" />
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
                      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Sending OTP…
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>

                  <div className="text-center text-sm text-slate-500">
                    <button
                      type="button"
                      onClick={backToLogin}
                      className="flex items-center justify-center gap-1 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                    >
                      <ArrowLeft size={14} />
                      Back to sign in
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* ---------- LOGIN / REGISTER VIEW ---------- */}
                <div className="mb-8">
                  <h1 className="text-2xl font-extrabold text-slate-800">
                    {isRegister ? "Create account" : "Welcome back"}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {isRegister
                      ? "Fill in the details to get started"
                      : "Sign in to your admin account"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {isRegister && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                          Full name
                        </label>
                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Jalpa Patel"
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                          Mobile
                        </label>
                        <div className="relative">
                          <Phone
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                          <input
                            type="tel"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="9876543210"
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="input-field pl-10"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="input-field pl-10 pr-11"
                        autoComplete={
                          isRegister ? "new-password" : "current-password"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isRegister && (
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">
                        Confirm password
                      </label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="input-field pl-10"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                      <CheckCircle size={15} className="flex-shrink-0" />
                      {success}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 whitespace-pre-line">
                      <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        {isRegister ? "Creating account…" : "Signing in…"}
                      </>
                    ) : isRegister ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* Forgot password link (only on login) */}
                {!isRegister && (
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPassword(true);
                        setError("");
                        setSuccess("");
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center text-sm text-slate-500">
                  {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
                  >
                    {isRegister ? "Sign in" : "Create one"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
