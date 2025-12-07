
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowRight, Check, Eye, EyeOff, StepForward } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import validateSignup from '../validations/signUpValidations';

function SignupPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateSignup(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            const res = await registerUser(payload);

            // save token + user
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/signin");
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Registration failed");
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
                className="relative z-10 w-full max-w-lg lg:max-w-2xl"
            >
                <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/60 p-8 lg:p-12">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                            Get Started in Seconds
                        </h1>
                        <p className="text-gray-600 mt-3 text-lg">
                            Join thousands of engineers sourcing parts faster
                        </p>
                    </div>

                    {/* Compact, Horizontal-Friendly Form */}
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700 transition-all outline-none text-base"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company (Optional)</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700 transition-all outline-none text-base"
                                placeholder="Acme Corp"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700 transition-all outline-none text-base"
                                placeholder="john@company.com"
                            />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-teal-700  transition-all outline-none pr-12 text-base"
                                    placeholder="Create a strong password"
                                />
                                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-700 transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2 mt-4">
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-lg rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group"
                            >
                                Create Free Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition" />
                            </motion.button>
                        </div>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate("/signin")}
                                className="font-semibold text-teal-700 hover:text-teal-800 transition"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SignupPage;
