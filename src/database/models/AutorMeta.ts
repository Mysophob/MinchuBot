import { DataTypes } from 'sequelize';
import sequelize from '../sqlLiteConnector';

const screenshotCounterModel = sequelize.define('screenshotCounter', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    screenshotCounter: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

export default screenshotCounterModel;