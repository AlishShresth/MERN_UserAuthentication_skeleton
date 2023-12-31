import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import Template from "../template";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send(Template());
});

app.use("/", userRoutes); // this will make the routes we define in user.routes.js accessible from the client-side
app.use("/", authRoutes); // this will make the routes we define in auth.routes.js accessible from the client-side

export default app;
