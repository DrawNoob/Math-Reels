const { handleUpload } = require("@vercel/blob/client");
const { upstashCommand } = require("./_upstash");

const LIST_KEY = "math_reels_gallery";
const MAX_ITEMS = 5;

module.exports = async function handler(req, res) {
  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          allowedContentTypes: ["video/webm"],
          addRandomSuffix: true,
          maximumSizeInBytes: 60 * 1024 * 1024,
          tokenPayload: clientPayload
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        let caption = "";
        try { caption = JSON.parse(tokenPayload || "{}").caption || ""; } catch (e) {}

        const entry = { url: blob.url, caption, createdAt: Date.now() };

        await upstashCommand(["LPUSH", LIST_KEY, JSON.stringify(entry)]);
        await upstashCommand(["LTRIM", LIST_KEY, "0", String(MAX_ITEMS - 1)]);
      }
    });

    res.status(200).json(jsonResponse);
  } catch (err) {
    res.status(400).json({ error: err.message || "Не вдалося завантажити рілс у галерею." });
  }
};
