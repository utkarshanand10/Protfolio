import React from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Send } from "lucide-react";
import { DATA } from "../constants";

export default function Contact() {
    return (
        <section id="contact" className="section-padding">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl mb-4">Get In Touch</h2>
                <div className="h-1.5 w-20 bg-primary-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div>
                        <h3 className="text-3xl mb-4 font-black">
                            Let's talk about <br />
                            your next project
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            I'm always open to discussing new projects, creative
                            ideas or opportunities to be part of your visions.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <a
                            href={`mailto:${DATA.contact.email}`}
                            className="flex items-center gap-4 group"
                        >
                            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                                    Email Me
                                </p>
                                <p className="text-lg font-semibold">
                                    {DATA.contact.email}
                                </p>
                            </div>
                        </a>

                        <div className="flex gap-4">
                            <a
                                href={DATA.contact.github}
                                target="_blank"
                                rel="noreferrer"
                                className="p-4 glass-card hover:bg-primary-600 hover:text-white transition-all duration-300"
                            >
                                <Github className="w-6 h-6" />
                            </a>
                            <a
                                href={DATA.contact.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="p-4 glass-card hover:bg-primary-600 hover:text-white transition-all duration-300"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-8 space-y-6"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl glass-input"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-xl glass-input"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                            Message
                        </label>
                        <textarea
                            rows="4"
                            placeholder="How can I help you?"
                            className="w-full px-4 py-3 rounded-xl glass-input resize-none"
                        ></textarea>
                    </div>
                    <button className="btn-primary w-full justify-center">
                        Send Message <Send className="w-5 h-5" />
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
