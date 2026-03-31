import { Command } from "../interfaces/Command";
import botSetPersonality from "./botPersonality/bot.setpersonality";
import begForCurrency from "./gamble/bot.coinsBeg";
import coinflip from "./gamble/bot.coinflip";
import coins from "./gamble/bot.getCurrency";
import coinTopList from "./gamble/bot.coinsTopList";
import getScreenshotTopList from "./screenshots/bot.getScreenshotTopList";
import getScreenshotTopListForMonth from "./screenshots/bot.getScreenshotTopListForMonth";
import addBirthdayCommand from "./birthday/addBirthday";
import getBirthdayListCommand from "./birthday/getBirthdayList";
import getNextBirthday from "./birthday/getNextBirthday";
import testAnnounce from "./birthday/testAnnounce";

const CommandList: Command[] = [
  botSetPersonality,
  //coins
  coinflip,
  begForCurrency,
  coins,
  coinTopList,
  //screenshots
  getScreenshotTopList,
  getScreenshotTopListForMonth,
  //birthdays
  addBirthdayCommand,
  getBirthdayListCommand,
  getNextBirthday,
  testAnnounce,
];

export default CommandList;
