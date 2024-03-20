const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const food_entries = sequelize.define(
    'food_entries',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      calorie_count: {
        type: DataTypes.DECIMAL,
      },

      fat_content: {
        type: DataTypes.DECIMAL,
      },

      protein_content: {
        type: DataTypes.DECIMAL,
      },

      carbohydrate_content: {
        type: DataTypes.DECIMAL,
      },

      entry_date: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  food_entries.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.food_entries.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.food_entries.hasMany(db.file, {
      as: 'food_image',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.food_entries.getTableName(),
        belongsToColumn: 'food_image',
      },
    });

    db.food_entries.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.food_entries.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return food_entries;
};
