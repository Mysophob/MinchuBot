import { DataTypes, Model } from 'sequelize';
import sequelize from '../sqlLiteConnector';

interface ScreenshotCounterAttributes {
    userId: string;
    userName: string;
    screenshotcounter: number;
    yearMonth: number; // Storing date as YYYYMM, e.g., 202511
}

interface ScreenshotCounterInstance extends Model<ScreenshotCounterAttributes>, ScreenshotCounterAttributes { }

const screenshotCounterModel = sequelize.define<ScreenshotCounterInstance>('userScreenshots', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    screenshotcounter: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    // We store the year and month as a single integer for easy querying.
    // Example: November 2025 becomes 202511
    yearMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // one entry per month
    indexes: [{
        unique: true,
        fields: ['userId', 'yearMonth']
    }]
});

export let currentMonthsList = [];


export const updateScreenshotCounter = async (args: { userId: string, userName: string, amount: number }) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // getMonth() is 0-indexed, so add 1
    // Format into YYYYMM. e.g., 2025 and 11 becomes 202511
    const currentYearMonth = parseInt(`${year}${month.toString().padStart(2, '0')}`);

    try {
        const [entry, created] = await screenshotCounterModel.findOrCreate({
            where: {
                userId: args.userId,
                yearMonth: currentYearMonth
            },
            defaults: {
                userId: args.userId,
                userName: args.userName,
                screenshotcounter: args.amount,
                yearMonth: currentYearMonth
            }
        });

        if (!created) {
            entry.userName = args.userName;
            entry.screenshotcounter += args.amount;
            await entry.save();
        }
    } catch (error) {
        console.error('[Error] Could not update screenshot counter', error);
    }

    await updateCurrentMothList();
};

export const getMonthlyScreenshotCount = async (args: { userId: string, userName: string }): Promise<number> => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const currentYearMonth = parseInt(`${year}${month.toString().padStart(2, '0')}`);

    try {
        const entry = await screenshotCounterModel.findOne({
            where: {
                userId: args.userId,
                yearMonth: currentYearMonth
            }
        });
        return entry?.screenshotcounter ?? 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
};


interface TopScreenshotUserDto {
    userName: string;
    screenshotcounter: number;
}


export const getMonthlyTopList = async (): Promise<TopScreenshotUserDto[]> => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const currentYearMonth = parseInt(`${year}${month.toString().padStart(2, '0')}`);

    try {
        const topUsers = await screenshotCounterModel.findAll({
            where: {
                yearMonth: currentYearMonth
            },
            order: [['screenshotcounter', 'DESC']],
            raw: true
        });
        return topUsers;
    } catch (error) {
        console.error(error);
        return [];
    }
};

/**
 * @param dateString - The date in "YYYY/MM" format (e.g., "2025/01" for January 2025).
 */
export const getTopListForMonth = async (dateString: string): Promise<TopScreenshotUserDto[]> => {
    try {
        const parts = dateString.split('/');
        if (parts.length !== 2) {
            throw new Error('Invalid date format. Please use "YYYY/MM".');
        }

        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            throw new Error('Invalid year or month in date string.');
        }

        // Convert to the YYYYMM integer format for the database query
        const targetYearMonth = parseInt(`${year}${month.toString().padStart(2, '0')}`);

        const topUsers = await screenshotCounterModel.findAll({
            where: {
                yearMonth: targetYearMonth
            },
            order: [['screenshotcounter', 'DESC']],
            limit: 10,
            raw: true
        });

        return topUsers;
    } catch (error) {
        console.error(`[Error] Could not get top list for month "${dateString}":`, error);
        return [];
    }
};

/**
 * Fetches all distinct yearMonth values available in the database.
 * Returns them formatted as "YYYY/MM" (e.g., ["2025/01", "2024/12"]) for use in a dropdown.
 */
const getAvailableMonths = async (): Promise<string[]> => {
    try {
        const distinctMonths = await screenshotCounterModel.findAll({
            attributes: ['yearMonth'],
            group: ['yearMonth'],
            order: [['yearMonth', 'DESC']],
            raw: true
        });

        const formattedMonths = distinctMonths.map((record: any) => {
            const dateStr = record.yearMonth.toString();

            if (dateStr.length === 6) {
                const year = dateStr.substring(0, 4);
                const month = dateStr.substring(4, 6);
                return `${year}/${month}`;
            }
            return dateStr;
        }) as string[];

        return formattedMonths;

    } catch (error) {
        console.error(`[Error] Could not fetch available months:`, error);
        return [];
    }
};

export const updateCurrentMothList = async () => {
    try {
        currentMonthsList = await getAvailableMonths().then();
    } catch (error) {
        console.error('[Error] Could not update screenshot monthlist', error);
    }
}

export default screenshotCounterModel;