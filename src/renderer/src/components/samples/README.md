# tRPC Samples Components

This directory contains modular React components demonstrating various tRPC v11 features and patterns for Electron applications.

## Directory Structure

```
samples/
├── hello-query/                          # Hello-query router samples
│   ├── basic-hello.tsx                   # Simple query demo
│   ├── hello-with-name.tsx               # Input validation demo
│   ├── echo-test.tsx                     # Complex data types demo
│   ├── hello-query-samples-container.tsx # Hello-query container
│   └── index.ts                          # Hello-query exports
├── samples-container.tsx                 # Main container organizing all routers
├── index.ts                             # Main exports
└── README.md                            # This file
```

## Current Sample Routers

### Hello Query Router (`hello-query/`)

#### BasicHello (`hello-query/basic-hello.tsx`)
- Simple tRPC query without parameters
- Demonstrates basic connectivity testing
- Shows loading states and error handling
- Perfect for initial setup verification

#### HelloWithName (`hello-query/hello-with-name.tsx`)
- tRPC query with input validation using Zod schemas
- Form state management with React hooks
- Input validation error handling
- Conditional query execution based on user input

#### EchoTest (`hello-query/echo-test.tsx`)
- Complex input types (string, number, boolean, array)
- Data serialization testing between main and renderer processes
- Multiple input controls and form state management
- Useful for debugging data transmission

## Adding New Samples

### Adding Components to Existing Router

To add a new component to an existing router (e.g., hello-query):

1. **Create the component file** in the router subdirectory: `hello-query/your-component.tsx`

2. **Follow the component pattern**:
   ```typescript
   interface YourComponentProps {
     className?: string;
   }

   const YourComponent = ({ className }: YourComponentProps): React.JSX.Element => {
     // Component implementation
   };

   export default YourComponent;
   ```

3. **Export from router index.ts**:
   ```typescript
   // In hello-query/index.ts
   export { default as YourComponent } from './your-component';
   ```

4. **Add to SamplesContainer** if it should be displayed in the main samples page

### Adding New Router Samples

To add a new router with its own components:

1. **Create router subdirectory**: `samples/your-router/`

2. **Create router components** following the same pattern as hello-query

3. **Create router index.ts**:
   ```typescript
   export { default as Component1 } from './component1';
   export { default as Component2 } from './component2';
   ```

4. **Export from main index.ts**:
   ```typescript
   // In samples/index.ts
   export * from './your-router';
   ```

5. **Update SamplesContainer** to include new router components

## Design Principles

- **Modular**: Each component is self-contained and can be used independently
- **Type-safe**: Full TypeScript integration with tRPC procedures
- **Documented**: Comprehensive JSDoc comments explaining functionality
- **Accessible**: Proper labels, form controls, and semantic HTML
- **Responsive**: Works across different screen sizes
- **Error-handled**: Graceful error states and user feedback

## Styling Guidelines

- Use Tailwind CSS classes for styling
- Support both light and dark themes
- Use consistent color schemes:
  - Green: Success states and basic operations
  - Blue: Information and user interactions
  - Purple: Debug/testing features
  - Red: Errors and validation issues
- Maintain consistent spacing with the `space-y-*` pattern
- Use rounded corners and subtle borders for visual separation

## Integration Notes

All components use:
- `@tanstack/react-query` for state management
- `trpc` client from `@/lib/trpc`
- shadcn/ui components for consistent UI elements
- Proper TypeScript interfaces for props and data structures
