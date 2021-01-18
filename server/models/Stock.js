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
    static associate({ Stocktype }) {
      // define association here
      this.belongsTo(Stocktype, { foreignKey: 'stocktypeId', as: 'stocktype' })
    }
    toJSON() {
      return { ...this.get(), id: undefined, stocktypeId: undefined }
    }
  };
  Stock.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: DataTypes.FLOAT
  }, {
    sequelize,
    tableName: 'stock',
    modelName: 'Stock',
  });
  return Stock;
};