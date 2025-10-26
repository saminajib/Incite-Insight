import express from "express";
import {parse} from "csv-parse";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import path from "path";

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
  Restuarant: "Essentials",
  Market: "Essentials",
  Coffe: "Essentials", 
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


  return { chartData };
};



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
    const lastTenRows = data.slice(-10);

    
    const insights = computeSuperCategoryCounts(data);
    const { chartData: monthlySpending} = computeMonthlySpending(data);
    const monthlyIncome = parseFloat(req.body.monthlyIncome);
    

    const savingsProjection = futureNetworthPrediction(monthlyIncome);
    fs.unlink(req.file.path, () => {});

    const comparing = compareDailySpending(data);

    res.json({ message: 'File parsed successfully', lastTenRows, insights, monthlySpending, savingsProjection, comparing });
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).json({ error: 'Failed to process CSV' });
  }
});


app.post("/Gemini", upload.single('file'), async (req, res) => {
    const monthlyIncome = parseFloat(req.body.monthlyIncome);
    const filePath = req.file.path;
    try {
      if (!req.body) return res.status(400).json({ error: 'No data provided' });
      if (!monthlyIncome) return res.status(400).json({ error: 'Income not provided' });

      const csvData = fs.readFileSync(filePath, "utf-8");
      const data = await monthlySpendingByCategory(csvData);


      const now = new Date();
      const lastMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
      const lastMonthData = await findMonthlyData(data, lastMonth);

      const spendingData = {
        income: monthlyIncome,
        categories: lastMonthData || {}
      };

      const spendingAdviceResult = await spendingAdvice(spendingData);
      const investmentAdviceResult = await investmentAdvice(spendingData);
      const alertResult = await alert(spendingData);
      const forecastingResult = await forecasting(spendingData);

      const consolidateResponse = {
        message: "File processed successfully",
        monthlySpending: data,
        lastMonthData,
        responses: {
          spendingAdvice: spendingAdviceResult,
          investmentAdvice: investmentAdviceResult,
          alert: alertResult,
          forecasting: forecastingResult
        }
      };

      fs.unlink(filePath, () => {});

      res.json(consolidateResponse);

    } catch (err) {
      console.error('Error processing Gemini API request:', err);
      res.status(500).json({ error: 'Failed to process Gemini API request' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});



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


//function for investment advice from gemini
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

//spending alert function that will find alarming spending habits
async function alert(data) {
const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents:
"Analyze the data provided and give detailed yet concise(one sentence) insights on alarming spending habits. Give an estimated amount that could be saved if they fix these bad habits. User data: " + JSON.stringify(data),
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

async function forecasting(data) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Based on the data provided, forecast the user's financial situation for the next month. Keep it conicse in one sentence and provide an estimated amount of free cash they would have. User data: " + JSON.stringify(data),
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


//function that passes in the parsed csv data separated by month with supercategories and finds the specific month
async function findMonthlyData(data, month) {
  return data[month];
}

//getting monthly spending by category with the supercategory mapping for total spending per category per month
async function monthlySpendingByCategory(csvData) {
  return new Promise((resolve, reject) => {
    parse(csvData, { columns: true, trim: true }, (err, rows) => {
      if (err) {
        console.error("Error parsing CSV data:", err);
        return reject(err); // Reject the promise on error
      }

      const result = {};

      rows.forEach(row => {
        const date = row.date;
        const category = row.category;
        const amount = parseFloat(row.amount);

        if (!date || !category || isNaN(amount)) {
          console.warn("Skipping invalid row:", row);
          return; // Skip invalid rows
        }

        const month = date.slice(0, 7); // Extract YYYY-MM
        const superCategory = superCategoryMap[category] || "Other";

        if (!result[month]) {
          result[month] = {};
        }


        if (!result[month][superCategory]) {
          result[month][superCategory] = 0;
        }

        result[month][superCategory] += amount;
      });

      for (const month in result) {
        for (const superCategory in result[month]) {
          result[month][superCategory] = parseFloat(result[month][superCategory].toFixed(2));
        }
      }

      resolve(result);
    });
  });
}


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
