import express from "express";
import {parse} from "csv-parse";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
//import { config } from "dotenv";
import dotenv from "dotenv";
import path from "path";
//config({ path: path.resolve(process.cwd(), "server/.env") });

dotenv.config();


dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(GEMINI_API_KEY);


const app = express();
const port = 3000;
const upload = multer({dest:'uploads/'});

/* Manual CORS middleware */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : new GoogleGenAI({});

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

var averageSpend;

const computeMonthlySpending = (data) => {
  const now = new Date("9-08-2024");
  const monthlyTotals = {};

  data.forEach((row) => {
    if (!row.date || !row.amount) return;
    const date = new Date(row.date);
    if (isNaN(date)) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const amount = parseFloat(row.amount);
    if (isNaN(amount)) return;

    monthlyTotals[key] = (monthlyTotals[key] || 0) + amount;
  });


  let sum = 0;

  const chartData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    sum += monthlyTotals[key] || 0;
    chartData.push({ x: key, y: monthlyTotals[key] || 0 });
  }

  averageSpend = sum/12;

  return { chartData, averageSpend };
};


const computeSavingsProjection = (monthlyIncome) => {
  const monthlySavings = monthlyIncome - averageSpend;
  const monthlyRate = 0.07;
  const projections = [];

  for (let years = 5; years <= 40; years += 5) {

    const futureValue = monthlySavings * Math.pow(1 + monthlyRate/ 12,  12*40);

    projections.push({
      years,
      futureValue: parseFloat(futureValue.toFixed(2))
    });
  }

  return projections;
};

const compareDailySpending = (data) => {
  const now = new Date("9-12-24");

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); 
  const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const prevYear = prevMonthDate.getFullYear();
  const prevMonth = prevMonthDate.getMonth();

  
  const currentMonthTotals = {};
  const previousMonthTotals = {};

  data.forEach((row) => {
    if (!row.date || !row.amount) return;
    const date = new Date(row.date);
    if (isNaN(date)) return;

    const day = date.getDate();
    const amount = parseFloat(row.amount) || 0;

    if (date.getFullYear() === currentYear && date.getMonth() === currentMonth) {
      currentMonthTotals[day] = (currentMonthTotals[day] || 0) + amount;
    } else if (date.getFullYear() === prevYear && date.getMonth() === prevMonth) {
      previousMonthTotals[day] = (previousMonthTotals[day] || 0) + amount;
    }
  });


  const comparisons = [];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const current = currentMonthTotals[day] || 0;
    const previous = previousMonthTotals[day] || 0;

    comparisons.push({
      day,
      currentMonth: parseFloat(current.toFixed(2)),
      previousMonth: parseFloat(previous.toFixed(2)),
    });
  }

  return comparisons;
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

    const comparing = compareDailySpending(data);

    res.json({ message: 'File parsed successfully', insights, monthlySpending, savingsProjection, comparing });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});




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

const spendingData2 = {
  income: 3000,
  categories: {
    rent: 1000,
    dining_out: 400,
    groceries: 300,
    entertainment: 325,
    transportation: 250,
    shopping: 400,
    other: 300
  }
};


//functions below all prompt the AI model, parse the response, and return it in JSON format
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

  try {
    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (e) {
    console.error("Failed to parse response:", e);
  }
}

const spendData = await spendingAdvice(spendingData);
console.log(spendData);


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

  try {
    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (e) {
    console.error("Failed to parse response:", e);
  }
}

const investData = await investmentAdvice(spendingData);
console.log(investData);


async function comparison(month1, month2) {
const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents:
"Give detailed yet concise(one sentence) insights on the spending habits between month 1 and month 2 and how the user can regulate spending going forward(be specific) based on what they are most likely to spend money on. Return the advice and an estimated amount saved by the next month if they follow your advice. User Spending Data Month 1: " + JSON.stringify(month1) + " User Spending Data Month 2: " + JSON.stringify(month2),
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
try {
    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (e) {
    console.error("Failed to parse response:", e);
  }
}

const compData = await comparison(spendingData, spendingData2);
console.log(compData);


const futureNetworthPrediction = (monthlyIncome) => {
  let projections = [];

  for(let years = 0; years <= 50; years += 5)
  {
    let curSum = 0;

    for(let months = 0; months <= years * 12; months++)
    {
      curSum = curSum * (1 + 0.07 / 12) + monthlyIncome;
    }
    
    projections.push({
      years,
      futureValue: parseFloat(curSum.toFixed(2))
    });
  }

  return projections;
}
