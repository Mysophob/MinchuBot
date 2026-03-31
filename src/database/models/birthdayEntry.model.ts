import { DataTypes, Model } from 'sequelize';
import sequelize from '../sqlLiteConnector';

interface BirthdayAttributes {
    userID: string;
    user: string;
    birthdayDate: string; // ISO date string, e.g. "1990-07-15"
}

interface BirthdayInstance extends Model<BirthdayAttributes>, BirthdayAttributes {}

const birthdayModel = sequelize.define<BirthdayInstance>('birthdays', {
    userID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthdayDate: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export type Birthday = BirthdayAttributes;
export default birthdayModel;