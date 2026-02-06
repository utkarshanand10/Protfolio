import React from "react";
import { motion } from "framer-motion";
import { DATA } from "../constants";
import { Code2, Layout, Database, Terminal } from "lucide-react";

const skillCategories = [
    {
        name: "Languages",
        icon: <Code2 className="w-5 h-5" />,
        list: DATA.skills.languages,
        color: "bg-blue-500",
    },
    {
        name: "Frontend & Frameworks",
        icon: <Layout className="w-5 h-5" />,
        list: DATA.skills.frameworks,
        color: "bg-purple-500",
    },
    {
        name: "Backend & DB",
        icon: <Database className="w-5 h-5" />,
        list: DATA.skills.backend,
        color: "bg-emerald-500",
    },
    {
        name: "Other Tools",
        icon: <Terminal className="w-5 h-5" />,
        list: DATA.skills.other,
        color: "bg-amber-500",
    },
];

export default function Skills() {
    return (
        <section
            id="skills"
            className="section-padding bg-slate-50 dark:bg-dark-bg/50"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl mb-4">Technical Arsenal</h2>
                <div className="h-1.5 w-20 bg-primary-500 mx-auto rounded-full" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {skillCategories.map((category, idx) => (
                    <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                            rotateX: 10,
                            rotateY: 10,
                            y: -10,
                            transition: { duration: 0.3 },
                        }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 h-full border-none shadow-lg perspective-1000"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div
                            className={`p-3 inline-block rounded-xl text-white mb-6 ${category.color}`}
                            style={{ transform: "translateZ(30px)" }}
                        >
                            {category.icon}
                        </div>
                        <h3
                            className="text-lg mb-4 font-bold"
                            style={{ transform: "translateZ(20px)" }}
                        >
                            {category.name}
                        </h3>
                        <div
                            className="flex flex-wrap gap-2"
                            style={{ transform: "translateZ(10px)" }}
                        >
                            {category.list.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1 text-sm bg-white dark:bg-white/5 border border-slate-200 dark:border-dark-border rounded-lg"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
