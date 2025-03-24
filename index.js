import express from "express";
import exphbs from "express-handlebars";
import sequelize from "./db/conn.js";
import session from "express-session";
import flash from "express-flash";
import sessionFileStore from "session-file-store";
import path from "path";
import ToughtRoutes from "./routes/ToughtsRoutes.js";
import ToughtController from "./controllers/ToughtController.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import { fileURLToPath } from "url";
import chalk from "chalk";
import "dotenv/config";

const FileStore = sessionFileStore(session);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Configuração da sessão
app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: path.join(__dirname, "sessions"), 
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

// Configuração do flash
app.use(flash());

app.use((req, res, next) => {

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// Rotas
app.use("/toughts", ToughtRoutes);
app.use("/", AuthRoutes);
app.get("/", ToughtController.showAll);

// Sincronização do Sequelize e inicialização do servidor
sequelize
  .sync()
  .then(() => {
    app.listen(PORT);
    console.log(chalk.yellow("Tabelas criadas com sucesso! http://localhost:" + PORT));
  })
  .catch((error) => {
    console.log("Erro ao criar tabelas: " + error);
  });