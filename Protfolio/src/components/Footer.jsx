import React from "react";
import { DATA } from "../constants";

export default function Footer() {
    return (
        <footer className="py-12 px-6 border-t border-slate-200 dark:border-dark-border">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-2xl font-black tracking-tighter">
                    UA<span className="text-primary-600">.</span>
                </div>

                <p className="text-slate-500 text-sm font-medium">
                    © {new Date().getFullYear()} {DATA.name}. Built with React,
                    Tailwind & ❤️
                </p>

                <div className="flex gap-8 text-sm font-bold text-slate-500">
                    <a
                        href={DATA.contact.github}
                        className="hover:text-primary-600 transition-colors"
                    >
                        Github
                    </a>
                    <a
                        href={DATA.contact.linkedin}
                        className="hover:text-primary-600 transition-colors"
                    >
                        LinkedIn
                    </a>
                    <a
                        href={`mailto:${DATA.contact.email}`}
                        className="hover:text-primary-600 transition-colors"
                    >
                        Email
                    </a>
                </div>
            </div>
        </footer>
    );
}
