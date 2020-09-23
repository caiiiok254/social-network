module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
      name: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    }
  );
};
