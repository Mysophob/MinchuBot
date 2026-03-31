import { Client } from "discord.js";
import birthdayModel from "./birthdayEntry.model";
import { Birthday } from "./birthdayEntry.model";

// Sync the table on first import (creates it if it doesn't exist)
birthdayModel.sync();

export async function getBirthdayList(
    _client: Client
): Promise<Array<Birthday> | undefined> {
    try {
        return await birthdayModel.findAll({ raw: true }) as Birthday[];
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function getUserBirthday(
    _client: Client,
    userID: string
): Promise<string | undefined> {
    try {
        const entry = await birthdayModel.findOne({ where: { userID } });
        return entry?.birthdayDate ?? undefined;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function checkUserExists(
    _client: Client,
    userID: string
): Promise<boolean> {
    try {
        const entry = await birthdayModel.findOne({ where: { userID } });
        return entry !== null;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function addBirthday(
    _client: Client,
    newEntry: Birthday
): Promise<Birthday | undefined> {
    try {
        return await birthdayModel.create(newEntry) as Birthday;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function updateBirthday(
    _client: Client,
    newEntry: Birthday
): Promise<Birthday | undefined> {
    try {
        await birthdayModel.update(
            { birthdayDate: newEntry.birthdayDate, user: newEntry.user },
            { where: { userID: newEntry.userID } }
        );
        return newEntry;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}