import express from "express";
import {parse} from "csv-parse";
import multer from "multer";
import fs from "fs";

const app = express();
const port = 3000;
const upload = multer({dest:'uploads/'});

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
        .pipe(parse({columns: true, skip_empty_lines: true}))
        .on('data', (row) => records.push(row))
        .on('end', () => resolve(records))
        .on('error', reject);
    });
};

app.post("/upload", upload.single('file'), async (req, res) => {
    try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const data = await parseCSV(req.file.path);

    fs.unlink(req.file.path, () => {});

    res.json({ message: 'File parsed successfully', data });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});