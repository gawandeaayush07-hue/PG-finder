import { getListings } from '@/lib/listings';
import SearchClient from './SearchClient';

export const revalidate = 60;

export default async function SearchPage() {
  const listings = await getListings();

  return <SearchClient initialListings={listings} />;
}
