# Pixel Perfect Gallery

A high-performance, virtualized masonry grid photo gallery built with React and TypeScript. This application demonstrates efficient rendering techniques for large image collections.

## Features

- Virtualized masonry grid layout for optimal performance
- Custom implementation without third-party layout libraries
- Photo detail view with metadata and photographer information
- Search functionality to find photos by keywords
- Responsive design for all device sizes
- Error boundaries for improved error handling
- Performance optimizations using React hooks

## Tech Stack

- React 18
- TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Vite for development and building

## Performance Optimizations

This application includes several performance optimizations:

1. **Virtualized Rendering**: Only renders photos that are visible in the viewport, dramatically reducing DOM nodes
2. **Image Lazy Loading**: Uses native browser lazy loading for images
3. **Memoization**: Uses React.memo, useMemo, and useCallback to prevent unnecessary re-renders
4. **Efficient Layout Calculation**: Custom masonry layout algorithm optimized for performance
5. **Responsive Image Loading**: Loads appropriately sized images based on viewport size
6. **Code Splitting**: Uses React Router for route-based code splitting
7. **Efficient State Management**: Optimized React state management to minimize renders

## Running the Project

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add your Pexels API key to `src/services/api.ts`
4. Start the development server:
   ```
   npm run dev
   ```

### Building for Production

```
npm run build
```

## Testing

Run the unit tests:

```
npm run test
```

## Design Decisions

### Custom Virtualization

Rather than using a third-party library, this project implements custom virtualization to demonstrate how efficient rendering can be achieved with vanilla React. This approach allows for greater control over the rendering process and a better understanding of the underlying mechanics.

### Masonry Layout Algorithm

The masonry layout algorithm places items in the shortest column first, which creates a balanced grid while maintaining the aspect ratio of images. This approach is more efficient than traditional grid layouts for images with varying dimensions.

### Error Handling

Comprehensive error boundaries and error states ensure a smooth user experience even when things go wrong. Errors are caught at appropriate levels and meaningful feedback is provided to users.