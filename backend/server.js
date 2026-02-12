require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key-change-this-in-prod"; // Simple secret for now

app.use(
  cors({
    origin: true, // Allow any origin that sends 'Origin' header
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Enable pre-flight request for all routes
app.options(/.*/, cors());

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Storage (Cloudinary) ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_projects",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// --- Schemas & Models ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [String],
  github: String,
  live: String,
  image: String, // Legacy single image
  images: [String], // Array of image URLs
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);

// --- Seed Admin User ---
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "Utkarsh-Anand" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Gorakhpur1", 10);
      await User.create({
        username: "Utkarsh-Anand",
        password: hashedPassword,
      });
      console.log("Admin user seeded: Utkarsh-Anand");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

const DEFAULT_PROJECTS = [
  {
    title: "NovaAI Chatbot",
    description:
      "A logic-driven chatbot powered by OpenAI, AI integrations and modern UI.",
    tech: ["MERN", "OpenAI API", "Axios", "Tailwind CSS"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "Netflix Clone",
    description:
      "Pixel-perfect Netflix UI with Firebase Auth and TMDB API integration.",
    tech: ["MERN", "Firebase Auth", "TMDB API", "Redux Toolkit"],
    github: "https://github.com",
    live: "https://example.com",
  },
  {
    title: "CRUD Application",
    description:
      "Robust inventory management system with full CRUD functionality.",
    tech: ["MERN", "MongoDB", "REST APIs"],
    github: "https://github.com",
    live: "https://example.com",
  },
];

const seedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(DEFAULT_PROJECTS);
      console.log("Default projects seeded");
    }
  } catch (error) {
    console.error("Error seeding projects:", error);
  }
};

const seedDatabase = async () => {
  await seedAdmin();
  await seedProjects();
};
seedDatabase();

// --- Routes ---

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get Projects
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add Project with Multiple Images Upload (Cloudinary)
app.post("/api/projects", upload.array("images", 10), async (req, res) => {
  const { title, description, techStr, github, live } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      // Cloudinary storage automatically puts the URL in file.path
      imageUrls = req.files.map((file) => file.path);
    }

    // Parse tech string to array and filter empty strings
    const tech = techStr
      ? techStr
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      : [];

    const newProject = new Project({
      title,
      description,
      tech,
      github,
      live,
      images: imageUrls,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({
      error: "Failed to save project: " + error.message,
    });
  }
});

// Update Project with Multiple Images (Cloudinary)
app.put("/api/projects/:id", upload.array("images", 10), async (req, res) => {
  const { id } = req.params;
  const { title, description, techStr, github, live } = req.body;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map((file) => file.path);
    }

    // Determine images to keep
    let existingImages = req.body.existingImages;

    // If undefined/null, implies not sent? Or if sent as ""?
    // Logic: If req.body.existingImages is undefined, it usually means "no change" in some APIs, but here we want to support "delete all".
    // Frontend now sends "" if empty list.

    if (existingImages === undefined) {
      // Field missing. Assume "append" behavior / keep original (backward compatibility)
      existingImages = project.images || [];
    } else if (existingImages === "") {
      // Explicitly empty
      existingImages = [];
    }

    // Normalize to array
    if (!Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }

    // Filter out any empty strings that might have slipped in
    existingImages = existingImages.filter((img) => img && img !== "");

    const finalImages = [...existingImages, ...newImageUrls];

    // Find images to delete
    const imagesToDelete = (project.images || []).filter(
      (img) => !finalImages.includes(img),
    );

    // Delete removed images from Cloudinary (Best Effort)
    imagesToDelete.forEach(async (imgUrl) => {
      if (imgUrl.includes("cloudinary.com")) {
        try {
          // Extract public ID from URL
          // Example: https://res.cloudinary.com/.../portfolio_projects/filename.jpg
          const parts = imgUrl.split("/");
          const filename = parts.pop(); // filename.jpg
          const publicId = `portfolio_projects/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.error("Error deleting image from Cloudinary:", e);
        }
      }
    });

    project.images = finalImages;

    const tech = techStr
      ? techStr.split(",").map((t) => t.trim())
      : project.tech;

    project.title = title || project.title;
    project.description = description || project.description;
    project.tech = tech;
    project.github = github || project.github;
    project.live = live || project.live;

    await project.save();
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete Project
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ error: "Project not found" });

    // Delete associated images from Cloudinary
    if (project.images && project.images.length > 0) {
      project.images.forEach(async (imgUrl) => {
        if (imgUrl.includes("cloudinary.com")) {
          try {
            const parts = imgUrl.split("/");
            const filename = parts.pop();
            const publicId = `portfolio_projects/${filename.split(".")[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (e) {}
        }
      });
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
