import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { getCurrencyEntry, updateUserBegTimeEntry, updateUserCurrencyEntry } from "../../database/models/UserCoinflip.model";

export const BEG_COOLDOWN_PERIOD = (60 * 60 * 1000)

const canBegAgain = (lastBegTime: number) => {
    const oneHourAgo = Date.now() - BEG_COOLDOWN_PERIOD;
    return lastBegTime < oneHourAgo;
}

const getTimeUntilCanBeg = (lastBegTime: number) => {
    const nextAvailableTime = lastBegTime + BEG_COOLDOWN_PERIOD;
    const timeLeft = nextAvailableTime - Date.now();
    return Math.max(0, timeLeft);
}

const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s`;
}

const begForCurrency: Command = {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Do you need some coins?"),
    run: async (interaction) => {
        if (!(interaction instanceof ChatInputCommandInteraction)) return;

        await interaction.deferReply();

        const currencyEntry = await getCurrencyEntry({ userId: interaction.user.id, userName: interaction.user.displayName});
        if (!currencyEntry) {
            await interaction.editReply(`[Error] Something went wrong...`);
            return
        }

        if (currencyEntry.lastBegTime && !canBegAgain(currencyEntry.lastBegTime)) {
            const timeLeft = getTimeUntilCanBeg(currencyEntry.lastBegTime);
            await interaction.editReply(`Tss you shouldn't beg so often! Wait ${formatTimeRemaining(timeLeft)}`);
            return;
        }

        const newAmount = currencyEntry.currency + 100;

        await updateUserCurrencyEntry({ userId: interaction.user.id, userName: interaction.user.displayName, amount: newAmount });
        await updateUserBegTimeEntry({ userId: interaction.user.id, userName: interaction.user.displayName });
        await interaction.editReply(`Okay okay, I found you some coins. Now you have ${newAmount} coins, use them carefully!`);
    },
};

export default begForCurrency;
