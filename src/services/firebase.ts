import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set, get, push, onValue, child, DatabaseReference } from "firebase/database";

export const firebaseConfig = {
  apiKey: "AIzaSyDm9oL4SyOTOleC5JKbFzT1yVtfAXEmyL8",
  authDomain: "library-f31ea.firebaseapp.com",
  databaseURL: "https://library-f31ea-default-rtdb.firebaseio.com",
  projectId: "library-f31ea",
  storageBucket: "library-f31ea.firebasestorage.app",
  messagingSenderId: "83755922770",
  appId: "1:83755922770:web:af1111247492e848acb68b",
  measurementId: "G-P6BEH9DKTY"
};

// Initialize Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

// Realtime Database Helper Utilities
export async function writeRealtimeData(path: string, data: any): Promise<void> {
  const dbRef = ref(rtdb, path);
  await set(dbRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function pushRealtimeData(path: string, data: any): Promise<string | null> {
  const listRef = ref(rtdb, path);
  const newRef = push(listRef);
  await set(newRef, {
    ...data,
    createdAt: new Date().toISOString()
  });
  return newRef.key;
}

export async function readRealtimeData<T = any>(path: string): Promise<T | null> {
  const dbRef = ref(rtdb, path);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return snapshot.val() as T;
  }
  return null;
}

export function subscribeRealtimeData<T = any>(path: string, callback: (data: T | null) => void): () => void {
  const dbRef = ref(rtdb, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as T);
    } else {
      callback(null);
    }
  });
  return () => unsubscribe();
}

export { ref, set, get, push, onValue, child };
export type { DatabaseReference };
export default app;
