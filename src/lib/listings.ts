/**
 * Server-only data access layer for public listings.
 * Fetches verified, active properties from Supabase using the cookie-free public client
 * and maps rows to the application Listing shape.
 */
import { createPublicClient } from '@/lib/supabase/public';
import type { Listing } from '@/context/PersonaContext';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface RawProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

/**
 * Batched lookup of safe owner profiles from the public_profiles view.
 * Never accesses public.profiles directly.
 */
async function fetchOwnerProfiles(
  supabase: ReturnType<typeof createPublicClient>,
  ownerIds: string[]
): Promise<Map<string, { full_name: string; avatar_url: string | null }>> {
  const map = new Map<string, { full_name: string; avatar_url: string | null }>();
  if (ownerIds.length === 0) return map;

  try {
    const { data: profiles, error } = await (supabase
      .from('public_profiles' as any)
      .select('id, full_name, avatar_url')
      .in('id', ownerIds) as any);

    if (error) {
      console.error('Supabase error fetching public_profiles for owners:', error);
      return map;
    }

    if (profiles) {
      for (const p of profiles as RawProfile[]) {
        map.set(p.id, {
          full_name: p.full_name || '',
          avatar_url: p.avatar_url || '',
        });
      }
    }
  } catch (err) {
    console.error('Exception fetching owner profiles from public_profiles:', err);
  }

  return map;
}



/**
 * Maps raw Supabase property row and resolved relation maps to the Listing shape.
 */
function mapPropertyRowToListing(
  rawProp: any,
  ownerMap: Map<string, { full_name: string; avatar_url: string | null }>
): Listing {
  const sortedImages = Array.isArray(rawProp.property_images)
    ? [...rawProp.property_images].sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
    : [];

  const primaryImg = sortedImages.find((img: any) => img.is_primary)?.image_url;
  const firstImg = sortedImages[0]?.image_url;
  const image = primaryImg || firstImg || '';
  const images = sortedImages.map((img: any) => img.image_url || '').filter(Boolean);

  const sortedRooms = Array.isArray(rawProp.rooms)
    ? [...rawProp.rooms].sort((a: any, b: any) => (a.price ?? 0) - (b.price ?? 0))
    : [];

  const rooms = sortedRooms.map((r: any) => ({
    name: r.name ?? '',
    price: Number(r.price) || 0,
    available: Boolean(r.is_available),
  }));

  const amenities: string[] = Array.isArray(rawProp.property_amenities)
    ? rawProp.property_amenities
        .map((pa: any) => {
          if (pa?.amenity?.name) return String(pa.amenity.name);
          if (pa?.amenities?.name) return String(pa.amenities.name);
          return '';
        })
        .filter(Boolean)
    : [];

  const ownerProfile = rawProp.owner_id ? ownerMap.get(rawProp.owner_id) : undefined;
  const owner = {
    name: ownerProfile?.full_name || 'Property Owner',
    phone: rawProp.contact_phone ?? '',
    email: rawProp.contact_email ?? '',
    avatar: ownerProfile?.avatar_url ?? '',
  };

  return {
    id: rawProp.id ?? '',
    title: rawProp.title ?? '',
    location: rawProp.location_name ?? '',
    price: Number(rawProp.base_price) || 0,
    image,
    images,
    distanceText: rawProp.distance_text ?? '',
    distanceKm: rawProp.distance_km != null ? Number(rawProp.distance_km) : undefined,
    latitude: rawProp.latitude != null ? Number(rawProp.latitude) : undefined,
    longitude: rawProp.longitude != null ? Number(rawProp.longitude) : undefined,
    type: (rawProp.gender_type as 'Boys' | 'Girls' | 'Co-ed') || 'Co-ed',
    verified: Boolean(rawProp.is_verified),
    amenities,
    rooms,
    ownerId: rawProp.owner_id ?? '',
    owner,
    description: rawProp.description ?? '',
  };
}

/**
 * Fetches all verified, active properties ordered by created_at desc.
 */
export async function getListings(): Promise<Listing[]> {
  try {
    const supabase = createPublicClient();

    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        owner_id,
        title,
        slug,
        description,
        location_name,
        latitude,
        longitude,
        distance_text,
        distance_km,
        base_price,
        gender_type,
        is_verified,
        is_active,
        contact_phone,
        contact_email,
        rating,
        reviews_count,
        created_at,
        property_images (
          id,
          image_url,
          caption,
          display_order,
          is_primary
        ),
        rooms (
          id,
          name,
          price,
          is_available
        ),
        property_amenities (
          amenities (
            name
          )
        )
      `)
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching listings:', error);
      return [];
    }

    if (!properties || properties.length === 0) {
      return [];
    }

    const ownerIds = Array.from(
      new Set(properties.map((p) => p.owner_id).filter(Boolean))
    );

    const ownerMap = await fetchOwnerProfiles(supabase, ownerIds);

    return properties.map((prop) =>
      mapPropertyRowToListing(prop, ownerMap)
    );
  } catch (err) {
    console.error('Exception in getListings():', err);
    return [];
  }
}

/**
 * Fetches a single verified, active property by UUID or slug.
 */
export async function getListingById(idOrSlug: string): Promise<Listing | null> {
  if (!idOrSlug) return null;

  try {
    const supabase = createPublicClient();
    const isUuid = UUID_REGEX.test(idOrSlug.trim());

    let query = supabase
      .from('properties')
      .select(`
        id,
        owner_id,
        title,
        slug,
        description,
        location_name,
        latitude,
        longitude,
        distance_text,
        distance_km,
        base_price,
        gender_type,
        is_verified,
        is_active,
        contact_phone,
        contact_email,
        rating,
        reviews_count,
        created_at,
        property_images (
          id,
          image_url,
          caption,
          display_order,
          is_primary
        ),
        rooms (
          id,
          name,
          price,
          is_available
        ),
        property_amenities (
          amenities (
            name
          )
        )
      `)
      .eq('is_active', true)
      .eq('is_verified', true);

    if (isUuid) {
      query = query.eq('id', idOrSlug.trim());
    } else {
      query = query.eq('slug', idOrSlug.trim());
    }

    const { data: property, error } = await query.maybeSingle();

    if (error) {
      console.error(`Supabase error fetching listing '${idOrSlug}':`, error);
      return null;
    }

    if (!property) {
      return null;
    }

    const ownerMap = await fetchOwnerProfiles(
      supabase,
      property.owner_id ? [property.owner_id] : []
    );

    return mapPropertyRowToListing(property, ownerMap);
  } catch (err) {
    console.error(`Exception in getListingById('${idOrSlug}'):`, err);
    return null;
  }
}

/**
 * Fetches multiple verified, active properties by their UUIDs.
 * Filters out invalid UUIDs and caps the lookup at 50 IDs.
 */
export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
  if (!ids || !Array.isArray(ids) || ids.length === 0) return [];

  const validIds = Array.from(
    new Set(
      ids
        .filter((id) => typeof id === 'string' && UUID_REGEX.test(id.trim()))
        .map((id) => id.trim())
    )
  ).slice(0, 50);

  if (validIds.length === 0) return [];

  try {
    const supabase = createPublicClient();

    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        id,
        owner_id,
        title,
        slug,
        description,
        location_name,
        latitude,
        longitude,
        distance_text,
        distance_km,
        base_price,
        gender_type,
        is_verified,
        is_active,
        contact_phone,
        contact_email,
        rating,
        reviews_count,
        created_at,
        property_images (
          id,
          image_url,
          caption,
          display_order,
          is_primary
        ),
        rooms (
          id,
          name,
          price,
          is_available
        ),
        property_amenities (
          amenities (
            name
          )
        )
      `)
      .in('id', validIds)
      .eq('is_active', true)
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching listings by ids:', error);
      return [];
    }

    if (!properties || properties.length === 0) {
      return [];
    }

    const ownerIds = Array.from(
      new Set(properties.map((p) => p.owner_id).filter(Boolean))
    );

    const ownerMap = await fetchOwnerProfiles(supabase, ownerIds);

    return properties.map((prop) =>
      mapPropertyRowToListing(prop, ownerMap)
    );
  } catch (err) {
    console.error('Exception in getListingsByIds():', err);
    return [];
  }
}

