import { openDB } from "idb";
import type { locations } from "./locations.ts";
import bcrypt from "bcryptjs";
import { generateSessionToken } from "./functions.ts";

const DB_NAME = "dbMMDA";
const DB_VERSION = 1;
const ADVISORIES_STORE_NAME = "advisories";
const USERS_STORE_NAME = "users";

export type LocationId = (typeof locations)[number]["id"];

type Advisory = {
  id: number;
  content: string;
  enabled: 0 | 1;
  location: LocationId[];
  order: number[];
  isDeleted: 0 | 1;
};

type User = {
  id: number;
  username: string;
  password: string;
  token?: string;
};

export const useDB = async () => {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log("Creating a new object store...");

      if (!db.objectStoreNames.contains(ADVISORIES_STORE_NAME)) {
        const advisoriesObjectStore = db.createObjectStore(
          ADVISORIES_STORE_NAME,
          { keyPath: "id", autoIncrement: true }
        );
        advisoriesObjectStore.createIndex("location", "location", {
          multiEntry: true,
        });
        advisoriesObjectStore.createIndex(
          "location_enabled",
          ["location", "enabled"],
          { multiEntry: false }
        );
      }
      if (!db.objectStoreNames.contains(USERS_STORE_NAME)) {
        const usersObjectStore = db.createObjectStore(USERS_STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        usersObjectStore.createIndex("username", "username", { unique: true });
      }
    },
  });
};

export const addAdvisoryToStore = async (
  content: string,
  locationID: LocationId[]
) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const orders: number[] = [];

  for (const [index, location] of locationID.entries()) {
    const advisories = await getAdvisoryByLocationFromStore(location);
    if (advisories.length === 0) {
      orders.push(0);
    } else {
        //get the last item from the array
      const latestAdvisory = advisories[advisories.length - 1];
      orders.push(latestAdvisory.order[index] + 1);
    }
  }

  const item = {
    content: content,
    enabled: 1,
    location: locationID,
    order: orders,
    isDeleted: 0,
  };
  return await db.add(ADVISORIES_STORE_NAME, item);
};

export const getAdvisoryByLocationFromStore = async (
  locationId: LocationId,
  isEnabled?: 0 | 1
): Promise<Advisory[]> => {
  const db = await openDB(DB_NAME, DB_VERSION);
  if (isEnabled === undefined) {
    return await db.getAllFromIndex(
      ADVISORIES_STORE_NAME,
      "location",
      locationId
    );
  } else {
    return await db.getAllFromIndex(ADVISORIES_STORE_NAME, "location_enabled", [
      locationId,
      isEnabled,
    ]);
  }
};

export const updateAdvisory = async (advisory: Advisory) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  return await db.put(ADVISORIES_STORE_NAME, advisory);
};

export const deleteAdvisory = async (advisory: Advisory) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  advisory.isDeleted = 1;
  return await db.put(ADVISORIES_STORE_NAME, advisory);
};

export const loginUser = async (user: Omit<User, "id">) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const currentUser: User = await db.getFromIndex(
    USERS_STORE_NAME,
    "username",
    user.username
  );

  if (!currentUser) {
    return "Invalid username or password";
  }

  const isMatch = await bcrypt.compare(user.password, currentUser.password);

  if (!isMatch) {
    return "Invalid password";
  }
  user.token = generateSessionToken();
  return currentUser;
};

export const registerUser = async (user: Omit<User, "id">) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const password = await bcrypt.hash(user.password, 10);
  return await db.add(USERS_STORE_NAME, { username: user.username, password });
};
