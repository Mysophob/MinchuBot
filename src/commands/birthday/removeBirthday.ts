import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";
import { checkUserExists, removeBirthday } from "../../database/models/birthdayDB";

const removeBirthdayCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("birthdayremove")
    .setDescription("Remove your saved birthday"),

  run: async (interaction) => {
    await interaction.deferReply();

    const { user } = interaction;

    const exists = await checkUserExists(interaction.client, user.id);
    if (!exists) {
      await interaction.editReply("You don't have a birthday saved.");
      return;
    }

    const deleted = await removeBirthday(interaction.client, user.id);
    if (!deleted) {
      await interaction.editReply("Something went wrong removing your birthday.");
      return;
    }

    const embedReply = new EmbedBuilder()
      .setTitle("Birthday Removed")
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setDescription("Your birthday has been removed from my memory.")
      .setFooter({ text: "You can set it again anytime with /birthdayset" });

    await interaction.editReply({ embeds: [embedReply] });
  },
};

export default removeBirthdayCommand;