'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Stocktype, Notes }) {
      // define association here
      this.belongsTo(Stocktype, { foreignKey: 'stocktypeId', as: 'stocktype' })
      this.hasMany(Notes, { foreignKey: 'stockId', as: 'notes' })
    }
    toJSON() {
      return { ...this.get(), id: undefined }
    }
  };
  Stock.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Stock must have a name" },
        notEmpty: { msg: "Stock must not be empty" }
      }
    },
    value: DataTypes.FLOAT,
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


    minAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    sequelize,
    tableName: 'stock',
    modelName: 'Stock',
  });
  return Stock;
};