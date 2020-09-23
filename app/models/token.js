module.exports = (sequelize, DataTypes) => {
  return sequelize.define('token', {
    token: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
    }
  });
};
