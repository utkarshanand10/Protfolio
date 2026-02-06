import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Github,
    ExternalLink,
    Sparkles,
    Monitor,
    Database,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useProjects } from "../context/ProjectContext";

const projectIcons = [
    <Sparkles className="w-12 h-12 text-blue-500" />,
    <Monitor className="w-12 h-12 text-red-500" />,
    <Database className="w-12 h-12 text-emerald-500" />,
];

const gradients = [
    "from-blue-600 to-indigo-600",
    "from-red-600 to-amber-600",
    "from-emerald-600 to-teal-600",
];

export default function Projects() {
    const { projects } = useProjects();
    const [selectedProject, setSelectedProject] = useState(null);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

    const openProject = (project) => {
        setSelectedProject(project);
        setLightboxImageIndex(0);
        document.body.style.overflow = "hidden";
    };

    const closeProject = () => {
        setSelectedProject(null);
        document.body.style.overflow = "auto";
    };

    const nextImage = () => {
        if (!selectedProject) return;
        const totalImages =
            (selectedProject.images || []).length +
            (selectedProject.image ? 1 : 0);
        // If we simplified to just use a unified array it would be easier, but let's handle both
        // Let's normalize images on the fly
        const allImages =
            selectedProject.images && selectedProject.images.length > 0
                ? selectedProject.images
                : [selectedProject.image];

        setLightboxImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        if (!selectedProject) return;
        const allImages =
            selectedProject.images && selectedProject.images.length > 0
                ? selectedProject.images
                : [selectedProject.image];

        setLightboxImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length,
        );
    };

    return (
        <section
            id="projects"
            className="section-padding bg-slate-50 dark:bg-dark-bg/50"
        >
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl mb-4">Featured Work</h2>
                <div className="h-1.5 w-20 bg-primary-500 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <motion.div
                        key={idx}
                        layoutId={`project-card-${project._id || idx}`}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                            y: -5,
                            transition: { duration: 0.3 },
                        }}
                        onClick={() => openProject(project)}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group glass-card overflow-hidden hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer"
                    >
                        <div
                            className={`relative h-48 bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center overflow-hidden`}
                        >
                            {/* Show first image or fallback */}
                            {(project.images && project.images.length > 0) ||
                            project.image ? (
                                <motion.img
                                    layoutId={`project-image-${project._id || idx}`}
                                    src={
                                        project.images &&
                                        project.images.length > 0
                                            ? project.images[0]
                                            : project.image
                                    }
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <>
                                    <div className="absolute inset-0 overflow-hidden">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    </div>
                                    <div className="relative z-10 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 group-hover:scale-110 transition-transform duration-500">
                                        {
                                            projectIcons[
                                                idx % projectIcons.length
                                            ]
                                        }
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl mb-2 group-hover:text-primary-600 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tech.slice(0, 3).map((t, i) => (
                                    <span
                                        key={t + i}
                                        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-white/5 rounded-md text-slate-600 dark:text-slate-400"
                                    >
                                        {t}
                                    </span>
                                ))}
                                {project.tech.length > 3 && (
                                    <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-white/5 rounded-md text-slate-600 dark:text-slate-400">
                                        +{project.tech.length - 3}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Project Modal / Lightbox */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeProject}
                    >
                        <motion.div
                            layoutId={`project-card-${selectedProject._id}`}
                            className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative custom-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeProject}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="grid md:grid-cols-2">
                                {/* Image Gallery Section */}
                                <div className="bg-slate-900 relative min-h-[400px] md:h-full flex flex-col">
                                    <div className="relative flex-1 flex items-center justify-center overflow-hidden group bg-black/20">
                                        {(selectedProject.images &&
                                            selectedProject.images.length >
                                                0) ||
                                        selectedProject.image ? (
                                            <>
                                                <AnimatePresence mode="wait">
                                                    <motion.img
                                                        key={lightboxImageIndex}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        src={
                                                            selectedProject.images &&
                                                            selectedProject
                                                                .images.length >
                                                                0
                                                                ? selectedProject
                                                                      .images[
                                                                      lightboxImageIndex
                                                                  ]
                                                                : selectedProject.image
                                                        }
                                                        alt={
                                                            selectedProject.title
                                                        }
                                                        className="w-full h-full object-contain max-h-[60vh] md:max-h-[500px]"
                                                    />
                                                </AnimatePresence>

                                                {/* Navigation Arrows */}
                                                {selectedProject.images &&
                                                    selectedProject.images
                                                        .length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    prevImage();
                                                                }}
                                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-primary-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <ChevronLeft
                                                                    size={24}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    nextImage();
                                                                }}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-primary-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <ChevronRight
                                                                    size={24}
                                                                />
                                                            </button>
                                                        </>
                                                    )}
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center text-slate-700">
                                                {projectIcons[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Thumbnails Strip */}
                                    {selectedProject.images &&
                                        selectedProject.images.length > 1 && (
                                            <div className="h-20 bg-black/40 p-2 flex gap-2 overflow-x-auto justify-center items-center backdrop-blur-sm">
                                                {selectedProject.images.map(
                                                    (img, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setLightboxImageIndex(
                                                                    i,
                                                                );
                                                            }}
                                                            className={`relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                                                                i ===
                                                                lightboxImageIndex
                                                                    ? "border-primary-500 opacity-100"
                                                                    : "border-transparent opacity-50 hover:opacity-100"
                                                            }`}
                                                        >
                                                            <img
                                                                src={img}
                                                                alt={`Thumb ${i}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </div>

                                {/* Content Section */}
                                <div className="p-8">
                                    <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
                                        {selectedProject.title}
                                    </h2>

                                    <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                        {selectedProject.description}
                                    </p>

                                    <div className="mb-8">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                                            Technologies Used
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.tech.map((t) => (
                                                <span
                                                    key={t}
                                                    className="px-3 py-1.5 text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg border border-primary-100 dark:border-primary-500/30"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                        {selectedProject.github && (
                                            <a
                                                href={selectedProject.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-outline flex-1 flex justify-center items-center gap-2"
                                            >
                                                <Github size={18} /> View Code
                                            </a>
                                        )}
                                        {selectedProject.live && (
                                            <a
                                                href={selectedProject.live}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-primary flex-1 flex justify-center items-center gap-2"
                                            >
                                                <ExternalLink size={18} /> Live
                                                Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
