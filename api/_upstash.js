async function upstashCommand(cmd) {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!baseUrl || !token) {
    throw new Error("KV не підключено (немає KV_REST_API_URL / KV_REST_API_TOKEN).");
  }

  const r = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(cmd)
  });

  if (!r.ok) {
    throw new Error("Upstash REST API повернув помилку: " + r.status);
  }

  const data = await r.json();
  return data.result;
}

module.exports = { upstashCommand };
