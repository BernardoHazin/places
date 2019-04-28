const {
  hashPassword,
  comparePassword
} = require('../../controllers/userController/functions')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING(128).BINARY,
        unique: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(128).BINARY,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(128).BINARY,
        allowNull: false
      },
      profileImg: {
        type: DataTypes.STRING(128).BINARY
      }
    },
    {
      hooks: {
        beforeCreate: hashPassword
      }
    }
  )

  User.prototype.comparePassword = comparePassword

  User.associate = function(models) {
    // Set Associations
    // User.belongsTo(models.Wallet, {foreignKey: 'wallet'})
  }

  return User
}
