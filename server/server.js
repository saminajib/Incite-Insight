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

const superCategoryMap = {
  Restaurant: "Essentials",
  Restuarant: "Essentials", // correcting your CSV typo
  Market: "Essentials",
  Coffe: "Essentials", // typo correction from Coffee
  Coffee: "Essentials",
  Health: "Essentials",
  Clothing: "Essentials",
  Communal: "Essentials",
  Fuel: "Essentials",

  Taxi: "Transport",
  Transport: "Transport",
  "Rent Car": "Transport",
  
  Sport: "Entertainment",
  Events: "Entertainment",
  "Film/enjoyment": "Entertainment",
  Joy: "Entertainment",
  Motel: "Entertainment",
  Travel: "Entertainment",

  "Business lunch": "Business & Learning",
  Tech: "Business & Learning",
  business_expenses: "Business & Learning",
  Learning: "Business & Learning",
  Phone: "Business & Learning",

  Other: "Other"
};

const computeSuperCategoryCounts = (data) => {
  const result = {};

  data.forEach((row) => {
    const category = row.category || "Other";
    const superCat = superCategoryMap[category] || "Other";
    const amount = parseFloat(row.amount) || 0;

    if (!result[superCat]) {
      result[superCat] = { count: 0, totalAmount: 0 };
    }

    result[superCat].count += 1;
    result[superCat].totalAmount += amount;
  });

  return result;
};

const computeMonthlySpending = (data) => {
  const now = new Date("9-25-2024");
  const monthlyTotals = {};

  data.forEach((row) => {
    if (!row.date || !row.amount) return;

    const date = new Date(row.date);
    if (isNaN(date)) return;

    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amount = parseFloat(row.amount);
    if (isNaN(amount)) return;

    if (!monthlyTotals[yearMonth]) monthlyTotals[yearMonth] = 0;
    monthlyTotals[yearMonth] += amount;
  });

  return monthlyTotals;
};



app.post("/upload", upload.single('file'), async (req, res) => {
    try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const data = await parseCSV(req.file.path);
    
    const insights = computeSuperCategoryCounts(data);
    const monthlySpending = computeMonthlySpending(data);

    fs.unlink(req.file.path, () => {});

    res.json({ message: 'File parsed successfully', data, insights, monthlySpending });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});