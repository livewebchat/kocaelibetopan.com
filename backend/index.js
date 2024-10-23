require("dotenv").config()

const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const app = express()
const port = process.env.PORT

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

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://yonetim.kocaelibetopan.com",
      "https://kocaelibetopan.com",
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

// Fetch data from MySQL
app.get("/hero_sliders", (req, res) => {
  const allowedOrigins = [
    "https://yonetim.kocaelibetopan.com",
    "https://kocaelibetopan.com",
  ]
  const origin = req.get("origin") || req.get("referer")

  if (allowedOrigins.includes(origin)) {
    // Proceed with the request
    const query = "SELECT * FROM sliders"
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json(results)
      }
    })
  } else {
    // If the origin is not allowed, block the request
    res.status(403).json({ message: "Access denied" })
  }
})

app.post("/hero_sliders", (req, res) => {
  const allowedOrigins = [
    "https://yonetim.kocaelibetopan.com",
    "https://kocaelibetopan.com",
  ]
  const origin = req.get("origin") || req.get("referer")

  if (allowedOrigins.includes(origin)) {
    // Extract data from the request body
    const { title, description, path, image } = req.body

    if (!title || !path || !image) {
      return res.status(400).json({ message: "Title, path, and image are required" })
    }

    // Insert data into the sliders table
    const query = `
      INSERT INTO sliders (title, description, path, image)
      VALUES (?, ?, ?, ?)
    `
    const values = [title, description, path, image]

    db.query(query, values, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(201).json({ message: "Slider added successfully", id: results.insertId })
      }
    })
  } else {
    // If the origin is not allowed, block the request
    res.status(403).json({ message: "Access denied" })
  }
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
