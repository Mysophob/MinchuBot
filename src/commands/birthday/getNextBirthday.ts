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

    if (result === undefined || result === null || result.length === 0) {
      interaction.editReply("Couldnt find shit");
      return;
    }

    // let nextBirthday = { name: 'niemand', birthday: '00' };
    let nextBirthdayName = "nobody";
    let nextBirthdayDate = "00";
    function isBirthdayAfterToday(birthday: Date, todayDate: Date): boolean {
      if (birthday.getMonth() === todayDate.getMonth()) {
        return birthday.getDate() > todayDate.getDate();
      }
      return birthday.getMonth() >= todayDate.getMonth();
    }

    const arr = result.filter((res) =>
      isBirthdayAfterToday(new Date(res.birthdayDate), new Date())
    );

    if (arr.length > 1) {
      arr.sort((a, b) => {
        const dateA = new Date(a.birthdayDate).setFullYear(2024);
        const dateB = new Date(b.birthdayDate).setFullYear(2024);
        return dateA.valueOf() - dateB.valueOf();
      });
      nextBirthdayName = arr[0].user;
      nextBirthdayDate = arr[0].birthdayDate;
    } else {
      nextBirthdayName = result[0].user;
      nextBirthdayDate = result[0].birthdayDate;
    }

    const embedReply = new EmbedBuilder();
    embedReply.setTitle("Next Brithday");
    const readableDate = dateToString(new Date(nextBirthdayDate));
    embedReply.addFields({ name: nextBirthdayName, value: readableDate });
    embedReply.setFooter({
      text: "He is the next one to have birthday",
    });

    await interaction.editReply({ embeds: [embedReply] });
  },
};

export default getNextBirthday;
