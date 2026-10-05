-- =====================================================================
-- Seed: sample_properties.sql
-- Description: Fictional sample student PG/hostel properties for PGFinder.
-- Location: Pimpri-Chinchwad, Pune (Akurdi, Nigdi, Chinchwad, Pradhikaran).
-- =====================================================================

BEGIN;

DO $$
DECLARE
    v_owner_id uuid := (SELECT id FROM public.profiles WHERE email = 'OWNER_EMAIL_HERE' AND role = 'OWNER');
    v_prop_id uuid;
BEGIN
    -- Guard: Fail safely if target owner profile does not exist
    IF v_owner_id IS NULL THEN
        RAISE EXCEPTION 'Seed Error: Owner profile with email "OWNER_EMAIL_HERE" and role "OWNER" does not exist in public.profiles.';
    END IF;

    -- ─────────────────────────────────────────────────────────────────
    -- 1. Ensure master amenities exist
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.amenities (name, icon, category)
    VALUES
        ('Wifi', 'wifi', 'Connectivity'),
        ('AC', 'ac_unit', 'Comfort'),
        ('Power Backup', 'bolt', 'Utility'),
        ('Food Included', 'restaurant', 'Meals'),
        ('Laundry', 'local_laundry_service', 'Services'),
        ('Gym', 'fitness_center', 'Fitness'),
        ('CCTV', 'videocam', 'Security'),
        ('Security', 'shield', 'Security'),
        ('Biometric Entry', 'fingerprint', 'Security'),
        ('Study Room', 'menu_book', 'Study')
    ON CONFLICT (name) DO NOTHING;

    -- ─────────────────────────────────────────────────────────────────
    -- 2. Property 1: Green Leaf Residency - Akurdi Campus (Boys PG)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'Green Leaf Residency - Akurdi Campus',
        'green-leaf-residency-akurdi',
        'Modern and peaceful student living located in the quietest pocket near DY Patil College campus and Akurdi station. Ideal for students prioritizing high-speed fiber internet, nutritious home-style meals, 24/7 security, and daily housekeeping.',
        'Akurdi, Pimpri-Chinchwad',
        'Pune',
        'Maharashtra',
        '411035',
        'Plot 42, Sector 28, Near DY Patil College Road, Akurdi, Pune',
        18.6492000,
        73.7668000,
        '5 mins walk to college & Akurdi Station',
        0.40,
        7500,
        'Boys',
        FALSE,
        TRUE,
        TRUE,
        ARRAY['No smoking inside rooms', 'Gate closes at 10:30 PM', 'Visitors allowed in common lobby only'],
        '+91 90000 00001',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    -- Clean old child rows on re-seed
    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Single Private Room', 12000, 1, 1, TRUE, 12000, 'Spacious single bedroom with private study desk and attached washroom.'),
        (v_prop_id, 'Double Sharing Room', 7500, 2, 2, TRUE, 7500, 'Airy twin-sharing room with individual wardrobes and high-speed LAN ports.'),
        (v_prop_id, 'Triple Sharing Room', 6000, 3, 1, TRUE, 6000, 'Budget-friendly triple-occupancy room with balcony access.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8lPh-Mh5caZDv8otgb_zbadZcAdDju396GSImXWmGWluVmY84Ux_xLoF2VC-lYMdHWMG7FUq-Gc0MuQ2j9d3i5fuRXHrsmha7p_8co2PX0ntqHVv6_Br2Nk3Nze04cTAl_RZnhWqnSwPN9FXk0Xo28PH3UowicNa3OeV-QyOCj-HpXLTxT6pajpTJ52a6nxk81CjYC-nxto-OsTinCozpc9oPhYTwyCf0sebvQNOHzVcEb-PhLVG', 'Front Facade & Green Lawn', 0, TRUE),
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBww10ZNK22CqL1MKpLilSEPmeFJIVw9ezy4Hz5PIQ0v7iZKKUwKVd-JwHNJ7L1vERXYod-a6gima6xDCefXNwYoZzKUK3BgdkxR2jP53nBvoPK9gBJvC8BKzDGVo9yPrryFW1gSp8YGrTkkxLVbGdsfvhhcp8SjNvU-ZuvwbX6gZZCdzli0QPqzFzGeppIWthUYjqlrJEEzN_We4gkkt8ttCe1FV8Jvh7UhEWK7UPI2UT0nooWRwDE', 'Spacious Double Bedroom', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Study Room & Desk', 2, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Clean Dining Hall', 3, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'AC', 'Power Backup', 'Food Included', 'CCTV', 'Security');

    -- ─────────────────────────────────────────────────────────────────
    -- 3. Property 2: The Scholar''s Abode - Pradhikaran (Girls PG - Premium)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'The Scholar''s Abode - Pradhikaran',
        'scholars-abode-pradhikaran',
        'An elite student living experience exclusively for female scholars located in the tranquil, highly secure Pradhikaran neighborhood. Features biometric security, dedicated library lounge, in-house gym, and home-style nutritious meals.',
        'Pradhikaran, Nigdi',
        'Pune',
        'Maharashtra',
        '411044',
        'Bungalow 18, Sector 24, Near Spine Road, Pradhikaran, Pune',
        18.6612000,
        73.7745000,
        '10 mins bus ride to PCCOE & DY Patil',
        1.80,
        11000,
        'Girls',
        TRUE,
        TRUE,
        TRUE,
        ARRAY['Biometric entry mandatory', 'Strict 10:00 PM curfew', 'Quiet hours after 11:00 PM', 'No male visitors past lobby'],
        '+91 90000 00002',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Single Premium Suite', 18000, 1, 1, TRUE, 20000, 'Luxury private suite with air conditioning, attached bath, and custom library unit.'),
        (v_prop_id, 'Twin Sharing Room', 11000, 2, 2, TRUE, 15000, 'Bright double room with personal study zones and built-in closet.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5pCTp3k1FCq-3XHGKV2oHeHVb_nLeF_SRifbW1gBGQf1IZsbzXAtLlT1oezipOlG2E1C-Lbxz0u0OtnOFYnghKi85o7hNPV1TwW2CLmY78QjC2EZR4oYFpDI0v6pmhWGQJzBbZNjyhXVaOKzIfif84mndDETJUI8S_C4-P3_eYwPZHbuVYKvq6m334Dy4d5NSKcWCdz1AQHHE1eLuv34s3JklKR_hYO-rWjmvhaBcpvh9GmyeRmYs', 'Modern Architecture & Entrance', 0, TRUE),
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_4ybjU8pDatqwKDFx7yva0oyA8eEKSKVdYNvbkXDSa1eUFNIGSANy90ZGVdumrxBDn55S4wcAUmYWWG7vUMk-O-h4ZnsSXfrCAPzpYw5GRGQr4YNBz9fX4lqfMuh-d9ijYnf1yqIg8qtZH-SV5b2vSydtxKABuBeXQakcn4p4Z7871PSbdTERPy6KuZ_xOjEoUxQkQrQbmNQPk_i4CJ9QNutMfcNy68Y5l8AA6XVs5J34TyceWBrR', 'Interior Bedroom Setup', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 'In-House Fitness Studio', 2, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Spacious Common Lounge', 3, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'AC', 'Gym', 'Laundry', 'Food Included', 'CCTV', 'Biometric Entry', 'Study Room');

    -- ─────────────────────────────────────────────────────────────────
    -- 4. Property 3: Harmony Student Living - Chinchwad (Co-ed PG)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'Harmony Student Living - Chinchwad',
        'harmony-student-living-chinchwad',
        'Friendly, budget-friendly and community-centered co-ed student living. Located close to Chinchwad Station and bus terminus with quick access to engineering colleges and industrial training hubs. Separate wings for male and female tenants.',
        'Chinchwad East',
        'Pune',
        'Maharashtra',
        '411019',
        '88 Station Road, Opposite Chinchwad Bus Depot, Chinchwad, Pune',
        18.6324000,
        73.7885000,
        '12 mins walk to City College & Tech Zone',
        1.20,
        6000,
        'Co-ed',
        FALSE,
        TRUE,
        TRUE,
        ARRAY['Separate wings for boys and girls', 'Zero tolerance for narcotics/alcohol', 'Guest registration required at reception'],
        '+91 90000 00003',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Double Sharing Room', 7500, 2, 2, TRUE, 7500, 'Comfortable twin sharing room with attached balcony and desk.'),
        (v_prop_id, 'Triple Sharing Room', 6000, 3, 2, TRUE, 6000, 'Economical triple sharing arrangement with high ventilation.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hh1JlQ4KvtIzEejGlq2kDX8wyYd07ileen21WMo05pUVbgXr82GC0qxNgJgwEcVNV9zvGpdCFlxdqBWM9sjz3EQsbC4V_JyJPpR7IaNcQRD4aWU4IkAn0TsIKQsd1QG6Asx70RVi5865nAajbIxkjK6rgKNDjekuae8fohn0AMydAJR3wTdQA476d4dzl-pkl1XDCOV3VBevwnTZmlqY38catB9sxOq7MhcwBznkiCK8aFPM0eRA', 'Main Building Exterior', 0, TRUE),
        (v_prop_id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Twin Sharing Bed Setup', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Recreation & Common Hall', 2, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'Power Backup', 'Food Included', 'Laundry', 'CCTV');

    -- ─────────────────────────────────────────────────────────────────
    -- 5. Property 4: Silver Oaks Premium Hostel - Akurdi (Boys PG - Premium)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'Silver Oaks Premium Hostel - Akurdi',
        'silver-oaks-premium-hostel-akurdi',
        'Premium air-conditioned boys accommodation near Akurdi metro corridor. Tailored for serious engineering and management aspirants with individual study alcoves, power backup, gaming zone, and high-speed multi-WAN Wi-Fi.',
        'Akurdi, Pimpri-Chinchwad',
        'Pune',
        'Maharashtra',
        '411035',
        'Survey No. 71/2, Near St. Ursula School, Akurdi, Pune',
        18.6478000,
        73.7692000,
        '7 mins walk to Akurdi Metro & Colleges',
        0.60,
        9500,
        'Boys',
        TRUE,
        TRUE,
        TRUE,
        ARRAY['ID card compulsory at entrance', 'Night entry before 11:00 PM', 'No loud music during exam seasons'],
        '+91 90000 00004',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Executive Single Room (AC)', 15000, 1, 1, TRUE, 15000, 'AC single room with smart desk, mini-fridge, and luxury spring mattress.'),
        (v_prop_id, 'Premium Double Sharing', 9500, 2, 2, TRUE, 10000, 'Twin room with AC, individual cupboards, and attached clean bathroom.'),
        (v_prop_id, 'Triple Sharing Deluxe', 7500, 3, 2, TRUE, 7500, 'Spacious three-bed room with AC and large study balcony.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Modern Reception & Entrance', 0, TRUE),
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm8lPh-Mh5caZDv8otgb_zbadZcAdDju396GSImXWmGWluVmY84Ux_xLoF2VC-lYMdHWMG7FUq-Gc0MuQ2j9d3i5fuRXHrsmha7p_8co2PX0ntqHVv6_Br2Nk3Nze04cTAl_RZnhWqnSwPN9FXk0Xo28PH3UowicNa3OeV-QyOCj-HpXLTxT6pajpTJ52a6nxk81CjYC-nxto-OsTinCozpc9oPhYTwyCf0sebvQNOHzVcEb-PhLVG', 'AC Bedroom Layout', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Dedicated Study Cubicles', 2, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', 'Fitness & Gym Room', 3, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'AC', 'Power Backup', 'Gym', 'Laundry', 'CCTV', 'Security', 'Study Room');

    -- ─────────────────────────────────────────────────────────────────
    -- 6. Property 5: Sai Krupa Girls Residency - Nigdi Hills (Girls PG)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'Sai Krupa Girls Residency - Nigdi Hills',
        'sai-krupa-girls-residency-nigdi',
        'Secure, warm, and highly hygienic home away from home for girl students. Located in peaceful Nigdi Pradhikaran with 24/7 on-site female warden, freshly prepared vegetarian food, purified RO water, and solar hot water systems.',
        'Nigdi Pradhikaran',
        'Pune',
        'Maharashtra',
        '411044',
        'Plot 105, Sector 27A, Near Bhakti Shakti Chowk, Nigdi, Pune',
        18.6655000,
        73.7712000,
        '8 mins auto ride to PCCOE College',
        1.50,
        8000,
        'Girls',
        FALSE,
        TRUE,
        TRUE,
        ARRAY['Gate closes at 9:30 PM', 'Only female visitors in rooms', 'Weekly cleanliness review', 'Parent notification for late leaves'],
        '+91 90000 00005',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Double Sharing Standard', 8000, 2, 2, TRUE, 8000, 'Bright twin room with dual study tables, full-size lockers, and window curtains.'),
        (v_prop_id, 'Triple Sharing Budget', 6500, 3, 2, TRUE, 6500, 'Comfortable three-bed room with daily cleaning and shared bath.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_4ybjU8pDatqwKDFx7yva0oyA8eEKSKVdYNvbkXDSa1eUFNIGSANy90ZGVdumrxBDn55S4wcAUmYWWG7vUMk-O-h4ZnsSXfrCAPzpYw5GRGQr4YNBz9fX4lqfMuh-d9ijYnf1yqIg8qtZH-SV5b2vSydtxKABuBeXQakcn4p4Z7871PSbdTERPy6KuZ_xOjEoUxQkQrQbmNQPk_i4CJ9QNutMfcNy68Y5l8AA6XVs5J34TyceWBrR', 'Serene Residential Building', 0, TRUE),
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5pCTp3k1FCq-3XHGKV2oHeHVb_nLeF_SRifbW1gBGQf1IZsbzXAtLlT1oezipOlG2E1C-Lbxz0u0OtnOFYnghKi85o7hNPV1TwW2CLmY78QjC2EZR4oYFpDI0v6pmhWGQJzBbZNjyhXVaOKzIfif84mndDETJUI8S_C4-P3_eYwPZHbuVYKvq6m334Dy4d5NSKcWCdz1AQHHE1eLuv34s3JklKR_hYO-rWjmvhaBcpvh9GmyeRmYs', 'Neat Bedroom Interior', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Clean Kitchen & Dining Setup', 2, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'Power Backup', 'Food Included', 'Laundry', 'CCTV', 'Security', 'Biometric Entry');

    -- ─────────────────────────────────────────────────────────────────
    -- 7. Property 6: Apex Student Hub - Ravet Link (Co-ed PG)
    -- ─────────────────────────────────────────────────────────────────
    INSERT INTO public.properties (
        owner_id, title, slug, description, location_name, city, state, pincode,
        address, latitude, longitude, distance_text, distance_km, base_price,
        gender_type, is_premium, is_verified, is_active, house_rules,
        contact_phone, contact_email, rating, reviews_count
    ) VALUES (
        v_owner_id,
        'Apex Student Hub - Ravet Link',
        'apex-student-hub-ravet-pradhikaran',
        'Dynamic and vibrant student accommodation located right on the Ravet-Pradhikaran BRTS corridor, just steps from engineering campuses. Features separate residential wings, dedicated high-speed study rooms, and in-house canteen.',
        'Ravet / Pradhikaran Link',
        'Pune',
        'Maharashtra',
        '411044',
        'Building B, Shinde Complex, BRTS Road, Near PCCOE Campus, Pune',
        18.6535000,
        73.7598000,
        '3 mins walk to PCCOE Engineering College',
        0.25,
        8500,
        'Co-ed',
        FALSE,
        TRUE,
        TRUE,
        ARRAY['Biometric attendance log', 'No non-resident overnight stays', 'Common area quiet hours after 10:30 PM'],
        '+91 90000 00006',
        'sample-listing@example.com',
        0.0,
        0
    )
    ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location_name = EXCLUDED.location_name,
        base_price = EXCLUDED.base_price,
        is_verified = EXCLUDED.is_verified,
        is_active = EXCLUDED.is_active
    RETURNING id INTO v_prop_id;

    DELETE FROM public.rooms WHERE property_id = v_prop_id;
    DELETE FROM public.property_images WHERE property_id = v_prop_id;
    DELETE FROM public.property_amenities WHERE property_id = v_prop_id;

    -- Rooms
    INSERT INTO public.rooms (property_id, name, price, total_beds, available_beds, is_available, deposit_amount, description)
    VALUES
        (v_prop_id, 'Single Private Pod', 13000, 1, 1, TRUE, 13000, 'Private compact single room with dedicated LAN port and ergonomic study desk.'),
        (v_prop_id, 'Double Sharing Room', 8500, 2, 2, TRUE, 8500, 'Well-lit double room with individual study lamps and closets.'),
        (v_prop_id, 'Triple Sharing Standard', 6500, 3, 2, TRUE, 6500, 'Spacious three-bed room with ceiling fans and storage.');

    -- Images
    INSERT INTO public.property_images (property_id, image_url, caption, display_order, is_primary)
    VALUES
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4hh1JlQ4KvtIzEejGlq2kDX8wyYd07ileen21WMo05pUVbgXr82GC0qxNgJgwEcVNV9zvGpdCFlxdqBWM9sjz3EQsbC4V_JyJPpR7IaNcQRD4aWU4IkAn0TsIKQsd1QG6Asx70RVi5865nAajbIxkjK6rgKNDjekuae8fohn0AMydAJR3wTdQA476d4dzl-pkl1XDCOV3VBevwnTZmlqY38catB9sxOq7MhcwBznkiCK8aFPM0eRA', 'Campus View & Plaza', 0, TRUE),
        (v_prop_id, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBww10ZNK22CqL1MKpLilSEPmeFJIVw9ezy4Hz5PIQ0v7iZKKUwKVd-JwHNJ7L1vERXYod-a6gima6xDCefXNwYoZzKUK3BgdkxR2jP53nBvoPK9gBJvC8BKzDGVo9yPrryFW1gSp8YGrTkkxLVbGdsfvhhcp8SjNvU-ZuvwbX6gZZCdzli0QPqzFzGeppIWthUYjqlrJEEzN_We4gkkt8ttCe1FV8Jvh7UhEWK7UPI2UT0nooWRwDE', 'Furnished Double Room', 1, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Study Lab & Workstations', 2, FALSE),
        (v_prop_id, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', 'Dining & Social Space', 3, FALSE);

    -- Amenities
    INSERT INTO public.property_amenities (property_id, amenity_id)
    SELECT v_prop_id, id FROM public.amenities WHERE name IN ('Wifi', 'Power Backup', 'Food Included', 'Laundry', 'CCTV', 'Security', 'Study Room');

    RAISE NOTICE 'Successfully seeded 6 sample properties for owner ID: %', v_owner_id;
END $$;

COMMIT;
