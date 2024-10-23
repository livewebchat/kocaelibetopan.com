require("dotenv").config()
const express = require("express")
const multer = require("multer")
const mysql = require("mysql2")
const cors = require("cors")
const path = require("path")

const app = express()
const port = process.env.PORT

// Middleware to parse JSON data from POST requests
app.use(express.json())

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
    cb(null, path.join(__dirname, "uploads")) // Save uploaded files to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://yonetim.kocaelibetopan.com",
      "https://kocaelibetopan.com",
      "http://localhost:5173",
    ]
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "OPTIONS"], // Allow methods for preflight checks
  credentials: true, // If credentials like cookies are required
}

// Apply CORS middleware globally
app.use(cors(corsOptions))

// Handle preflight requests
app.options("*", cors(corsOptions))

// Serve the uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// GET route for hero sliders
app.get("/hero_sliders", (req, res) => {
  const query = "SELECT * FROM hero_sliders"
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(results)
    }
  })
})

app.post("/hero_sliders", upload.single("image"), (req, res) => {
  console.log("Request body:", req.body) // Log the request body
  console.log("Uploaded file:", req.file) // Log the uploaded file information

  const { title, description } = req.body
  const imagePath = `/uploads/hero_sliders${req.file.filename}`

  if (!title || !description || !req.file) {
    console.error("Missing required fields:", {
      title,
      description,
      file: req.file,
    })
    return res.status(400).json({ message: "Missing required fields" })
  }

  const query = `
    INSERT INTO sliders (title, description, path, image)
    VALUES (?, ?, ?, ?)
  `
  const values = [title, description, "", imagePath]

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting slider:", err) // Log the database error
      return res.status(500).json({ error: err.message })
    }
    console.log("Slider added successfully:", result) // Log the successful result
    res
      .status(201)
      .json({ message: "Slider added successfully", id: result.insertId })
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`)
})
