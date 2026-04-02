import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";
import dateToString from "../../Utils/formatDate";
import { getBirthdayList } from "../../database/models/birthdayDB";

const getNextBirthday: Command = {
  data: new SlashCommandBuilder()
    .setName("birthdaynext")
    .setDescription("Gets next Birthday"),
  run: async (interaction) => {
    await interaction.deferReply();

    const result = await getBirthdayList(interaction.client);

    if (!result || result.length === 0) {
      interaction.editReply("Couldn't find any birthdays.");
      return;
    }

    const today = new Date();

    function getNextOccurrence(birthdayDate: Date): Date {
      const next = new Date(birthdayDate);
      next.setFullYear(today.getFullYear());

      // If that date has already passed this year, push to next year
      if (
        next.getMonth() < today.getMonth() ||
        (next.getMonth() === today.getMonth() && next.getDate() <= today.getDate())
      ) {
        next.setFullYear(today.getFullYear() + 1);
      }

      return next;
    }

    result.sort((a, b) => {
      const nextA = getNextOccurrence(new Date(a.birthdayDate));
      const nextB = getNextOccurrence(new Date(b.birthdayDate));
      return nextA.valueOf() - nextB.valueOf();
    });

    const nextBirthdayName = result[0].user;
    const nextBirthdayDate = result[0].birthdayDate;

    const embedReply = new EmbedBuilder();
    embedReply.setTitle("Next Birthday");
    embedReply.addFields({ name: nextBirthdayName, value: dateToString(new Date(nextBirthdayDate)) });
    embedReply.setFooter({ text: "They are the next one to have a birthday" });

    await interaction.editReply({ embeds: [embedReply] });
  },
};

export default getNextBirthday;
