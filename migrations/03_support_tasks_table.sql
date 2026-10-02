CREATE TABLE support_tasks(

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title VARCHAR(500) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'OPEN'
    CHECK (status IN('OPEN', 'IN_PROGRESS', 'RESOLVED')),

    users_id UUID REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMP NOT NULL DEFAULT NOW()



);