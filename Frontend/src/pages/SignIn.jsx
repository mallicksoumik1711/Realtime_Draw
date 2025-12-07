
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { useLocation } from "react-router-dom";
import validateSignin from '../validations/signInValidations';

function SignInPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignin(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const res = await loginUser(formData); // <- API call

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-teal-50/20" />
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px)
            `,
                        backgroundSize: '70px 70px',
                    }}
                />
                <motion.div
                    animate={{ y: [-40, 50, -40], rotate: [0, 180, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-teal-500/20 to-emerald-500/10 rounded-full blur-3xl hidden lg:block"
                />
                <motion.div
                    animate={{ y: [40, -60, 40], rotate: [0, -180, 0] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-32 w-80 h-80 bg-gradient-to-tl from-blue-600/15 to-indigo-600/10 rounded-full blur-3xl hidden lg:block"
                />
                {[...Array(28)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -35, 0], opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.4, 0.6] }}
                        transition={{ duration: 5 + (i % 5), repeat: Infinity, delay: i * 0.15 }}
                        className="absolute pointer-events-none"
                        style={{
                            top: `${8 + (i * 7)}%`,
                            left: `${5 + (i % 12) * 8}%`,
                            width: i % 3 === 0 ? '5px' : '3px',
                            height: i % 3 === 0 ? '5px' : '3px',
                            background: i % 4 === 0 ? 'rgba(20, 184, 166, 0.9)' : i % 4 === 1 ? 'rgba(6, 182, 212, 0.85)' : i % 4 === 2 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(99, 102, 241, 0.75)',
                            borderRadius: '50%',
                            filter: 'blur(0.8px)',
                            boxShadow: '0 0 10px rgba(20, 184, 166, 0.6)',
                        }}
                    />
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/60 p-8 lg:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Welcome back
                        </h1>
                        <p className="text-gray-600 mt-3 text-lg">
                            Sign in to your account
                        </p>
                    </div>
                    {location.state?.message && (
                        <p className="text-red-600 text-center mb-4">
                            {location.state.message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700 transition-all outline-none text-base"
                                placeholder="john@company.com"
                                autoFocus
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700 transition-all outline-none pr-12 text-base"
                                    placeholder="Enter your password"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-700 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-teal-700 rounded focus:ring-teal-100" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-teal-700 hover:text-teal-800 font-medium">
                                Forgot password?
                            </a>
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group"
                        >
                            Sign In
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                        </motion.button>
                    </form>
                    <div className="my-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <div className="mt-10 text-center">
                        <p className="text-gray-600">
                            Don’t have an account?{' '}
                            <button
                                onClick={() => navigate("/signup")}
                                className="font-semibold text-teal-700 hover:text-teal-800 transition"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SignInPage;
