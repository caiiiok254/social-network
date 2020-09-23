const dbConfig = require("../config/env.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user')(sequelize, Sequelize);
db.token = require('./token')(sequelize, Sequelize);
db.friendship = require('./friend')(sequelize, Sequelize);

//Token unique binding
db.token.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'user',
});

//Friendship association
db.user.belongsToMany(db.user, {
  as: 'friends',
  through: 'friendship',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

module.exports = db;

