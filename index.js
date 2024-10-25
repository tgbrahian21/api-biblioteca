import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/bd.js";
import morgan from "morgan";
import cors from "cors";
import routesV1 from "./routes/v1/index.js";
import path from "path";
import { fileURLToPath } from "url";

// config
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// ENV
dotenv.config();
app.use(express.json());
app.use(morgan("dev"));



app.use(cors({
    origin: '*'
}));

// archivos static
app.use(express.static(path.join(__dirname, 'public')));
// images
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

// Db
connectDb();

// routes
app.use("/api/v1", routesV1);

// SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
})


