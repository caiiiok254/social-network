module.exports = (sequelize, DataTypes) => {
  return sequelize.define('friendship', {
      userId: {
        type: DataTypes.INTEGER
      },
      friendId: {
        type: DataTypes.INTEGER
      }
    }
  );
};
