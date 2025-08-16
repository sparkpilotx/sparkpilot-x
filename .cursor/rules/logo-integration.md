# Logo Integration Feature

## Overview

The logo integration system provides consistent branding across all layers of the SparkPilot-X desktop application, from system-level icons to in-app UI elements.

## Architecture

### File Structure
```
src/renderer/public/logo/
├── icon-logo.icns          # macOS app bundle icon (1.1MB)
├── icon-logo.ico           # Windows app bundle icon (127KB)
├── 1024x1024.png          # High-resolution PNG (501KB)
├── 512x512.png            # Medium-resolution PNG (151KB)
└── 256x256.png            # Standard-resolution PNG (48KB)
```

### Integration Points

#### 1. Main Process (Electron)
- **Window Icon**: Set in `BrowserWindow` creation
- **macOS Dock Icon**: Dynamically set based on environment
- **File Paths**: 
  - Dev: `src/renderer/public/logo/512x512.png`
  - Prod: `resources/logo/512x512.png` (via extraResources)

#### 2. Renderer Process (React)
- **Favicon**: HTML `<link>` tags for browser tabs
- **UI Components**: Logo displayed in custom title bar
- **Asset References**: Direct URL paths from public folder

#### 3. Build Configuration
- **macOS Bundle**: `.icns` file for app icon
- **Resource Packaging**: Logo folder copied to `resources/` at build time

## Implementation Details

### Main Process Icon Management

```typescript:src/main/index.ts
// BrowserWindow icon (affects window title bar)
icon: join(__dirname, '../renderer/public/logo/512x512.png')

// macOS dock icon (dev vs production)
if (platform.isMacOS) {
  const dockIconPath = app.isPackaged
    ? join(process.resourcesPath, 'logo/512x512.png')
    : resolve('src/renderer/public/logo/512x512.png');
  const dockIcon = nativeImage.createFromPath(dockIconPath);
  if (!dockIcon.isEmpty()) {
    app.dock?.setIcon(dockIcon);
  }
}
```

### Renderer Favicon Configuration

```html:src/renderer/index.html
<link rel="icon" type="image/png" sizes="256x256" href="/logo/256x256.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/logo/512x512.png" />
```

### UI Component Integration

```typescript:src/renderer/src/components/layout/window-title-bar.tsx
import logo from '/logo/256x256.png';

// Logo displayed in custom title bar
<img
  src={logo}
  alt="App logo"
  className="h-4 w-4 rounded-sm opacity-80"
  draggable={false}
/>
```

### Build Configuration

```yaml:electron-builder.yml
mac:
  icon: src/renderer/public/logo/icon-logo.icns

extraResources:
  - from: src/renderer/public/logo
    to: logo
```

## Platform-Specific Behavior

### macOS
- **App Bundle**: Uses `.icns` file for dock, finder, and app switcher
- **Runtime**: Dock icon set programmatically for consistent branding
- **Window**: Custom title bar with logo integration

### Windows
- **App Bundle**: Uses `.ico` file for taskbar and file associations
- **Runtime**: Window icon from BrowserWindow configuration

### Development vs Production
- **Dev**: Logo files loaded from source directory
- **Prod**: Logo files packaged into app bundle via extraResources
- **Fallback**: PNG versions available for runtime customization

## Usage Guidelines

### Adding New Logo Sizes
1. Add PNG file to `src/renderer/public/logo/`
2. Update favicon links in `index.html` if needed
3. Consider adding to `extraResources` for production access

### Logo File Requirements
- **PNG**: For UI components and favicons (256x256, 512x512, 1024x1024)
- **ICNS**: For macOS app bundle (high-quality vector conversion)
- **ICO**: For Windows app bundle (multiple sizes embedded)

### Performance Considerations
- **File Sizes**: Optimize PNGs for web delivery
- **Loading**: Logos loaded asynchronously in renderer
- **Caching**: Browser handles favicon caching automatically

## Troubleshooting

### Common Issues

#### Dock Icon Not Updating
- **Cause**: Path resolution issues in production
- **Solution**: Verify `extraResources` configuration and `process.resourcesPath` usage

#### Favicon Not Displaying
- **Cause**: Incorrect public folder path
- **Solution**: Ensure logo files are in `src/renderer/public/logo/`

#### Build Icon Missing
- **Cause**: Incorrect path in electron-builder.yml
- **Solution**: Verify relative path from project root to icon file

### Debug Steps
1. Check console for path resolution errors
2. Verify file existence in expected locations
3. Test with absolute paths in development
4. Validate build output includes logo resources

## Future Enhancements

### Planned Features
- **Dynamic Logo Switching**: Theme-aware logo variants
- **Logo Animation**: Subtle loading animations
- **Brand Consistency**: Logo usage guidelines for developers

### Technical Improvements
- **SVG Support**: Vector logo formats for scaling
- **Lazy Loading**: Progressive logo loading
- **Error Handling**: Graceful fallbacks for missing assets

## Related Documentation

- [Electron Security Model](../security/electron-security.md)
- [Build Configuration](../build/electron-builder.md)
- [Component Guidelines](../development/renderer-rules.md)
- [Asset Management](../development/assets.md)
