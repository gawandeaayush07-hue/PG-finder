import { getListings } from '@/lib/listings';
import HomeClient from './HomeClient';

export const revalidate = 60;

export default async function Home() {
  const listings = await getListings();
  return <HomeClient initialListings={listings} />;
}
