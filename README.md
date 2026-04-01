Readme
USER discordbot

Setup:
pull repo, set .env file configs:

BOT_TOKEN=""
GUILD_ID="" #active guildID
TEST_GUILD_ID=""

CLAUDE_TOKEN=""
CHAT_GPT_TOKEN=""
#Birthdays
BOT_BIRTHDAY_ANNOUNCE_CHANNELID=""
BOT_TEST_CHANNEL=""

run 
npm i && npm run br

=======================================================================
Run:
Either with pm2 see runServer.sh

OR
linux systemd service (/etc/systemd/system/minchubot.service)
see minchubot.service example
add, register and reload deamon to run