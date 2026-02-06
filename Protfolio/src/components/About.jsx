import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Heart } from "lucide-react";
import { DATA } from "../constants";

export default function About() {
    return (
        <section id="about" className="section-padding">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl mb-4">About Me</h2>
                <div className="h-1.5 w-20 bg-primary-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        {DATA.about}
                    </p>
                    <div className="flex items-center gap-4 text-primary-600 dark:text-primary-400 font-bold italic">
                        <Heart className="fill-current animate-pulse" />
                        <span>
                            Problem solver by nature, Developer by choice.
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid gap-6 perspective-1000"
                >
                    <motion.div
                        whileHover={{
                            rotateX: 5,
                            rotateY: -5,
                            y: -5,
                            scale: 1.02,
                        }}
                        className="glass-card p-6 flex gap-4 items-start shadow-lg"
                    >
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl mb-1">
                                {DATA.education.degree}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {DATA.education.college} |{" "}
                                {DATA.education.period}
                            </p>
                            <p className="text-sm font-bold mt-2 text-primary-600">
                                CGPA: {DATA.education.cgpa}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            rotateX: 5,
                            rotateY: -5,
                            y: -5,
                            scale: 1.02,
                        }}
                        className="glass-card p-6 flex gap-4 items-start shadow-lg"
                    >
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl mb-1">MERN Stack focus</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Specialize in Building end-to-end full stack web
                                applications.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
