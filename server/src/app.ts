import express from "express";
import cors from "cors";
import importLogRoutes from "./routes/importLogs.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/import-logs", importLogRoutes);

export default app;
