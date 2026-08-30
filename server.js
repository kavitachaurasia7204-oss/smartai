import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:"1mb"}));
app.use(express.static(path.join(__dirname,"public")));

const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;

app.post("/api/chat", async (req,res)=>{
  try{
    if(!client) return res.status(503).json({error:"API key is not configured yet."});
    const message = String(req.body?.message || "").trim();
    if(!message) return res.status(400).json({error:"Message is empty."});
    const response = await client.responses.create({
      model:"gpt-5.6-luna",
      input: message
    });
    res.json({answer: response.output_text || "I couldn't generate a response."});
  }catch(e){
    console.error(e);
    res.status(500).json({error:"SmartAI couldn't answer right now."});
  }
});

app.listen(process.env.PORT || 3000, ()=>console.log("SmartAI running on http://localhost:"+(process.env.PORT||3000)));
