-- =====================================================================
-- Migration: 002_rls_policies.sql
-- Description: Row Level Security (RLS) activation and least-privilege 
--              security policies for all tables in PGFinder.
-- =====================================================================

-- 1. Helper Security Functions (SECURITY DEFINER to prevent recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'ADMIN'
  );
$$;

-- 2. Profiles Table RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone" 
    ON public.profiles
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can create their own profile on signup" 
    ON public.profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile (or Admin)" 
    ON public.profiles
    FOR UPDATE 
    USING (auth.uid() = id OR public.is_admin())
    WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Only admins can delete profiles" 
    ON public.profiles
    FOR DELETE 
    USING (public.is_admin());

-- 3. Properties Table RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active verified properties are public, unverified viewable by owner or admin" 
    ON public.properties
    FOR SELECT 
    USING (
        (is_verified = TRUE AND is_active = TRUE) 
        OR (auth.uid() = owner_id) 
        OR public.is_admin()
    );

CREATE POLICY "Owners and Admins can create properties" 
    ON public.properties
    FOR INSERT 
    WITH CHECK (
        (auth.uid() = owner_id) 
        OR public.is_admin()
    );

CREATE POLICY "Owners and Admins can update their properties" 
    ON public.properties
    FOR UPDATE 
    USING (auth.uid() = owner_id OR public.is_admin())
    WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and Admins can delete their properties" 
    ON public.properties
    FOR DELETE 
    USING (auth.uid() = owner_id OR public.is_admin());

-- 4. Rooms Table RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms viewable if parent property is viewable" 
    ON public.rooms
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id
              AND (
                  (p.is_verified = TRUE AND p.is_active = TRUE)
                  OR p.owner_id = auth.uid()
                  OR public.is_admin()
              )
        )
    );

CREATE POLICY "Property owners and Admins can create rooms" 
    ON public.rooms
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Property owners and Admins can update rooms" 
    ON public.rooms
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Property owners and Admins can delete rooms" 
    ON public.rooms
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = rooms.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

-- 5. Property Images Table RLS
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property images viewable if property is viewable" 
    ON public.property_images
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (
                  (p.is_verified = TRUE AND p.is_active = TRUE)
                  OR p.owner_id = auth.uid()
                  OR public.is_admin()
              )
        )
    );

CREATE POLICY "Property owners and Admins can insert images" 
    ON public.property_images
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Property owners and Admins can update images" 
    ON public.property_images
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Property owners and Admins can delete images" 
    ON public.property_images
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_images.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

-- 6. Master Amenities Table RLS
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Amenities catalogue viewable by everyone" 
    ON public.amenities
    FOR SELECT 
    USING (true);

CREATE POLICY "Only admins can manage amenities" 
    ON public.amenities
    FOR ALL 
    USING (public.is_admin());

-- 7. Property Amenities Table RLS
ALTER TABLE public.property_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Property amenities viewable by everyone" 
    ON public.property_amenities
    FOR SELECT 
    USING (true);

CREATE POLICY "Property owners and Admins can link amenities" 
    ON public.property_amenities
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_amenities.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

CREATE POLICY "Property owners and Admins can unlink amenities" 
    ON public.property_amenities
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.properties p
            WHERE p.id = property_amenities.property_id
              AND (p.owner_id = auth.uid() OR public.is_admin())
        )
    );

-- 8. Owner Tour Availability Table RLS
ALTER TABLE public.owner_tour_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tour availability schedules are publicly readable" 
    ON public.owner_tour_availability
    FOR SELECT 
    USING (true);

CREATE POLICY "Owners and Admins can configure availability" 
    ON public.owner_tour_availability
    FOR INSERT 
    WITH CHECK (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and Admins can update availability" 
    ON public.owner_tour_availability
    FOR UPDATE 
    USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners and Admins can delete availability" 
    ON public.owner_tour_availability
    FOR DELETE 
    USING (auth.uid() = owner_id OR public.is_admin());

-- 9. Bookings & Visits Table RLS
ALTER TABLE public.bookings_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students, Owners, and Admins can view their bookings" 
    ON public.bookings_visits
    FOR SELECT 
    USING (
        auth.uid() = student_id 
        OR auth.uid() = owner_id 
        OR public.is_admin()
    );

CREATE POLICY "Students can request tours" 
    ON public.bookings_visits
    FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participants and Admins can update booking status" 
    ON public.bookings_visits
    FOR UPDATE 
    USING (
        auth.uid() = student_id 
        OR auth.uid() = owner_id 
        OR public.is_admin()
    );

CREATE POLICY "Students and Admins can cancel/delete bookings" 
    ON public.bookings_visits
    FOR DELETE 
    USING (
        auth.uid() = student_id 
        OR public.is_admin()
    );

-- 10. Shortlists Table RLS
ALTER TABLE public.shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students have full control over their own shortlist" 
    ON public.shortlists
    FOR ALL 
    USING (auth.uid() = student_id);

-- 11. Reviews Table RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" 
    ON public.reviews
    FOR SELECT 
    USING (true);

CREATE POLICY "Students can post reviews" 
    ON public.reviews
    FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Authors and Admins can edit reviews" 
    ON public.reviews
    FOR UPDATE 
    USING (auth.uid() = student_id OR public.is_admin());

CREATE POLICY "Authors and Admins can delete reviews" 
    ON public.reviews
    FOR DELETE 
    USING (auth.uid() = student_id OR public.is_admin());

-- 12. Verification Documents Table RLS
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and Admins can view verification documents" 
    ON public.verification_documents
    FOR SELECT 
    USING (auth.uid() = owner_id OR public.is_admin());

CREATE POLICY "Owners can submit verification documents" 
    ON public.verification_documents
    FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update verification status" 
    ON public.verification_documents
    FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Owners (if pending) and Admins can delete documents" 
    ON public.verification_documents
    FOR DELETE 
    USING ((auth.uid() = owner_id AND status = 'Pending') OR public.is_admin());

-- 13. Reports & Flags Table RLS
ALTER TABLE public.reports_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reporters and Admins can view reports" 
    ON public.reports_flags
    FOR SELECT 
    USING (auth.uid() = reporter_id OR public.is_admin());

CREATE POLICY "Authenticated users can submit reports" 
    ON public.reports_flags
    FOR INSERT 
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can moderate and update reports" 
    ON public.reports_flags
    FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Admins can delete reports" 
    ON public.reports_flags
    FOR DELETE 
    USING (public.is_admin());

-- 14. Support Tickets Table RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ticket submitter and Admins view tickets" 
    ON public.support_tickets
    FOR SELECT 
    USING (
        (user_id IS NOT NULL AND auth.uid() = user_id) 
        OR public.is_admin()
    );

CREATE POLICY "Anyone can create support tickets" 
    ON public.support_tickets
    FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Admins can update support tickets" 
    ON public.support_tickets
    FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Admins can delete support tickets" 
    ON public.support_tickets
    FOR DELETE 
    USING (public.is_admin());

-- 15. Notifications Table RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own notifications" 
    ON public.notifications
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users and Admins can create notifications" 
    ON public.notifications
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can mark their own notifications as read" 
    ON public.notifications
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
    ON public.notifications
    FOR DELETE 
    USING (auth.uid() = user_id);

-- 16. Premium Subscriptions Table RLS
ALTER TABLE public.premium_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and Admins can view subscriptions" 
    ON public.premium_subscriptions
    FOR SELECT 
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create subscription orders" 
    ON public.premium_subscriptions
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only Admins and Service Role can update subscriptions" 
    ON public.premium_subscriptions
    FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only Admins can delete subscriptions" 
    ON public.premium_subscriptions
    FOR DELETE 
    USING (public.is_admin());

-- 17. Payment Transactions Ledger Table RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and Admins can view transactions" 
    ON public.payment_transactions
    FOR SELECT 
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users and Service Role can create transactions" 
    ON public.payment_transactions
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Only Admins can modify transaction records" 
    ON public.payment_transactions
    FOR ALL 
    USING (public.is_admin());
