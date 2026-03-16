import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Decision, DecisionInputs, DecisionResults } from '@/types';

const DECISIONS_COLLECTION = 'decisions';

export async function saveDecision(
  userId: string,
  inputs: DecisionInputs,
  results: DecisionResults
): Promise<string> {
  const docRef = await addDoc(collection(db, DECISIONS_COLLECTION), {
    userId,
    inputs,
    results,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getDecision(id: string): Promise<Decision | null> {
  const docRef = doc(db, DECISIONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...(data as Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>),
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate().toISOString()
        : new Date().toISOString(),
  };
}

export async function getUserDecisions(userId: string): Promise<Decision[]> {
  const q = query(
    collection(db, DECISIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...(data as Omit<Decision, 'id' | 'createdAt' | 'updatedAt'>),
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate().toISOString()
          : new Date().toISOString(),
    };
  });
}

export async function deleteDecision(id: string): Promise<void> {
  await deleteDoc(doc(db, DECISIONS_COLLECTION, id));
}
