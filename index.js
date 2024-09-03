const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv=require("dotenv")
dotenv.config()
const app = express();
const port = process.env.PORT

// Define the folder path where text files will be stored
const folderPath = path.join(__dirname, "texts");

// Create the folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Endpoint to create a text file with the current timestamp
app.post("/create-file", (req, res) => {
  // Generate the current timestamp and format it for filename
  const dateTime = new Date().toISOString().replace(/:/g, "-");
  const filename = `${dateTime}.txt`;
  const filePath = path.join(folderPath, filename);

  // Write the current timestamp into the text file
  fs.writeFile(filePath, dateTime, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating file", error: err });
    }
    res
      .status(200)
      .json({ message: `File ${filename} created successfully!`, filePath });
  });
});

// Endpoint to retrieve all text files in the folder
app.get("/list-files", (req, res) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error reading files", error: err });
    }

    // Filter to get only text files
    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    res.status(200).json({ files: textFiles });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
