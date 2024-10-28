require("dotenv").config()
const express = require("express")
const multer = require("multer")
const mysql = require("mysql2")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const port = process.env.PORT

// MySQL connection
let db

function handleMySQLDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.stack)
      setTimeout(handleMySQLDisconnect, 2000)
    } else {
      console.log("Connected to MySQL")
    }
  })

  // Handle errors
  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.warn("MySQL connection lost. Reconnecting...")
      handleMySQLDisconnect()
    } else {
      console.error("MySQL error:", err)
      throw err
    }
  })
}

handleMySQLDisconnect()

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

// App configuration
const app = express()
app.use(express.json())

const allowedOrigins = [
  "https://yonetim.kocaelibetopan.com",
  "https://kocaelibetopan.com",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
]

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      console.log("CORS error:", origin)
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
  credentials: true,
}

app.use(cors(corsOptions))

//////////////////////
//// hero_sliders ////
//////////////////////

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

app.put("/hero_sliders/:id", upload.single("image"), (req, res) => {
  const sliderId = req.params.id
  const { title, description } = req.body
  let imagePath = null

  if (req.file) {
    imagePath = req.file.filename

    const getOldImagePathQuery = `SELECT image FROM hero_sliders WHERE id = ?`
    db.query(getOldImagePathQuery, [sliderId], (err, result) => {
      if (err) {
        console.error("Error fetching old image path:", err)
      } else if (result.length > 0) {
        const oldImagePath = result[0].image
        const oldFilePath = path.join(__dirname, "uploads", oldImagePath)
        fs.unlink(oldFilePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err)
          }
        })
      }
    })
  }

  const updateQuery = `
    UPDATE hero_sliders 
    SET title = ?, description = ?, image = IFNULL(?, image) 
    WHERE id = ?
  `
  const values = [title, description, imagePath, sliderId]

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating slider:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Slider updated successfully" })
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

///////////////////////////
//// previous_projects ////
///////////////////////////

app.get("/previous_projects", (req, res) => {
  const query = "SELECT * FROM previous_projects"
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(results)
    }
  })
})

app.post("/previous_projects", upload.array("images", 10), (req, res) => {
  const { title, description, htmlContent } = req.body
  const imagePaths = req.files.map((file) => file.filename)

  if (!title || !description || imagePaths.length === 0) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const query = `
    INSERT INTO previous_projects (title, description, images, htmlContent)
    VALUES (?, ?, ?, ?)
  `
  const values = [title, description, JSON.stringify(imagePaths), htmlContent]

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting project:", err)
      return res.status(500).json({ error: err.message })
    }
    res
      .status(201)
      .json({ message: "Project added successfully", id: result.insertId })
  })
})

app.put("/previous_projects/:id", upload.array("images", 10), (req, res) => {
  const projectId = req.params.id
  const { title, description, htmlContent, existingImages } = req.body
  const newImagePaths = req.files.map((file) => file.filename)

  let imagePaths = []
  if (existingImages) {
    try {
      imagePaths = JSON.parse(existingImages)
    } catch (error) {
      return res.status(400).json({ message: "Invalid existing images format" })
    }
  }

  imagePaths = imagePaths.concat(newImagePaths)

  const query = `
    UPDATE previous_projects 
    SET title = ?, description = ?, images = ?, htmlContent = ?
    WHERE id = ?
  `
  const values = [
    title,
    description,
    JSON.stringify(imagePaths),
    htmlContent,
    projectId,
  ]

  db.query(query, values, (updateErr, updateResult) => {
    if (updateErr) {
      console.error("Error updating project:", updateErr)
      return res.status(500).json({ error: updateErr.message })
    }

    return res.json({ message: "Project updated successfully" })
  })
})

app.delete("/previous_projects/:id", (req, res) => {
  const projectId = req.params.id

  const query = "DELETE FROM previous_projects WHERE id = ?"
  db.query(query, [projectId], (err, result) => {
    if (err) {
      console.error("Error deleting project:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Project deleted successfully" })
  })
})

//////////////////
//// services ////
//////////////////

app.get("/services", (req, res) => {
  const query = "SELECT * FROM services"
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(results)
    }
  })
})

app.post("/services", upload.array("images", 10), (req, res) => {
  const { title, description, advantages, htmlContent } = req.body
  const imagePaths = req.files.map((file) => file.filename)

  if (!title || !description || !advantages || imagePaths.length === 0) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const query = `
    INSERT INTO services (title, description, images, advantages, htmlContent)
    VALUES (?, ?, ?, ?, ?)
  `
  const values = [
    title,
    description,
    JSON.stringify(advantages),
    JSON.stringify(imagePaths),
    htmlContent,
  ]

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting service:", err)
      return res.status(500).json({ error: err.message })
    }
    res
      .status(201)
      .json({ message: "Service added successfully", id: result.insertId })
  })
})

app.put("/services/:id", upload.array("images", 10), (req, res) => {
  const serviceId = req.params.id
  const { title, description, advantages, htmlContent, existingImages } =
    req.body
  const newImagePaths = req.files.map((file) => file.filename)

  let imagePaths = []
  if (existingImages) {
    try {
      imagePaths = JSON.parse(existingImages)
    } catch (error) {
      return res.status(400).json({ message: "Invalid existing images format" })
    }
  }

  imagePaths = imagePaths.concat(newImagePaths)

  const query = `
    UPDATE services 
    SET title = ?, description = ?, advantages = ?, images = ?, htmlContent = ?
    WHERE id = ?
  `
  const values = [
    title,
    description,
    JSON.stringify(advantages),
    JSON.stringify(imagePaths),
    htmlContent,
    serviceId,
  ]

  db.query(query, values, (updateErr, updateResult) => {
    if (updateErr) {
      console.error("Error updating service:", updateErr)
      return res.status(500).json({ error: updateErr.message })
    }

    return res.json({ message: "Service updated successfully" })
  })
})

app.delete("/services/:id", (req, res) => {
  const serviceId = req.params.id

  const query = "DELETE FROM services WHERE id = ?"
  db.query(query, [serviceId], (err, result) => {
    if (err) {
      console.error("Error deleting service:", err)
      return res.status(500).json({ error: err.message })
    }
    res.json({ message: "Service deleted successfully" })
  })
})

//////////////////
//// contacts ////
//////////////////

app.get("/contacts", (req, res) => {
  const query = "SELECT * FROM contacts"
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(results)
    }
  })
})

app.put("/contacts", (req, res) => {
  const { phoneNumber, whatsappNumber, emailAddress, instagramLink } = req.body

  if (!phoneNumber || !whatsappNumber || !emailAddress || !instagramLink) {
    return res.status(400).json({ error: "All fields are required." })
  }

  const updateQuery = `
    UPDATE contacts 
    SET phoneNumber = ?, whatsappNumber = ?, emailAddress = ?, instagramLink = ?
    WHERE id = ?
  `
  const values = [phoneNumber, whatsappNumber, emailAddress, instagramLink, 1]

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating contacts:", err)
      return res.status(500).json({ error: err.message })
    }

    res.json({ message: "Contacts updated successfully" })
  })
})

app.listen(port, () => {
  console.log(`Server running on https://localhost:${port}`)
})
