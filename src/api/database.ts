import type { locations } from "./locations.ts";
import bcrypt from "bcryptjs";
import { generateSessionToken } from "./functions.ts";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase.ts";

const ADVISORY_COLLECTION = collection(db, "advisories");
const USER_COLLECTION = collection(db, "users");

export type LocationId = (typeof locations)[number]["id"];

export type Advisory = {
  id: number;
  content: string;
  enabled: 0 | 1;
  location: LocationId;
  order: number;
  isDeleted: 0 | 1;
};

type User = {
  id: number;
  username: string;
  password: string;
  token?: string;
};

export const addAdvisoryToDB = async (
  content: string,
  locationIds: LocationId[]
) => {
  const createdIds: string[] = [];

  for (const locationId of locationIds) {

    const advisories = (await getAdvisoriesByLocation(locationId))
      .sort((a,b) => { 
        return b.order - a.order
      });
    let nextOrder = advisories.length > 0 ? advisories[0].order + 1 : 0;

    const item: Omit<Advisory, "id"> = {
      content,
      enabled: 1,
      location: locationId,
      order: nextOrder,
      isDeleted: 0,
    };
    
    const docRef = await addDoc(ADVISORY_COLLECTION, item);
    createdIds.push(docRef.id);
  }

  return createdIds;
};

export const getAdvisoriesByLocation = async (
  locationId: LocationId,
  isEnabled?: 0 | 1
): Promise<Advisory[]> => {
  let q;

  if (isEnabled === undefined) {
    q = query(
      ADVISORY_COLLECTION,
      where("location", "==", locationId),
      where("isDeleted", "==", 0)
    );
  } else {
    q = query(
      ADVISORY_COLLECTION,
      where("location", "==", locationId),
      where("isDeleted", "==", 0),
      where("enabled", "==", isEnabled)
    );
  }

  const snapshot = await getDocs(q);

  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id, // Firestore doc id
        ...(doc.data() as Omit<Advisory, "id">),
      }) as unknown as Advisory
  );
};

export const loginUser = async (user: Omit<User, "id">) => {
  const q = query(USER_COLLECTION, where("username", "==", user.username));
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return "Invalid username or password";
  }

  const doc = snapshot.docs[0];
  const currentUser = { id: doc.id, ...(doc.data() as Omit<User, "id">) } as unknown as User;

  const isMatch = await bcrypt.compare(user.password, currentUser.password);
  if (!isMatch) {
    return "Invalid password";
  }

  const token = generateSessionToken();
  currentUser.token = token;
  await updateDoc(doc.ref, { token });  

  // For TESTING Adduing User 
  // const password = await bcrypt.hash(user.password, 10);
  // const docRef = await addDoc(USER_COLLECTION, {username: user.username, password: password});

  return currentUser;
};

export const registerUser = async (user: Omit<User, "id">) => {
  const password = await bcrypt.hash(user.password, 10);
  return await addDoc(USER_COLLECTION, {username: user.username, password: password});
};


/*


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

export const registerUser = async (user: Omit<User, "id">) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const password = await bcrypt.hash(user.password, 10);
  return await db.add(USERS_STORE_NAME, { username: user.username, password });
};
*/
