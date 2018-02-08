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
        first_name: {
            type: Sequelize.STRING,
            validate:{
                len: [1,140]
            }
        },
        last_name:{
            type: Sequelize.STRING,
            validate:{
                len: [1,140]
            }
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