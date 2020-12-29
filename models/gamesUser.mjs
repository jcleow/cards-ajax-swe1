export default function gamesUserModel(sequelize, DataTypes) {
  return sequelize.define('GamesUser', {
    score: {
      type: DataTypes.INTEGER,
    },
    player_num: {
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
  });
}
