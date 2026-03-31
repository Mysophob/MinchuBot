import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import { Command } from "../../interfaces/Command";
import dateToString from "../../Utils/formatDate";
import { addBirthday, updateBirthday, getUserBirthday, checkUserExists } from "../../database/models/birthdayDB";

const PLACEHOLDER_YEAR = 1900;

const addBirthdayCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("birthdayset")
    .setDescription("Set a birthday")
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("Day of your birthday (1-31)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(31)
    )
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("Month of your birthday (1-12)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12)
    )
    .addIntegerOption((option) =>
      option
        .setName("year")
        .setDescription("Year of your birthday (optional)")
        .setRequired(false)
        .setMinValue(1900)
        .setMaxValue(new Date().getFullYear())
    ),

  run: async (interaction) => {
    await interaction.deferReply();

    const { user } = interaction;
    const userName = interaction.user.displayName;

    const day = interaction.options.get("day")?.value as number;
    const month = interaction.options.get("month")?.value as number;
    const year = (interaction.options.get("year")?.value as number | undefined) ?? PLACEHOLDER_YEAR;

    const dateParsed = new Date(year, month - 1, day);

    // Validate date (e.g. catches day=31 in a 30-day month)
    if (
      dateParsed.getFullYear() !== year ||
      dateParsed.getMonth() !== month - 1 ||
      dateParsed.getDate() !== day
    ) {
      await interaction.editReply("That date doesn't exist, please double-check the day and month.");
      return;
    }

    const birthdayISO = dateParsed.toISOString();
    const hasYear = interaction.options.get("year")?.value !== undefined;

    const checkExist = await checkUserExists(interaction.client, user.id);
    if (!checkExist) {
      await addBirthday(interaction.client, {
        userID: user.id,
        user: userName,
        birthdayDate: birthdayISO,
      });
    } else {
      await updateBirthday(interaction.client, {
        userID: user.id,
        user: userName,
        birthdayDate: birthdayISO,
      });
    }

    const userBirthday = await getUserBirthday(interaction.client, user.id);
    if (userBirthday === undefined) {
      await interaction.editReply("Something went wrong fetching your birthday.");
      return;
    }

    const storedDate = new Date(userBirthday);
    const readableDate = hasYear
      ? dateToString(storedDate)
      : dateToString(storedDate, { hideYear: true }); // see note below

    const embedReply = new EmbedBuilder()
      .setTitle("Birthday Set!")
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .addFields({
        name: userName,
        value: readableDate,
      })
      .setFooter({ text: "I will remember this birthday!" });

    await interaction.editReply({ embeds: [embedReply] });
  },
};

export default addBirthdayCommand;