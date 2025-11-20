import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { getMonthlyTopList } from "../../database/models/ScreenshotCounter.model";

const getScreenshotTopList: Command = {
  data: new SlashCommandBuilder()
    .setName("screenshottoplist")
    .setDescription("Who posted the most screenshots?"),
  run: async (interaction) => {
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const toplist = await getMonthlyTopList();
    if (!toplist) {
      interaction.editReply(`No entries 😢`);
      return
    }
    const formattedList = toplist.map((user, index) => {
      return `${index + 1}. ${user.userName}: ${user.screenshotcounter}`;
    }).join('\n');

    if(formattedList.length === 0) {
      await interaction.editReply(`No entries for this month😢`);
      return;
    }
    await interaction.editReply(`${formattedList}`);
  },
};

export default getScreenshotTopList;
