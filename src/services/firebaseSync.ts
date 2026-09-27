import { rtdb, writeRealtimeData, readRealtimeData } from './firebase';
import { MarketplaceProject, MarketplaceRequest } from '../types/marketplace';

/**
 * Service to sync Marketplace Projects & Requests with Firebase Realtime Database
 * Endpoint: https://library-f31ea-default-rtdb.firebaseio.com/
 */
export async function syncProjectToFirebase(project: MarketplaceProject): Promise<void> {
  try {
    if (rtdb) {
      await writeRealtimeData(`marketplace/projects/${project.id}`, project);
      console.log(`[Firebase Sync] Synced project ${project.id} to Realtime Database.`);
    }
  } catch (error) {
    console.warn('[Firebase Sync] Could not sync project to Firebase RTDB:', error);
  }
}

export async function syncRequestToFirebase(request: MarketplaceRequest): Promise<void> {
  try {
    if (rtdb) {
      await writeRealtimeData(`marketplace/requests/${request.id}`, request);
      console.log(`[Firebase Sync] Synced request ${request.id} to Realtime Database.`);
    }
  } catch (error) {
    console.warn('[Firebase Sync] Could not sync request to Firebase RTDB:', error);
  }
}

export async function fetchProjectsFromFirebase(): Promise<MarketplaceProject[] | null> {
  try {
    if (rtdb) {
      const data = await readRealtimeData<Record<string, MarketplaceProject>>('marketplace/projects');
      if (data && typeof data === 'object') {
        return Object.values(data);
      }
    }
  } catch (error) {
    console.warn('[Firebase Sync] Could not fetch projects from Firebase RTDB:', error);
  }
  return null;
}

export async function fetchRequestsFromFirebase(): Promise<MarketplaceRequest[] | null> {
  try {
    if (rtdb) {
      const data = await readRealtimeData<Record<string, MarketplaceRequest>>('marketplace/requests');
      if (data && typeof data === 'object') {
        return Object.values(data);
      }
    }
  } catch (error) {
    console.warn('[Firebase Sync] Could not fetch requests from Firebase RTDB:', error);
  }
  return null;
}
