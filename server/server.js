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

spendingAdvice(spendingData);
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

investmentAdvice(spendingData);
console.log('--------------------------------');


  