module.exports = function(sequelize, Sequelize) {
    var MoneyData = sequelize.define('MoneyData',{
        input_id:{
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        price: {
            type: Sequelize.DECIMAL(10,2),
            validate: {
                isDecimal: true
            }
        },
        category:{
            type: Sequelize.STRING
        },
        comment:{
            type: Sequelize.STRING,
            validate: {
                len: [1, 140]
            }
        }
    });
    MoneyData.associate = function(models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        
        MoneyData.belongsTo(models.User, {
            foreignKey: {
              allowNull: false
            }
        });
    };
    return MoneyData;
}