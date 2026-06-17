import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import chatRouter from "./routes/chat.routes.js";
import authRouter from "./routes/auth.routes.js";
import helmet from "helmet";
import ragRouter from "./features/rag/routes/rag.route.js";
import config from "./config/config.js";

const app = express();
app.set('trust proxy', 1); // trust first proxy for secure cookies

// MIDDLEWARE
app.use(morgan("dev"));
app.use(helmet());

const allowedOrigins = [
  config.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");
    const isAllowed = allowedOrigins.some(allowed => {
      return allowed.trim().replace(/\/+$/, "").toLowerCase() === normalizedOrigin.toLowerCase();
    });

    if (isAllowed || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS error: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
// Silence Chrome DevTools well-known probe (harmless browser request)
app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
  res.status(204).end();
});

app.get("/", (req, res) => {
  res.send("Welcome to MentoAI Backend!");
});

app.use("/api/chat/message", chatRouter);

app.use("/api/auth", authRouter);
app.use("/api/rag", ragRouter);

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'Server is healthy' }));

// Catch-all 404 for API routes (JSON response)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  next();
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
});

export default app;
