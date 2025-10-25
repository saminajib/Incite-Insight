import express from "express";
import {parse} from "csv-parse";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), "server/.env") });


const app = express();
const port = 3000;
const upload = multer({dest:'uploads/'});


app.use(express.urlencoded({ extended: true })); 


const ai = new GoogleGenAI({});
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";


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

var averageSpend;

const computeMonthlySpending = (data) => {
  const now = new Date("9-08-2024");
  const monthlyTotals = {};

  // First, sum amounts per year-month
  data.forEach((row) => {
    if (!row.date || !row.amount) return;
    const date = new Date(row.date);
    if (isNaN(date)) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const amount = parseFloat(row.amount);
    if (isNaN(amount)) return;

    monthlyTotals[key] = (monthlyTotals[key] || 0) + amount;
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let sum = 0;

  const chartData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthShort = monthNames[d.getMonth()];
    sum += monthlyTotals[key] || 0;
    chartData.push({ month: monthShort, total: monthlyTotals[key] || 0 });
  }

  averageSpend = sum/12;

  return { chartData, averageSpend };
};


const computeSavingsProjection = (monthlyIncome) => {
  const monthlySavings = monthlyIncome - averageSpend;
  const monthlyRate = 0.07;
  const totalYears = 40;
  const projections = [];

  for (let years = 5; years <= totalYears; years += 5) {
    const months = years * 12;

    const futureValue = monthlySavings * ((Math.pow(1 + monthlyRate/ months, 12)));
    projections.push({
      years,
      futureValue: parseFloat(futureValue.toFixed(2))
    });
  }

  return projections;
};


app.post("/upload", upload.single('file'), async (req, res) => {
    try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const data = await parseCSV(req.file.path);
    
    const insights = computeSuperCategoryCounts(data);
    const { chartData: monthlySpending, averageSpend } = computeMonthlySpending(data);
    console.log(averageSpend);
    const monthlyIncome = parseFloat(req.body.monthlyIncome);
    

    const savingsProjection = computeSavingsProjection(monthlyIncome, averageSpend);
    fs.unlink(req.file.path, () => {});

    res.json({ message: 'File parsed successfully', insights, monthlySpending, savingsProjection });
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




// test prompt creation
const spendingData = {
  income: 4000,
  categories: {
    rent: 1500,
    dining_out: 600,
    groceries: 450,
    entertainment: 300,
    transportation: 250,
    shopping: 400,
    other: 200
  }
};

async function spendingAdvice(data) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Give some spending advice on the data above while being specific, send with one advice sentence that is detailed as well as one estimate on how much could be saved by the next month. User Spending Data: " + JSON.stringify(data),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
            },
            estimate: {
              type: Type.INTEGER,
            },
          },
          propertyOrdering: ["advice", "estimate"],
        },
      },
    },
  });

  console.log(response.text);
}

//spendingAdvice(spendingData);
console.log('--------------------------------');

async function investmentAdvice(data) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Provide investment advice based on the transaction data provided, make it concise and return in a single sentence as well as an estimate on return in the next 6 months. User Spending Data: " + JSON.stringify(data),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
            },
            estimate: {
              type: Type.INTEGER,
            },
          },
          propertyOrdering: ["advice", "estimate"],
        },
      },
    }
  });
  console.log(response.text);
}

//investmentAdvice(spendingData);
console.log('--------------------------------');
console.log()


  