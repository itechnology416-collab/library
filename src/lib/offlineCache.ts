// Client-side offline cache manager for Ilillii Press eBooks & DRM Assets

const CACHE_KEY_LIBRARY = 'wki_offline_library_v1';
const CACHE_KEY_READING_PROGRESS = 'wki_offline_reading_progress_v1';

export interface CachedLibraryItem {
  id: string;
  title: string;
  author: string;
  productType: string;
  fileFormat: string;
  contentSnippet?: string;
  cachedAt: string;
  permissionId: string;
}

export interface ReadingProgress {
  productId: string;
  currentPage: number;
  totalPages: number;
  lastReadAt: string;
  bookmarks: number[];
  audioPlaybackPosition?: number;
}

export function saveLibraryToOfflineCache(library: any[]) {
  try {
    localStorage.setItem(CACHE_KEY_LIBRARY, JSON.stringify(library));
  } catch (err) {
    console.error('Failed to save library to offline cache:', err);
  }
}

export function getOfflineLibrary(): any[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY_LIBRARY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReadingProgress(progress: ReadingProgress) {
  try {
    const existingRaw = localStorage.getItem(CACHE_KEY_READING_PROGRESS);
    const progressMap: Record<string, ReadingProgress> = existingRaw ? JSON.parse(existingRaw) : {};
    progressMap[progress.productId] = progress;
    localStorage.setItem(CACHE_KEY_READING_PROGRESS, JSON.stringify(progressMap));
  } catch (err) {
    console.error('Failed to save reading progress:', err);
  }
}

export function getReadingProgress(productId: string): ReadingProgress | null {
  try {
    const existingRaw = localStorage.getItem(CACHE_KEY_READING_PROGRESS);
    if (!existingRaw) return null;
    const progressMap: Record<string, ReadingProgress> = JSON.parse(existingRaw);
    return progressMap[productId] || null;
  } catch {
    return null;
  }
}
