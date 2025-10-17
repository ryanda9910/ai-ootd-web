// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig)

let analyticsPromise: Promise<Analytics | null> | null = null
export function getAnalyticsIfSupported() {
  if (!analyticsPromise) analyticsPromise = isSupported().then(s => (s ? getAnalytics(app) : null))
  return analyticsPromise
}

export async function faLogEvent(name: string, params?: Record<string, any>) {
  const a = await getAnalyticsIfSupported()
  if (a) logEvent(a, name as any, params)
}
