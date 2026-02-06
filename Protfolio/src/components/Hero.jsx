import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { DATA } from "../constants";
import Scene3D from "./Scene3D";

export default function Hero() {
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 20;
        const y = (clientY / innerHeight - 0.5) * -20;
        setMousePos({ x, y });
    };

    return (
        <section
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center pt-24 overflow-hidden"
        >
            <Scene3D />
            {/* Background Blobs */}
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-400/20 blur-[100px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-400/20 blur-[100px] rounded-full animate-float" />

            <div className="section-padding grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary-600 uppercase bg-primary-100 dark:bg-primary-900/30 rounded-full">
                        Available for full-time roles
                    </div>
                    <h1 className="text-5xl md:text-7xl mb-6 leading-[1.1]">
                        Hey, I'm <br />
                        <span className="gradient-text">{DATA.name}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                        {DATA.intro}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a href="#projects" className="btn-primary">
                            View Projects <ArrowRight className="w-5 h-5" />
                        </a>
                        <a href="#contact" className="btn-secondary">
                            Contact Me <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    animate={{
                        rotateX: mousePos.y,
                        rotateY: mousePos.x,
                    }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.8,
                        rotateX: { type: "spring", stiffness: 100 },
                        rotateY: { type: "spring", stiffness: 100 },
                    }}
                    className="relative lg:block hidden perspective-1000"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div className="relative z-10 p-8 glass-card border-none before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary-500/10 before:to-purple-500/10 before:rounded-2xl shadow-2xl">
                        <div
                            className="flex flex-col gap-6"
                            style={{ transform: "translateZ(50px)" }}
                        >
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <p>
                                    <span className="text-purple-500">
                                        const
                                    </span>{" "}
                                    developer = {"{"}
                                </p>
                                <p className="pl-4">
                                    name:{" "}
                                    <span className="text-emerald-500">
                                        "{DATA.name}"
                                    </span>
                                    ,
                                </p>
                                <p className="pl-4">
                                    role:{" "}
                                    <span className="text-emerald-500">
                                        "{DATA.title}"
                                    </span>
                                    ,
                                </p>
                                <p className="pl-4">
                                    passion:{" "}
                                    <span className="text-emerald-500">
                                        "Scalable Web Apps"
                                    </span>
                                    ,
                                </p>
                                <p className="pl-4">
                                    skills: [
                                    <span className="text-amber-500">
                                        "React", "Node", "MongoDB"
                                    </span>
                                    ],
                                </p>
                                <p className="pl-4">
                                    status:{" "}
                                    <span className="text-emerald-500">
                                        "Ready to Build"
                                    </span>
                                </p>
                                <p>{"}"}</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-float" />
                </motion.div>
            </div>
        </section>
    );
}
