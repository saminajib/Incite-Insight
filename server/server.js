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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const app = express();
const port = 3000;
const upload = multer({dest:'uploads/'});


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


app.post("/Gemini", upload.single('file'), async (req, res) => {
    console.log("Received request at /Gemini endpoint");
    const income = req.body.income;
    const filePath = req.file.path;
    console.log("Recieved file at path:", filePath);
    try {
      if (!req.body) return res.status(400).json({ error: 'No data provided' });
      if (!income) return res.status(400).json({ error: 'Income not provided' });

      const csvData = fs.readFileSync(filePath, "utf-8");
      console.log("CSV Data:", csvData.slice(0, 100)); // Log first 100 characters for verification
      const data = await monthlySpendingByCategory(csvData);


      const now = new Date();
      const lastMonth = `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
      const lastMonthData = await findMonthlyData(data, lastMonth);

      const spendingData = {
        income: income,
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
