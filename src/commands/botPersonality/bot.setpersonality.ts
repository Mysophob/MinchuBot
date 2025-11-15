import { SlashCommandBuilder } from "@discordjs/builders";
import { Command } from "../../interfaces/Command";
import { setPersonality } from "../../messages/askAi";
import { ChatInputCommandInteraction, CommandInteraction } from "discord.js";

const botSetPersonality: Command = {
  data: new SlashCommandBuilder()
    .setName("botsetpersonality")
    .setDescription("Set the personality prompt of the bot")
    .addStringOption((option) =>
      option
        .setName("personality")
        .setDescription("Any kind of description will do")
        .setRequired(true)
    ),
  run: async (interaction) => {
    if(!(interaction instanceof ChatInputCommandInteraction)) return;

    await interaction.deferReply();
    const newPersonality = interaction.options.get("personality")
      ?.value as string;
    setPersonality(newPersonality);
    await interaction.editReply(`New Personality: ${newPersonality}`);
  },
};

export default botSetPersonality;
