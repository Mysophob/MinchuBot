import { ChatInputCommandInteraction, Client, CommandInteraction, Events } from 'discord.js';
import onInteraction from './eventhooks/onInteraction';
import onMessageCreated from './eventhooks/onMessage';
import onMessageUpdated from './eventhooks/onMessageUpdate';
import announceBirthday from '../messages/announceBirthday';

async function periodicBirthdayCheck(client: Client) {
  const now = new Date();

  // Tokyo is UTC+9, no DST
  const TOKYO_OFFSET_MS = 9 * 60 * 60 * 1000;
  const nowTokyo = new Date(now.getTime() + TOKYO_OFFSET_MS);

  // Next midnight in Tokyo time
  const tomorrowTokyo = new Date(
    nowTokyo.getUTCFullYear(),
    nowTokyo.getUTCMonth(),
    nowTokyo.getUTCDate() + 1,
    0, 0, 0
  );

  // Convert back to server local time
  const msToTokyoMidnight = tomorrowTokyo.getTime() - TOKYO_OFFSET_MS - now.getTime();

  setTimeout(() => {
    announceBirthday(client);
    periodicBirthdayCheck(client);
  }, msToTokyoMidnight);
}

const AttachEvents = async (client: Client): Promise<void> => {
  client.on(
    Events.InteractionCreate,
    async (interaction) => onInteraction(interaction as ChatInputCommandInteraction),
  );

  client.on(
    Events.MessageCreate,
    async (message) => onMessageCreated(message, client),
  );
  await periodicBirthdayCheck(client);
};

export default AttachEvents;
