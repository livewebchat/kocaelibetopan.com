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