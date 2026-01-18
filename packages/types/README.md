# @edustream/types

Shared types, validation schemas, and utilities for EduStream monorepo.

## Contents

- **Validation Schemas** - Zod schemas for API request/response validation
- **TypeScript Types** - Shared types for User, Room, Participant, Socket events
- **Type Inference** - Automatic TypeScript types from Zod schemas

## Usage

### In Backend (apps/server)

```typescript
import { registerSchema, CreateRoomInput } from '@edustream/types';

// Validate request
const validatedData = registerSchema.parse(req.body);
```

### In Frontend (apps/web)

```typescript
import { type User, type Room, loginSchema } from '@edustream/types';

// Use types
const user: User = { ... };

// Client-side validation
const result = loginSchema.safeParse(formData);
```

## Benefits

- ✅ Single source of truth for types
- ✅ Type safety across frontend and backend
- ✅ Consistent validation logic
- ✅ Automatic type inference from Zod schemas
- ✅ Reduced duplication
