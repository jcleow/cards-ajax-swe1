export default function gamesUserModel(sequelize, DataTypes) {
  return sequelize.define('GamesUser', {
    result: {
      type: DataTypes.STRING,
    },
    times_won: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
  });
}
