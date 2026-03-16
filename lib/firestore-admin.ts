import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import type { Decision, DecisionInputs, DecisionResults } from '@/types';

let adminApp: App;
let adminDb: Firestore;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  if (getApps().length === 0) {
    // For local development, use application default credentials or service account
    // For production, set GOOGLE_APPLICATION_CREDENTIALS env var or use service account JSON
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(JSON.parse(serviceAccount)),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // Fallback: use project ID only (works in Firebase hosting or with gcloud auth)
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    adminApp = getApps()[0] as App;
  }

  return adminApp;
}

function getAdminDb(): Firestore {
  if (!adminDb) {
    adminDb = getFirestore(getAdminApp());
  }
  return adminDb;
}

const DECISIONS_COLLECTION = 'decisions';

export async function saveDecision(
  userId: string,
  inputs: DecisionInputs,
  results: DecisionResults
): Promise<string> {
  const db = getAdminDb();
  const docRef = await db.collection(DECISIONS_COLLECTION).add({
    userId,
    inputs,
    results,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getDecision(id: string): Promise<Decision | null> {
  const db = getAdminDb();
  const docSnap = await db.collection(DECISIONS_COLLECTION).doc(id).get();

  if (!docSnap.exists) return null;

  const data = docSnap.data();
  if (!data) return null;

  return {
    id: docSnap.id,
    userId: data.userId,
    inputs: data.inputs,
    results: data.results,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getUserDecisions(userId: string): Promise<Decision[]> {
  const db = getAdminDb();
  const querySnapshot = await db
    .collection(DECISIONS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  return querySnapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      inputs: data.inputs,
      results: data.results,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}

export async function deleteDecision(id: string): Promise<void> {
  const db = getAdminDb();
  await db.collection(DECISIONS_COLLECTION).doc(id).delete();
}
