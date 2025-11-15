import * as dotenv from 'dotenv';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import onReady from './events/onReady';
import botDatabase from './database/sqlLiteConnector';
import onMessageCreated from './events/eventhooks/onMessage';

(async () => {
  dotenv.config();
  const BOT = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message] });
  BOT.on(Events.ClientReady, async () => onReady(BOT));

  botDatabase.sync().then(() => {
    console.log('Database synced');
  }).catch(console.error);

  await BOT.login(process.env.BOT_TOKEN);
})();
