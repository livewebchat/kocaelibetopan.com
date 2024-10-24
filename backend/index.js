require("dotenv").config()
const express = require("express")
const multer = require("multer")
const mysql = require("mysql2")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

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
    const uploadPath = path.join(__dirname, "uploads")
    cb(null, uploadPath)
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
      console.log("CORS error:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "OPTIONS", "DELETE"],
  credentials: true,
}

// Apply CORS middleware globally
app.use(cors(corsOptions))

// Handle preflight requests
app.options("*", cors(corsOptions))

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
  const { title, description } = req.body
  const imagePath = `${req.file.filename}`

  if (!title || !description || !req.file) {
    console.error("Missing required fields:", {
      title,
      description,
      file: req.file,
    })
    return res.status(400).json({ message: "Missing required fields" })
  }

  const query = `
    INSERT INTO hero_sliders (title, description, path, image)
    VALUES (?, ?, ?, ?)
  `
  const values = [title, description, "", imagePath]

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting slider:", err)
      return res.status(500).json({ error: err.message })
    }
    res
      .status(201)
      .json({ message: "Slider added successfully", id: result.insertId })
  })
})

app.delete("/hero_sliders/:id", (req, res) => {
  const sliderId = req.params.id

  const getFilePathQuery = `SELECT image FROM hero_sliders WHERE id = ?`
  db.query(getFilePathQuery, [sliderId], (err, result) => {
    if (err) {
      console.error("Error fetching slider image path:", err)
      return res.status(500).json({ error: err.message })
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Slider not found" })
    }

    const imagePath = result[0].image
    const filePath = path.join(__dirname, "uploads", imagePath)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting slider image:", err)
      }

      const deleteQuery = `DELETE FROM hero_sliders WHERE id = ?`
      db.query(deleteQuery, [sliderId], (err, result) => {
        if (err) {
          console.error("Error deleting slider:", err)
          return res.status(500).json({ error: err.message })
        }

        res.json({ message: "Slider deleted successfully" })
      })
    })
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`)
})
