# tRPC Samples Components

This directory contains modular React components demonstrating various tRPC v11 features and patterns for Electron applications.

## Current Samples

### BasicHello (`basic-hello.tsx`)
- Simple tRPC query without parameters
- Demonstrates basic connectivity testing
- Shows loading states and error handling
- Perfect for initial setup verification

### HelloWithName (`hello-with-name.tsx`)
- tRPC query with input validation using Zod schemas
- Form state management with React hooks
- Input validation error handling
- Conditional query execution based on user input

### EchoTest (`echo-test.tsx`)
- Complex input types (string, number, boolean, array)
- Data serialization testing between main and renderer processes
- Multiple input controls and form state management
- Useful for debugging data transmission

## Adding New Samples

To add a new sample component:

1. **Create the component file** in this directory following the naming convention `{feature-name}.tsx`

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

3. **Add comprehensive JSDoc documentation** explaining:
   - What the component demonstrates
   - Key features showcased
   - Usage patterns shown

4. **Export from index.ts**:
   ```typescript
   export { default as YourComponent } from './your-component';
   ```

5. **Add to SamplesContainer** if it should be displayed in the main samples page

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
