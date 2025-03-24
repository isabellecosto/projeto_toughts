import { DataTypes } from "sequelize";
import sequelize from "../db/conn.js";

import User from "./User.js";

const Tought = sequelize.define("Tought", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Tought.belongsTo(User);
User.hasMany(Tought);

export default Tought;