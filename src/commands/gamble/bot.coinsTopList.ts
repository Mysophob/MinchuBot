import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { getCurrencyTopList } from "../../database/models/UserCoinflip.model";

const coinTopList: Command = {
  data: new SlashCommandBuilder()
    .setName("cointoplist")
    .setDescription("How many coins do i have?"),
  run: async (interaction) => {
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const topList = await getCurrencyTopList();
    if (!topList) {
      interaction.editReply(`No entries 😢`);
      return
    }

    const formattedList = topList.map((user, index) => {
      return `${index + 1}. ${user.userName}: ${user.currency} coins`;
    }).join('\n');

    if (formattedList.length === 0) {
      await interaction.editReply(`No entries here 😢`);
      return;
    }
    await interaction.editReply(`${formattedList}`);
  },
};

export default coinTopList;
