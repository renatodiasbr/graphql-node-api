import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize";
import { DbConnection } from "../interfaces/DbConnectionInterface";

const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {
  db = {};

  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );

  fs.readdirSync(__dirname)
    .filter(
      (f: string) =>
        f.indexOf(".") !== 0 && f !== basename && f.slice(-3) === ".js"
    )
    .forEach((f: string) => {
      const model = sequelize.import(path.join(__dirname, f));
      db[model["name"]] = model;
    });

  Object.keys(db).forEach((modelName: string) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db["sequelize"] = sequelize;
}

export default <DbConnection>db;
