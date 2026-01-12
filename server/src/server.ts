import dotenv from "dotenv";
dotenv.config();
import "./cron/import.cron";
import "./jobs/job.worker";

import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(console.error);
