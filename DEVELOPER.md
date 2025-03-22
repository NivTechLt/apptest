# FitTrack - Developer Documentation

This document provides detailed technical information for developers working on the FitTrack application.

## Code Structure

```
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base shadcn/ui components
│   │   │   └── ...          # Application-specific components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and helpers
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend Express application
│   ├── auth.ts              # Authentication logic
│   ├── db.ts                # Database connection
│   ├── dbStorage.ts         # Database implementation of storage interface
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API endpoints
│   ├── storage.ts           # Storage interface definition and memory implementation
│   ├── subscription.ts      # Stripe subscription logic
│   └── vite.ts              # Vite server integration
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema and types
└── drizzle.config.ts        # Drizzle ORM configuration
```

## Development Guidelines

### General Principles

1. **Mobile-First Design**: All components should be designed for mobile first, then adapted for larger screens.
2. **TypeScript Everywhere**: Use proper typing for all components, functions, and variables.
3. **Component Reusability**: Extract common UI patterns into reusable components.
4. **Accessibility**: Ensure all components meet WCAG standards (color contrast, keyboard navigation, etc.).

### Frontend Development

#### Component Structure

Components should follow this structure:

```tsx
// Import React and hooks
import { useState } from "react";

// Import types
import { SomeType } from "@shared/schema";

// Import UI components
import { Button } from "@/components/ui/button";

// Define component props interface
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// Define the component
export default function Component({ prop1, prop2 = 0 }: ComponentProps) {
  // State and hooks
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    setState(!state);
  };
  
  // Render
  return (
    <div>
      <Button onClick={handleClick}>
        {prop1}: {prop2}
      </Button>
    </div>
  );
}
```

#### Data Fetching

Always use TanStack Query for data fetching:

```tsx
// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/endpoint', param],
  queryFn: getQueryFn()
});

// Mutation
const mutation = useMutation({
  mutationFn: async (data) => {
    const res = await apiRequest('POST', '/api/endpoint', data);
    return await res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
    toast({
      title: "Success",
      description: "Operation completed successfully",
    });
  },
  onError: (error: Error) => {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  },
});
```

#### Forms

Use react-hook-form with zod validation:

```tsx
const formSchema = z.object({
  field: z.string().min(2).max(50),
});

type FormValues = z.infer<typeof formSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    field: "",
  },
});

const onSubmit = (values: FormValues) => {
  mutation.mutate(values);
};

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
</Form>
```

### Backend Development

#### API Endpoints

API endpoints should follow this pattern:

```typescript
app.get('/api/resource', async (req, res) => {
  try {
    // Get data from storage
    const data = await storage.getResource();
    
    // Send response
    res.json(data);
  } catch (error) {
    console.error('Error getting resource:', error);
    res.status(500).json({ message: 'Failed to get resource' });
  }
});

app.post('/api/resource', async (req, res) => {
  try {
    // Validate request body
    const result = resourceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        message: 'Invalid request body',
        errors: result.error.format() 
      });
    }
    
    // Create resource in storage
    const resource = await storage.createResource(result.data);
    
    // Send response
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Failed to create resource' });
  }
});
```

#### Authentication Middleware

Protect routes with these middleware functions:

```typescript
// Require authentication
app.get('/api/protected', isAuthenticated, (req, res) => {
  // Only authenticated users can access
});

// Require subscription
app.get('/api/premium', hasSubscription('premium'), (req, res) => {
  // Only premium subscribers can access
});

// Require admin
app.get('/api/admin', isAdmin, (req, res) => {
  // Only admins can access
});
```

### Database Schema

The database schema is defined in `shared/schema.ts` using Drizzle ORM.

When adding a new table:

1. Define the table schema
2. Create an insert schema
3. Export the types

Example:

```typescript
// Define table
export const newTable = pgTable("new_table", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schema
export const insertNewTableSchema = createInsertSchema(newTable).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertNewTable = z.infer<typeof insertNewTableSchema>;
export type NewTable = typeof newTable.$inferSelect;

// Define relations
export const newTableRelations = relations(newTable, ({ one }) => ({
  user: one(users, {
    fields: [newTable.userId],
    references: [users.id],
  }),
}));
```

### Storage Interface

When adding new functionality, update the storage interface in `server/storage.ts` and implement it in both `MemStorage` and `DbStorage` classes.

```typescript
export interface IStorage {
  // Add new methods to the interface
  getNewResource(id: number): Promise<NewResource | undefined>;
  createNewResource(resource: InsertNewResource): Promise<NewResource>;
}

// Implement in MemStorage for development
export class MemStorage implements IStorage {
  // Implement the new methods
  async getNewResource(id: number): Promise<NewResource | undefined> {
    // Implementation
  }
  
  async createNewResource(resource: InsertNewResource): Promise<NewResource> {
    // Implementation
  }
}

// Implement in DbStorage for production (in dbStorage.ts)
export class DbStorage implements IStorage {
  // Implement the new methods
  async getNewResource(id: number): Promise<NewResource | undefined> {
    // Implementation using Drizzle ORM
  }
  
  async createNewResource(resource: InsertNewResource): Promise<NewResource> {
    // Implementation using Drizzle ORM
  }
}
```

## Subscription Features

The application implements feature gating based on subscription level. Use the `hasFeatureAccess` utility to check access:

```typescript
import { hasFeatureAccess } from "@/lib/subscription-utils";

// In a component
const { user } = useAuth();
const canAccess = hasFeatureAccess(user, "advancedAnalytics");

// Conditional rendering
{canAccess ? (
  <AdvancedAnalytics />
) : (
  <UpgradePrompt feature="advancedAnalytics" />
)}

// Or use the SubscriptionFeature component
<SubscriptionFeature featureKey="advancedAnalytics">
  <AdvancedAnalytics />
</SubscriptionFeature>
```

## Testing

### Unit Tests

Write unit tests for utilities and pure functions:

```typescript
describe('calculateCalories', () => {
  it('should calculate calories correctly for running', () => {
    const calories = calculateCalories('running', 30, 'high');
    expect(calories).toBe(300);
  });
});
```

### Component Tests

Test components with React Testing Library:

```typescript
describe('WorkoutForm', () => {
  it('should render the form', () => {
    render(<WorkoutForm isVisible={true} onClose={() => {}} />);
    expect(screen.getByText('Add Workout')).toBeInTheDocument();
  });
  
  it('should call onClose when cancel button is clicked', () => {
    const onClose = jest.fn();
    render(<WorkoutForm isVisible={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
```

## Common Patterns

### Protected Routes

Use the `ProtectedRoute` component for routes that require authentication:

```tsx
<Switch>
  <Route path="/auth" component={AuthPage} />
  <ProtectedRoute path="/" component={HomePage} />
  <Route component={NotFound} />
</Switch>
```

### Subscription Features

Use the `SubscriptionFeature` component to gate premium features:

```tsx
<SubscriptionFeature
  featureKey="aiWorkoutPlanner"
  fallback={<UpgradePrompt feature="aiWorkoutPlanner" />}
>
  <AiWorkoutPlanner />
</SubscriptionFeature>
```

### Error Handling

Use toast notifications for error handling:

```typescript
try {
  // Some operation
} catch (error) {
  toast({
    title: "Error",
    description: error.message || "An unexpected error occurred",
    variant: "destructive",
  });
}
```

## Performance Considerations

1. **Query Optimization**: Use the `select` method in Drizzle to fetch only the needed fields.
2. **Pagination**: Implement pagination for lists with potentially large data sets.
3. **Memoization**: Use `useMemo` and `useCallback` for expensive calculations or callbacks.
4. **Code Splitting**: Use dynamic imports for large components that aren't immediately needed.

## Deployment

The application is deployed on Replit and can be accessed at the provided URL. The deployment process is handled by Replit's deployment service.

## Troubleshooting

### Common Issues

1. **Authentication Issues**: Check if the session cookie is being set and if the user object is being properly deserialized.
2. **API Errors**: Check the server logs for detailed error messages.
3. **Database Connectivity**: Ensure the DATABASE_URL environment variable is correctly set.
4. **Stripe Integration**: Verify the Stripe secret key and webhook secret are correctly configured.

### Debugging

1. Use the browser developer tools to inspect network requests and component state.
2. Check the server logs for backend errors.
3. Use the React Developer Tools extension to inspect component props and state.

## Contributing

1. Create a new branch for your feature or bug fix
2. Write tests for your changes
3. Ensure all tests pass
4. Submit a pull request for review

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Express.js Documentation](https://expressjs.com)
- [Stripe API Documentation](https://stripe.com/docs/api)