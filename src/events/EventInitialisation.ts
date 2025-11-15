import { Client, CommandInteraction, Events } from 'discord.js';
import onInteraction from './eventhooks/onInteraction';
import onMessageCreated from './eventhooks/onMessage';
import onMessageUpdated from './eventhooks/onMessageUpdate';

const AttachEvents = async (client: Client): Promise<void> => {
  client.on(
    Events.InteractionCreate,
    async (interaction) => onInteraction(interaction as CommandInteraction),
  );

  client.on(
    Events.MessageCreate,
    async (message) => onMessageCreated(message, client),
  );
};

export default AttachEvents;
