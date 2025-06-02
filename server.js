// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/api/suggest-meal", async (req, res) => {
  const { budget, ingredients, preference } = req.body;

  const prompt = `
Tôi có ngân sách ${budget} VNĐ và các nguyên liệu sau: ${ingredients}.
${preference ? `Tôi thích món: ${preference}.` : ""}
Hãy gợi ý giúp tôi 1-2 món ăn ngon, dễ làm, phù hợp ngân sách.
Cho biết tên món, nguyên liệu cần thêm (nếu có), cách chế biến, và chi phí ước tính.
Trình bày xuống dòng rõ ràng như nhân viên văn phòng.
Trả lời bằng tiếng Việt.
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // hoặc domain của bạn
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // hoặc mô hình khác như "mistralai/mistral-7b-instruct"
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const data = await response.json();
    res.json({
      result: data.choices?.[0]?.message?.content || "Không có phản hồi.",
    });
  } catch (err) {
    console.error("Lỗi gọi OpenRouter:", err);
    res.status(500).json({ error: "Không gọi được OpenRouter API" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
