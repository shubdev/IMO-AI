import "./src/config/config.js";
import path from "path";
import express from "express";

const { default: connectDB } = await import("./src/config/db.js");
const { default: app } = await import("./src/app.js");

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const buildPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(buildPath));
  app.use((req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});