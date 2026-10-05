import { notFound } from 'next/navigation';
import { getListingById } from '@/lib/listings';
import ListingClient from './ListingClient';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return <ListingClient listing={listing} />;
}
