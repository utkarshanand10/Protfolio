import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Trash2,
  Plus,
  LogOut,
  LayoutDashboard,
  Github,
  Globe,
  Code2,
  Server,
  Image as ImageIcon,
  Upload,
  Edit2,
  X,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);

  // Form state for new/edit project
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tech: "",
    github: "",
    live: "",
    image: null, // Legacy single image for edit cleanup
    images: [], // Array of File objects
    existingImages: [], // Array of URL strings for existing images
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      if (res.data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("adminToken", res.data.token);
        fetchProjects();
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    localStorage.removeItem("adminToken");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProjectForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    e.target.value = ""; // Allow re-selecting same file or adding more
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setProjectForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleEditClick = (project) => {
    setIsEditing(true);
    setCurrentProjectId(project._id);
    setProjectForm({
      title: project.title,
      description: project.description,
      tech: project.tech.join(", "),
      github: project.github || "",
      live: project.live || "",
      live: project.live || "",
      image: null,
      images: [], // New files to upload
      existingImages:
        project.images && project.images.length > 0
          ? project.images
          : project.image
            ? [project.image]
            : [],
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setProjectForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentProjectId(null);
    resetForm();
  };

  const resetForm = () => {
    setProjectForm({
      title: "",
      description: "",
      tech: "",
      github: "",
      live: "",
      image: null,
      images: [],
    });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", projectForm.title);
      formData.append("description", projectForm.description);
      formData.append("techStr", projectForm.tech);
      formData.append("github", projectForm.github);
      formData.append("live", projectForm.live);

      if (projectForm.images && projectForm.images.length > 0) {
        projectForm.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Send existing images as JSON string (or however backend prefers, let's use a field for now)
      // Backend update required to parse this
      if (isEditing) {
        if (
          projectForm.existingImages &&
          projectForm.existingImages.length > 0
        ) {
          projectForm.existingImages.forEach((img) => {
            formData.append("existingImages", img);
          });
        } else {
          // Explicitly send empty string if no existing images (meaning user deleted all)
          formData.append("existingImages", "");
        }
      }

      if (isEditing) {
        await axios.put(`${API_URL}/projects/${currentProjectId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Project updated successfully!");
        setIsEditing(false);
        setCurrentProjectId(null);
      } else {
        await axios.post(`${API_URL}/projects`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Project added successfully!");
      }

      fetchProjects();
      resetForm();
    } catch (err) {
      console.error("Error saving project", err);
      alert("Failed to save project");
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        fetchProjects();
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 w-full max-w-md relative z-10"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
              <LayoutDashboard size={32} />
            </div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
              Admin Portal
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Welcome back! Please login to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass-input"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 relative">
      {/* Background Blobs */}
      <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your portfolio projects
            </p>
          </div>
          <button onClick={handleLogout} className="btn-danger">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Add/Edit Project Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 h-fit sticky top-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-primary-600">
                {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
                {isEditing ? "Edit Project" : "Add New Project"}
              </h2>
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleInputChange}
                  required
                  className="glass-input"
                  placeholder="e.g. E-Commerce Platform"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="glass-input resize-none"
                  placeholder="Brief description of the project..."
                />
              </div>

              {/* File Input for Image */}
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Project Images {isEditing && "(Upload new to add)"}
                </label>

                {isEditing &&
                  projectForm.existingImages &&
                  projectForm.existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2 font-semibold">
                        Existing Images
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {projectForm.existingImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group aspect-square"
                          >
                            <img
                              src={img}
                              alt={`Existing ${idx}`}
                              className="w-full h-full object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {projectForm.images && projectForm.images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-primary-500 mb-2 font-semibold">
                      New Images to Upload
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {projectForm.images.map((file, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${idx}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-primary-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <div className="glass-input p-0 overflow-hidden flex items-center relative group cursor-pointer hover:border-primary-500 transition-colors">
                    <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 border-r border-slate-200 dark:border-white/10 text-slate-500">
                      <Upload size={18} />
                    </div>
                    <input
                      type="file"
                      name="images"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                    />
                    <span className="px-4 text-slate-500 truncate w-full">
                      {projectForm.images.length > 0
                        ? `Add more images (${projectForm.images.length} selected)`
                        : "Choose images..."}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Technologies
                </label>
                <div className="relative">
                  <Code2
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="tech"
                    value={projectForm.tech}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB"
                    required
                    className="glass-input pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    GitHub URL
                  </label>
                  <div className="relative">
                    <Github
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={18}
                    />
                    <input
                      type="url"
                      name="github"
                      value={projectForm.github}
                      onChange={handleInputChange}
                      className="glass-input pl-10"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                    Live URL
                  </label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={18}
                    />
                    <input
                      type="url"
                      name="live"
                      value={projectForm.live}
                      onChange={handleInputChange}
                      className="glass-input pl-10"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full mt-4">
                {isEditing ? (
                  <>
                    <Edit2 size={20} /> Update Project
                  </>
                ) : (
                  <>
                    <Plus size={20} /> Add Project
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Project List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-primary-600 flex items-center gap-2">
              <Server size={24} /> Existing Projects
            </h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {projects.map((project, idx) => (
                <motion.div
                  key={project._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-5 rounded-xl border flex justify-between items-start group hover:shadow-md transition-all ${
                    isEditing && currentProjectId === project._id
                      ? "bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-500/50"
                      : "bg-white/50 dark:bg-slate-700/30 border-slate-200 dark:border-white/10"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-md font-medium border border-primary-100 dark:border-primary-800/50"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p>No projects found. Add your first project!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
