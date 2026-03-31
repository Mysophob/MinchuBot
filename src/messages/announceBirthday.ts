import { Client, TextChannel } from "discord.js";
import { getBirthdayList } from "../database/models/birthdayDB";
import { Birthday } from "../database/models/birthdayEntry.model";

let lastAnnouncedBirthdayName: string;

export function isBirthdayToday(someDate: Date): boolean {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth()
  );
}

async function announceBirthday(client: Client) {
  const result = await getBirthdayList(client);

  if (result === undefined || result === null) {
    return;
  }

  result.forEach((entry: Birthday) => {
    if (lastAnnouncedBirthdayName !== entry.user) {
      const date = new Date(entry.birthdayDate);
      if (isBirthdayToday(date)) {
        const channel = client.channels.cache.find(
          (ch) => ch.id === process.env.BOT_BIRTHDAY_ANNOUNCE_CHANNELID as string
        );
        if (channel instanceof TextChannel) {
          const sendChannel = channel as TextChannel;
          const party = client.emojis.cache.find(
            (emoji) => emoji.name === "minchu2Piccolo"
          );
          const message: string = `@everyone it's <@${
            entry.userID
          }> birthday today! WOO ${party?.toString()}`;
          sendChannel.send(message);
          lastAnnouncedBirthdayName = entry.user;
        }
      }
    }
  });
  return result;
}

export async function announceUserFromList(client: Client, user: string) {
  const result = await getBirthdayList(client);

  if (result === undefined || result === null) {
    return;
  }


  result.forEach((entry: Birthday) => {
    console.log(entry);
    if (entry.user === user) {
      const channel = client.channels.cache.find(
        (ch) => ch.id === process.env.BOT_TEST_CHANNEL
      );

      if (channel instanceof TextChannel) {
        const sendChannel = channel as TextChannel;
        const party = client.emojis.cache.find(
          (emoji) => emoji.name === "clap"
        );

        const message: string = `@here it's <@${
          entry.userID
        }> Birthday today! WOO ${party?.toString()}`;
        sendChannel.send(message);
        lastAnnouncedBirthdayName = entry.user;
      }
    }
  });
  
  return result;
}

export default announceBirthday;
