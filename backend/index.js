require("dotenv").config()
const express = require("express")
const multer = require("multer")
const mysql = require("mysql2")
const cors = require("cors")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
})

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack)
    return
  }
  console.log("Connected to MySQL")
})

// Set up file storage using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/") // Save uploaded files to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)) // Unique filename
  },
})

const upload = multer({ storage: storage })

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://yonetim.kocaelibetopan.com",
      "https://kocaelibetopan.com",
      "localhost",
    ]
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

// Use CORS with specific domains
app.use(cors(corsOptions))

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!")
})

// GET route for hero sliders
app.get("/hero_sliders", (req, res) => {
  const allowedOrigins = [
    "https://yonetim.kocaelibetopan.com",
    "https://kocaelibetopan.com",
  ]
  const origin = req.get("origin") || req.get("referer")

  if (allowedOrigins.includes(origin)) {
    const query = "SELECT * FROM sliders"
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json(results)
      }
    })
  } else {
    res.status(403).json({ message: "Access denied" })
  }
})

// POST route to add a new slider with file upload
app.post("/hero_sliders", upload.single("image"), (req, res) => {
  const { title, description } = req.body
  const imagePath = `/uploads/${req.file.filename}` // File path to save in DB

  if (!title || !description || !req.file) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const query = `
    INSERT INTO sliders (title, description, path, image)
    VALUES (?, ?, ?, ?)
  `
  const values = [title, description, "", imagePath] // Path column is unused

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res
      .status(201)
      .json({ message: "Slider added successfully", id: result.insertId })
  })
})

// Serve the uploaded files statically
app.use("/uploads", express.static("uploads"))

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
