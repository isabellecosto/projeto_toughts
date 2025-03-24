import { Sequelize } from "sequelize";
import chalk from "chalk";

const sequelize = new Sequelize("nodeprojeto2", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false
})

sequelize.authenticate().then(() => {
    console.log(chalk.bgCyan.white("Conexão com o banco de dados realizada com sucesso!"))
}).catch((error) => {
    console.log("Erro ao conectar com o banco de dados: " + error)
})

export default sequelize;