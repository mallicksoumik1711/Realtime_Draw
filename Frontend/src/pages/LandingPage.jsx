
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { ArrowRight, Check, Zap, PackageCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white to-teal-50/20" />
                <div
                    className="absolute inset-0 opacity-90"
                    style={{
                        backgroundImage: `
        linear-gradient(to right, rgb(203 213 225) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(203 213 225) 1px, transparent 1px)
      `,
                        backgroundSize: '70px 70px',
                        maskImage: 'radial-gradient(circle at 70% 50%, transparent 50%, black 100%)',
                    }}
                />
                <motion.div
                    animate={{ y: [-40, 50, -40], rotate: [0, 180, 360] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-teal-500/25 to-emerald-500/15 rounded-full blur-3xl hidden lg:block"
                />
                <motion.div
                    animate={{ y: [40, -60, 40], rotate: [0, -180, 0] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 right-32 w-80 h-80 bg-gradient-to-tl from-blue-600/20 to-indigo-600/10 rounded-full blur-3xl hidden lg:block"
                />
                {[...Array(28)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -35, 0],
                            opacity: [0.2, 0.9, 0.2],
                            scale: [0.6, 1.4, 0.6],
                        }}
                        transition={{
                            duration: 5 + (i % 5),
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                        className="absolute pointer-events-none"
                        style={{
                            top: `${8 + (i * 7)}%`,
                            left: `${5 + (i % 12) * 8}%`,
                            width: i % 3 === 0 ? '5px' : '3px',
                            height: i % 3 === 0 ? '5px' : '3px',
                            background: i % 4 === 0
                                ? 'rgba(20, 184, 166, 0.9)'  
                                : i % 4 === 1
                                    ? 'rgba(6, 182, 212, 0.85)'  
                                    : i % 4 === 2
                                        ? 'rgba(59, 130, 246, 0.8)'  
                                        : 'rgba(99, 102, 241, 0.75)', 
                            borderRadius: '50%',
                            filter: 'blur(0.8px)',
                            boxShadow: '0 0 10px rgba(20, 184, 166, 0.6)',
                        }}
                    />
                ))}
            </div>
            <section className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left space-y-6 lg:space-y-8"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Precision Industrial
                            <br />
                            <span className="text-teal-800">Part Sourcing</span>
                            <br />
                            Engineered for Scale
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Streamline your manufacturing with instant quotes, industrial-grade 3D printing, and delivery in as few as 6 business days. Built for engineers who demand reliability.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/signup")}
                                className="px-8 py-4 bg-teal-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-teal-900 transition-colors flex items-center justify-center gap-2 group"
                            >
                                Sign Up
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate("/signin")}
                                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-teal-500 hover:text-teal-600 transition-colors"
                            >
                                Sign In
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-600">
                            {[
                                { icon: Check, label: 'ISO 9001 Certified' },
                                { icon: Zap, label: '100+ Materials Available' },
                                { icon: PackageCheck, label: '6-Day Max Delivery' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-teal-500" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="absolute inset-0 -top-20 -bottom-20 -left-10 -right-10 lg:-left-20 lg:-right-20">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.2, delay: 0.4 }}
                                className="w-full h-full bg-gradient-to-br from-teal-500/10 via-cyan-500/8 to-teal-600/10 rounded-3xl blur-3xl -z-10"
                            />
                        </div>
                        <div className="relative backdrop-blur-sm rounded-3xl p-8">
                            <img
                                src="https://niceillustrations.com/wp-content/uploads/2022/01/Webinar-color-800px.png"
                                alt="Designer working on industrial part sourcing platform"
                                className="w-full max-w-md lg:max-w-lg drop-shadow-xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
