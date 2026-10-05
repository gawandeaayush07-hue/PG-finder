'use server';

import { getListingsByIds as fetchListingsByIds } from '@/lib/listings';
import type { Listing } from '@/context/PersonaContext';

/**
 * Server action exposing getListingsByIds to client components.
 */
export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
  return fetchListingsByIds(ids);
}
