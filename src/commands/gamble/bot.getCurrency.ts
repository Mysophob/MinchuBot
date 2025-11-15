import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { getCurrencyEntryAmount } from "../../database/models/UserCoinflip.model";

const coins: Command = {
  data: new SlashCommandBuilder()
    .setName("coins")
    .setDescription("How many coins do i have?"),
  run: async (interaction) => {
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const currency = await getCurrencyEntryAmount({ userId: interaction.user.id, userName: interaction.user.displayName });
    if (!currency) {
      interaction.editReply(`[Error] Something went wrong...`);
      return
    }
    await interaction.editReply(`You have: ${currency} coins.`);
  },
};

export default coins;
