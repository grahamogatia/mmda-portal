import type { locations } from "./locations.ts";
import bcrypt from "bcryptjs";
import { generateSessionToken } from "./functions.ts";
import {
  addDoc,
  collection,
  doc,
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
  id: string;
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

export const updateAdvisory = async (advisory: Advisory) => {
  const advisoryRef = doc(ADVISORY_COLLECTION, advisory.id.toString());
  const { id, ...data } = advisory;
  await updateDoc(advisoryRef, data);
  return { id, ...data };
};

export const deleteAdvisory = async (advisory: Advisory) => {
  const advisoryRef = doc(ADVISORY_COLLECTION, advisory.id);
  await updateDoc(advisoryRef, {isDeleted: 1});
  return { ...advisory, isDeleted: 1 };
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