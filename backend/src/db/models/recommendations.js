const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const recommendations = sequelize.define(
    'recommendations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.TEXT,
      },

      description: {
        type: DataTypes.TEXT,
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

  recommendations.associate = (db) => {
    db.recommendations.belongsToMany(db.users, {
      as: 'target_users',
      foreignKey: {
        name: 'recommendations_target_usersId',
      },
      constraints: false,
      through: 'recommendationsTarget_usersUsers',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.recommendations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.recommendations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return recommendations;
};
