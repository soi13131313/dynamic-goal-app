export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { vision } = req.body

    if (!vision || typeof vision !== 'string') {
      return res.status(400).json({ error: 'vision is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not set' })
    }

    const prompt = `あなたは目標達成コーチです。
ユーザーの長期目標を、今日1日で実行できる具体的なタスクに分解してください。

ユーザーの目標：
「${vision}」

条件：
- 今日中に実行できるタスクを3つだけ出す
- それぞれ15分〜45分で終わる現実的な作業にする
- 曖昧な行動は禁止
- 必ず成果物が残る行動にする
- 余計な説明は不要

出力形式：
タスク1,タスク2,タスク3`

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return res.status(response.status).json({ error: errorText })
    }

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return res.status(200).json({ text })
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}