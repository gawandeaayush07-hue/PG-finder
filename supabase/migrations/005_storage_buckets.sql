-- =====================================================================
-- Migration: 005_storage_buckets.sql
-- Description: Provision Supabase Storage buckets and configure storage 
--              Row Level Security policies for photos and compliance docs.
-- =====================================================================

-- 1. Insert Storage Buckets into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    (
        'property-images',
        'property-images',
        true,
        5242880, -- 5 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'verification-documents',
        'verification-documents',
        false, -- Private bucket
        10485760, -- 10 MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    ),
    (
        'user-avatars',
        'user-avatars',
        true,
        2097152, -- 2 MB
        ARRAY['image/jpeg', 'image/png', 'image/webp']
    ),
    (
        'student-id-documents',
        'student-id-documents',
        false, -- Private bucket
        5242880, -- 5 MB
        ARRAY['application/pdf', 'image/jpeg', 'image/png']
    )
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies: property-images (Public Read, Owner Upload)
CREATE POLICY "Public can view property images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated owners and admins can upload property images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'property-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Owners and admins can update property images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'property-images' 
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

CREATE POLICY "Owners and admins can delete property images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'property-images' 
        AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin())
    );

-- 3. Storage RLS Policies: verification-documents (Private, Owner + Admin Only)
CREATE POLICY "Owners and Admins can view verification documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'verification-documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1] 
            OR public.is_admin()
        )
    );

CREATE POLICY "Owners can upload verification documents to their own folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'verification-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Owners and Admins can delete verification documents"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'verification-documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1] 
            OR public.is_admin()
        )
    );

-- 4. Storage RLS Policies: user-avatars (Public Read, Self Upload)
CREATE POLICY "Public can view user avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'user-avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- 5. Storage RLS Policies: student-id-documents (Private, Student + Admin Only)
CREATE POLICY "Students and Admins can view student ID documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'student-id-documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1] 
            OR public.is_admin()
        )
    );

CREATE POLICY "Students can upload their student ID document"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'student-id-documents' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Students and Admins can delete student ID documents"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'student-id-documents' 
        AND (
            auth.uid()::text = (storage.foldername(name))[1] 
            OR public.is_admin()
        )
    );
