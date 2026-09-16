import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3001;
const GEMINI_MODEL = 'gemini-2.5-flash';
const CHOICE_LABELS = ['ア', 'イ', 'ウ', 'エ'];

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

const app = express();
app.use(cors());
app.use(express.json());

function getClient(res: express.Response): GoogleGenAI | null {
  if (!genAI) {
    res.status(500).json({
      error: 'サーバーに GEMINI_API_KEY が設定されていません。.env に設定してください。',
    });
    return null;
  }
  return genAI;
}

app.post('/api/explain', async (req, res) => {
  const client = getClient(res);
  if (!client) return;

  const { question, choices, correctIndex, selectedIndex, baseExplanation } = req.body ?? {};

  if (typeof question !== 'string' || !Array.isArray(choices) || choices.length !== 4) {
    res.status(400).json({ error: 'リクエストの形式が不正です。' });
    return;
  }

  const choiceLines = choices
    .map((c: string, i: number) => `${CHOICE_LABELS[i]}. ${c}`)
    .join('\n');
  const selectedLabel =
    typeof selectedIndex === 'number' && selectedIndex >= 0 ? CHOICE_LABELS[selectedIndex] : '未回答';
  const correctLabel = typeof correctIndex === 'number' ? CHOICE_LABELS[correctIndex] : '不明';

  const prompt = `あなたは中小企業診断士 第1次試験の受験指導講師です。次の設問について、受験生の理解を深めるための解説を作成してください。

【設問】
${question}

【選択肢】
${choiceLines}

【正解】${correctLabel}
【受験生の解答】${selectedLabel}
【既存の簡易解説】${baseExplanation ?? '(なし)'}

以下の観点を含め、日本語で400字程度で分かりやすく解説してください:
1. なぜ正解の選択肢が正しいのか、背景知識や関連する理論・制度も交えて説明する
2. 受験生が選んだ選択肢が誤りの場合、なぜその選択肢が誤りなのか、どこで判断を誤りやすいかを説明する
3. 本試験で同じ論点が問われた場合に役立つ覚え方や関連知識があれば触れる

解説本文のみを出力し、見出しや前置きは不要です。`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.json({ explanation: response.text?.trim() ?? '解説を生成できませんでした。' });
  } catch (err) {
    console.error('[api/explain] Gemini error:', err);
    res.status(502).json({ error: 'AI解説の生成中にエラーが発生しました。時間をおいて再試行してください。' });
  }
});

const generatedQuestionSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['text', 'choices', 'correctIndex', 'explanation'],
      },
    },
  },
  required: ['questions'],
};

app.post('/api/generate-questions', async (req, res) => {
  const client = getClient(res);
  if (!client) return;

  const { subjectName, count } = req.body ?? {};
  if (typeof subjectName !== 'string' || !subjectName) {
    res.status(400).json({ error: '科目名が指定されていません。' });
    return;
  }
  const safeCount = Math.min(10, Math.max(1, Number(count) || 3));

  const prompt = `あなたは中小企業診断士 第1次試験の問題作成者です。「${subjectName}」の科目について、本試験と同程度の難易度・形式の4択問題を${safeCount}問、新規に作成してください。

制約:
- 各問題は choices に4つの選択肢を含め、correctIndex(0始まりのインデックス)で正解を示すこと
- explanation には、正解の理由と他の選択肢が誤りである理由を含む日本語の解説を200字程度で記載すること
- 実在の過去問の文章をそのまま複製せず、独自に作成したオリジナルの演習問題とすること
- 出力は指定されたJSONスキーマの形式のみとし、それ以外のテキストを含めないこと`;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: generatedQuestionSchema,
      },
    });

    const parsed = JSON.parse(response.text ?? '{}');
    const questions = Array.isArray(parsed.questions) ? parsed.questions : [];

    const validated = questions
      .filter((q: { choices?: unknown[] }) => Array.isArray(q.choices) && q.choices.length === 4)
      .slice(0, safeCount);

    res.json({ questions: validated });
  } catch (err) {
    console.error('[api/generate-questions] Gemini error:', err);
    res.status(502).json({ error: 'AI問題生成中にエラーが発生しました。時間をおいて再試行してください。' });
  }
});

// Production: serve the built frontend
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get(/^(?!\/api\/).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(404).send('Not built yet. Run `npm run build` first.');
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
