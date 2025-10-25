import express from "express";
import {parse} from "csv-parse";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), "server/.env") });


const app = express();
const port = 3000;
const upload = multer({dest:'uploads/'});


const ai = new GoogleGenAI({});
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";


//const monthIncome



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
  const monthlyTotals = computeMonthlySpending(data);
  const superCategoryStats = computeSuperCategories(data, categoryMap);

  // Limit to the past 12 months
  const chartData = make12MonthChartData(monthlyTotals);

  return {
    monthlySpending: {
      monthlyTotals: chartData.reduce((acc, { month, total }) => {
        acc[month] = total;
        return acc;
      }, {}),
      chartData
    },
    superCategories: superCategoryStats
  };
}

function make12MonthChartData(monthlyTotals) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const chartData = [];

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyTotals[key]) {
      chartData.unshift({ month: key, total: monthlyTotals[key] });
    }
  }

  return chartData;
}



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



// Normalize various response formats to a string
function normalizeText(resp) {
  if (!resp) return '';
  if (typeof resp === 'string') return resp;
  if (resp.text) return resp.text;

  const output = resp.output?.[0]?.content;
  if (Array.isArray(output)) {
    const textBlock = output.find(block => block.type === 'text' && block.text);
    if (textBlock) return textBlock.text ?? textBlock;
  } 
  try { return JSON.stringify(resp); } catch { return String(resp); }
}

//prompt function, takes input for prompt and model, gets response based on provided info
export async function generateGeminiResponse({prompt, model = DEFAULT_MODEL, temperature = 0.2, maxOutputTokens = 512 } = {}) {
  const contents = Array.isArray(prompt) ? prompt : [{ type: "text", text: String(prompt) }];
  const resp = await ai.models.generateContent({
    model,
    contents,
    temperature,
    maxOutputTokens,
  });
  return normalizeText(resp);
}

//helper funciton, call in postroute to get explanation of provided data
export async function explain({text, opts = {} } = {}) {
  const prompt = 'Give detailed and concise explanations for the following text:\n"""\n' + text + '\n"""';
  return await generateGeminiResponse({ prompt, ...opts})
}

export async function analyze({text, opts = {}} = {}) {
  const prompt = 'Analyze the following data and proved financial and logical insights:\n"""\n' + text + '\n"""';
  return await generateGeminiResponse({ prompt, ...opts})
}

export async function answerQuestion({text, opts = {}} = {}) {
  const prompt = 'Answer the following question accurately and concisely:\n"""\n' + text + '\n"""';
  return await generateGeminiResponse({ prompt, ...opts})
}


//postroute for explanation
app.post("/explain", express.json(), async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'No text provided' });

        const explanation = await explain({ text, opts: { temperature: 0.1, maxOutputTokens: 200} });
        res.json({ explanation });
    } catch (err) {
        console.error('Error generating explanation:', err);
        res.status(500).json({ error: 'Failed to generate explanation' });
    }
});



// Test Gemini integration
async function testGemini() {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}



//test call on explain function
const p = explain({ text: "explain common financial terms like ROI, EBITDA, and liquidity." });
p.then(r => console.log("done:", r)).catch(console.error);

// Run test
(async () => {
    try {
      await testGemini();
    } catch (err) {
      console.error("Gemini test failed:", err);
    }
  })();
  