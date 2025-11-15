import { DataTypes, Model } from 'sequelize';
import sequelize from '../sqlLiteConnector';

interface UserCurrencyAttributes {
    userId: string;
    userName: string;
    currency: number;
    lastBegTime: number;
}

interface UserCurrencyInstance extends Model<UserCurrencyAttributes>, UserCurrencyAttributes { }

const DEFAULT_CURRENCY_STARTAMOUNT = 100;

const userCoinflipModel = sequelize.define<UserCurrencyInstance>('userCurrency', {
    userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    currency: {
        type: DataTypes.INTEGER,
        defaultValue: DEFAULT_CURRENCY_STARTAMOUNT,
        allowNull: false
    },
    lastBegTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
},
{
    indexes: [{
        unique: true,
        fields: ['userId']
    }]
}
);

export default userCoinflipModel;

export const getCurrencyEntry = async (args: { userId: string, userName: string }) => {
    try {
        let entry = await userCoinflipModel.findOne({ where: { userId: args.userId } });
        if (!entry) {
            await createUserCurrencyEntry({ userId: args.userId, userName: args.userName });
            entry = await userCoinflipModel.findOne({ where: { userId: args.userId } });
            if (!entry) throw new Error("Dang! Couldnt create user entry :(");
        }
        return entry;
    } catch (error: any) {
        console.error(error);
    }
}

const createUserCurrencyEntry = async (args: { userId: string, userName: string }) => {
    try {
        await userCoinflipModel.create({
            userId: args.userId,
            userName: args.userName,
            currency: DEFAULT_CURRENCY_STARTAMOUNT,
            lastBegTime: 0
        });
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error("[Error] Could not create user currency entry, because it already exists.");
        } else {
            console.error(error);
        }
    }
}

export const updateUserCurrencyEntry = async (args: { userId: string, userName: string, amount: number }) => {
    try {
        const userEntry = await getCurrencyEntry(args);
        if (userEntry) {
            await userCoinflipModel.update(
                { currency: args.amount },
                { where: { userId: args.userId } }
            )
        }
        else {
            await createUserCurrencyEntry(args);
            await userCoinflipModel.update(
                { currency: args.amount },
                { where: { userId: args.userId } }
            )
        }
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('[Error] Could not update user currency!');
        } else {
            console.error(error);
        }
    }
}


export const getCurrencyEntryAmount = async (args: { userId: string, userName: string }) => {
    try {
        const entry = await userCoinflipModel.findOne({ where: { userId: args.userId } });
        if (!entry) {
            await createUserCurrencyEntry(args);
        }
        return entry?.currency ?? DEFAULT_CURRENCY_STARTAMOUNT;
    } catch (error: any) {
        console.error(error);
    }
}

export const updateUserBegTimeEntry = async (args: { userId: string, userName: string }) => {
    try {
        const userEntry = await getCurrencyEntry(args);
        if (userEntry) {
            await userCoinflipModel.update(
                { lastBegTime: Date.now() },
                { where: { userId: args.userId } }
            )
        }
        else {
            await createUserCurrencyEntry(args);
        }
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('[Error] Could not update user beg time!');
        } else {
            console.error(error);
        }
    }
}

interface TopUser {
    userName: string;
    currency: number;
}


export const getCurrencyTopList = async (): Promise<TopUser[]> => {
    try {
        const topHolders = await userCoinflipModel.findAll({
            attributes: [
                'userName',
                'currency'
            ],
            order: [['currency', 'DESC']],
            limit: 10,
            raw: true
        });
        return topHolders;
    } catch (error: any) {
        console.error(error);
        return [];
    }
}