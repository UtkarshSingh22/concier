# Building Product Features

This guide explains where and how to build your product features.

## Where to Build

All your custom code goes in:

| Location | Purpose |
|----------|---------|
| `/app/(protected)/product/` | Dashboard pages |
| `/components/product/` | Product-specific components |
| `/app/api/` | API routes |

## Starting Point

The main dashboard is at `/app/(protected)/product/page.tsx`:

```typescript
export default async function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4">
        <ProductPageClient />
      </main>
    </div>
  );
}
```

The client component is at `/components/ProductPageClient.tsx`.

## Adding a New Feature

### 1. Create Component

Create in `/components/product/`:

```typescript
// /components/product/MyFeature.tsx
"use client";

export function MyFeature() {
  return (
    <div>
      <h2>My Feature</h2>
      {/* Feature content */}
    </div>
  );
}
```

### 2. Add to Dashboard

Import in your dashboard:

```typescript
import { MyFeature } from "@/components/product/MyFeature";

export default function ProductPage() {
  return (
    <main>
      <MyFeature />
    </main>
  );
}
```

### 3. Gate If Premium

Wrap with `FeatureGate` if it's a premium feature:

```typescript
import { FeatureGate } from "@/components/FeatureGate";
import { MyFeature } from "@/components/product/MyFeature";

<FeatureGate entitlement="pro_features">
  <MyFeature />
</FeatureGate>
```

## Adding API Routes

Create API routes in `/app/api/`:

```typescript
// /app/api/my-feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Your logic here
  return NextResponse.json({ data: "..." });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = await request.json();
  // Your logic here
  
  return NextResponse.json({ success: true });
}
```

## Accessing User Data

### Server Components

```typescript
import { requireAuth } from "@/lib/auth-utils";

export default async function Page() {
  const user = await requireAuth();
  // user.email, user.name, user.subscriptions, etc.
}
```

### Client Components

```typescript
"use client";
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  // session.user.email, session.user.name, etc.
}
```

### API Routes

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const session = await getServerSession(authOptions);
// session.user.email, etc.
```

## Checking Entitlements in API

```typescript
import { hasEntitlement } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const hasPro = await hasEntitlement("pro_features");
  if (!hasPro) {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }
  
  // Pro-only logic
}
```

## Database Access

Use Prisma client:

```typescript
import { db } from "@/lib/db";

// Query
const items = await db.yourModel.findMany({
  where: { userId: user.id },
});

// Create
await db.yourModel.create({
  data: { userId: user.id, ... },
});
```

## Example: Full Feature

### Component

```typescript
// /components/product/TaskList.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetch("/api/tasks").then(r => r.json()).then(setTasks);
  }, []);
  
  const addTask = async () => {
    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: "New Task" }),
    });
    // Refresh tasks
  };
  
  return (
    <div>
      {tasks.map(task => <div key={task.id}>{task.title}</div>)}
      <Button onClick={addTask}>Add Task</Button>
    </div>
  );
}
```

### API Route

```typescript
// /app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const tasks = await db.task.findMany({
    where: { userId: session.user.id },
  });
  
  return NextResponse.json(tasks);
}
```

## What You Should Edit

- `/app/(protected)/product/page.tsx` - Your dashboard
- `/components/ProductPageClient.tsx` - Dashboard client component
- `/components/product/` - Your components
- `/app/api/` - Your API routes

## What NOT to Change

- Core auth logic
- Stripe integration
- Entitlement system
- Email system

