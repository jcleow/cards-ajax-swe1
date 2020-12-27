import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

import gameModel from './game.mjs';
import userModel from './user.mjs';
import gamesUserModel from './gamesUser.mjs';

const env = process.env.NODE_ENV || 'development';

const config = allConfig[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

// add your model definitions to db here
db.Game = gameModel(sequelize, Sequelize.DataTypes);
db.User = userModel(sequelize, Sequelize.DataTypes);
db.GamesUser = gamesUserModel(sequelize, Sequelize.DataTypes);

// M:N association between User table and Game table
db.Game.belongsToMany(db.User, { through: db.GamesUser });
db.User.belongsToMany(db.Game, { through: db.GamesUser });

// 1-M association between CartsItem table and associated tables
// to access GamesUser table from Game and User instances
db.Game.hasMany(db.GamesUser);
db.GamesUser.belongsTo(db.Game);
db.User.hasMany(db.GamesUser);
db.GamesUser.belongsTo(db.User);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
