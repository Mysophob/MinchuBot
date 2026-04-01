import { Client, TextChannel } from "discord.js";
import { getBirthdayList } from "../database/models/birthdayDB";
import { Birthday } from "../database/models/birthdayEntry.model";

const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000;

let announcedToday: Set<string> = new Set();
let lastAnnouncedDate: string = "";

export function isBirthdayToday(someDate: Date): boolean {
  const nowTokyo = new Date(Date.now() + TOKYO_OFFSET_MS);
  const birthdayTokyo = new Date(someDate.getTime() + TOKYO_OFFSET_MS);
  return (
    birthdayTokyo.getUTCDate() === nowTokyo.getUTCDate() &&
    birthdayTokyo.getUTCMonth() === nowTokyo.getUTCMonth()
  );
}

async function announceBirthday(client: Client) {
  const todayKey = new Date(Date.now() + TOKYO_OFFSET_MS)
    .toISOString()
    .slice(0, 10);

  if (lastAnnouncedDate !== todayKey) {
    announcedToday = new Set();
    lastAnnouncedDate = todayKey;
  }

  const result = await getBirthdayList(client);

  if (result === undefined || result === null) {
    return;
  }

  result.forEach((entry: Birthday) => {
    if (!announcedToday.has(entry.user)) {
      const date = new Date(entry.birthdayDate);
      if (isBirthdayToday(date)) {
        const channel = client.channels.cache.find(
          (ch) => ch.id === (process.env.BOT_BIRTHDAY_ANNOUNCE_CHANNELID as string)
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
          announcedToday.add(entry.user);
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

  const entry = result.find((e: Birthday) => e.user === user);

  if (!entry) return;

  const channel = client.channels.cache.find(
    (ch) => ch.id === process.env.BOT_TEST_CHANNEL
  );

  if (channel instanceof TextChannel) {
    const sendChannel = channel as TextChannel;
    const party = client.emojis.cache.find((emoji) => emoji.name === "clap");

    const message: string = `@here it's <@${
      entry.userID
    }> Birthday today! WOO ${party?.toString()}`;
    // sendChannel.send(message);
    announcedToday.add(entry.user);
    return message;
  }
}

export default announceBirthday;