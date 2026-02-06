import React from "react";
import { motion } from "framer-motion";
import { DATA } from "../constants";
import { Calendar } from "lucide-react";

export default function Experience() {
    return (
        <section id="experience" className="section-padding">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl mb-4">Experience</h2>
                <div className="h-1.5 w-20 bg-primary-500 mx-auto rounded-full" />
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {DATA.experience.map((exp, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-primary-500"
                    >
                        <div className="absolute left-[-5px] top-0 w-[11px] h-[11px] rounded-full bg-primary-500 border-4 border-white dark:border-dark-bg" />

                        <div className="glass-card p-6 border-none shadow-lg">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl">{exp.company}</h3>
                                    <p className="text-primary-600 font-bold">
                                        {exp.role}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-full text-sm font-semibold">
                                    <Calendar className="w-4 h-4" />
                                    {exp.period}
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {exp.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
