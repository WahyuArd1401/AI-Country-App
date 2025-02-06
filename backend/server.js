require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ "role": "user", "content": message }],
      temperature: 0.2,
      max_tokens: 1024
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
