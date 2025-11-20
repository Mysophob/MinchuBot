import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { ChatInputCommandInteraction } from "discord.js";
import { currentMonthsList, getTopListForMonth } from "../../database/models/ScreenshotCounter.model";

const getScreenshotTopListForMonth: Command = {
  data: new SlashCommandBuilder()
    .setName("screenshottoplistformonth")
    .setDescription("Who posted the most screenshots for a specific month?")
    .addStringOption((option) =>
      option
        .setName('monthchoice')
        .setDescription('Which result do you want to bet on?')
        .setRequired(true)
        .addChoices(
          currentMonthsList
        )
    ),
  run: async (interaction) => {
    if (!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const monthchoice = interaction.options.get("monthchoice")
      ?.value as string;

    const toplist = await getTopListForMonth(monthchoice);
    if (!toplist) {
      interaction.editReply(`No entries 😢`);
      return
    }

    const prefix = `Getting List for ${monthchoice}`;

    const formattedList = toplist.map((user, index) => {
      return `${index + 1}. ${user.userName}: ${user.screenshotcounter}`;
    }).join('\n');


    if(formattedList.length === 0) {
      await interaction.editReply(`No entries for this month😢`);
      return;
    }

    const answer = prefix + ('\n') + formattedList;
    await interaction.editReply(`${answer}`);
  },
};

export default getScreenshotTopListForMonth;
