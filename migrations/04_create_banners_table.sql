CREATE TABLE banners(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    image_url TEXT NOT NULL,

    cloudinary_public_url TEXT NOT NULL,

    reated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);