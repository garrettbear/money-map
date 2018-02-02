module.exports = function(sequelize, Sequelize) {
 
    var User = sequelize.define('User', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        username: {
            type: Sequelize.TEXT
        },
 
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('active', 'inactive'),
            defaultValue: 'active'
        }
    });
    User.associate = function(models) {
        
        User.hasMany(models.MoneyData, {
            onDelete: "cascade"
          });
    };
    return User;
 
}