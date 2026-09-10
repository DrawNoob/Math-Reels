const KEY = "math_reels_created_count";

module.exports = async function handler(req, res) {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!baseUrl || !token) {
    res.status(500).json({
      error: "Vercel KV не підключено до проєкту. Додай базу в Storage → Create Database → KV і зроби redeploy."
    });
    return;
  }

  try {
    const path = req.method === "POST" ? "incr" : "get";
    const upstream = await fetch(`${baseUrl}/${path}/${KEY}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!upstream.ok) {
      res.status(502).json({ error: "Сховище лічильника недоступне." });
      return;
    }

    const data = await upstream.json();
    const count = parseInt(data.result, 10) || 0;

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Не вдалося звернутися до сховища лічильника." });
  }
}
