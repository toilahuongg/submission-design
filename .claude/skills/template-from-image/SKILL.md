---
name: template-from-image
description: |
  Generate screenshot editor templates from reference images. Analyzes design images to extract layout, colors, typography, and elements, then generates JavaScript template code compatible with the submission-design React app. Use when: (1) User provides an image and wants to recreate it as a template, (2) User asks to "create template from image/screenshot", (3) User wants to generate template code based on visual reference, (4) User says "tạo template từ hình ảnh".
---

# Template From Image

Generate screenshot editor templates by analyzing reference images.

## Workflow

1. **Receive image** - User provides reference image (screenshot, design mockup, etc.)
2. **Analyze layout** - Identify visual structure: headers, features, icons, text blocks
3. **Extract colors** - Identify primary, secondary, and accent colors
4. **Map elements** - Convert visual elements to template element types
5. **Generate code** - Output JavaScript template matching project schema

## Template Schema

Templates follow this structure for `react-app/src/data/templates.js`:

```javascript
{
  id: 'unique-template-id',
  name: 'Template Display Name',
  thumbnail: '#PrimaryColor',
  background: {
    type: 'solid' | 'gradient' | 'image',
    // For solid:
    color: '#HexColor',
    // For gradient:
    gradientType: 'linear' | 'radial',
    gradientStart: '#HexColor',
    gradientEnd: '#HexColor',
    gradientAngle: 135,
    radialPosition: 'center',
    // For image:
    image: 'data:image/...' | 'https://...',
    blur: 0  // Background blur in pixels
  },
  elements: [/* Array of elements */]
}
```

## Element Types

### Text Element
```javascript
{
  id: 'text-unique-id',
  type: 'text',
  content: 'Text content',
  x: 800, y: 100,
  size: 48,
  weight: '400' | '600' | '700' | '900',
  italic: false,
  color: '#FFFFFF',
  font: 'Instrument Sans',
  textAlign: 'left' | 'center' | 'right',
  letterSpacing: 0,
  zIndex: 0,
  // Optional effects:
  shadow: { enabled: true, color: '#000000', blur: 4, offsetX: 2, offsetY: 2 },
  outline: { enabled: true, color: '#000000', width: 1 }
}
```

### Shape Element
```javascript
{
  id: 'shape-unique-id',
  type: 'shape',
  shapeType: 'rectangle' | 'circle' | 'arrow' | 'badge',
  x: 800, y: 450,
  width: 200, height: 100,
  zIndex: 0,
  // Fill options:
  fill: '#5C6AC4',
  fillType: 'solid' | 'gradient',
  fillGradientStart: '#5C6AC4',
  fillGradientEnd: '#202E78',
  fillGradientAngle: 135,
  // Stroke:
  stroke: '#FFFFFF',
  strokeWidth: 0,
  opacity: 1,
  // Rectangle only:
  borderRadius: 8,
  // Arrow only:
  arrowStyle: 'solid',
  arrowHead: 'end' | 'both' | 'none',
  arrowHeadStyle: 'classic',
  curvature: 0,
  // Badge only:
  text: '1'
}
```

### Icon Element
```javascript
{
  id: 'icon-unique-id',
  type: 'icon',
  iconId: 'icon-name',
  svg: '<svg>...</svg>',
  name: 'Display Name',
  x: 800, y: 450,
  width: 64, height: 64,
  color: '#FFFFFF',
  opacity: 1,
  zIndex: 0
}
```

### Annotation Element
```javascript
// Callout - speech bubble with pointer
{
  id: 'annotation-callout',
  type: 'annotation',
  annotationType: 'callout',
  x: 800, y: 450,
  width: 200, height: 80,
  text: 'Callout text',
  pointerPosition: 'bottom' | 'top' | 'left' | 'right',
  fill: '#5C6AC4',
  textColor: '#FFFFFF',
  opacity: 1,
  zIndex: 0
}

// Numbered circle - step indicator
{
  id: 'annotation-number',
  type: 'annotation',
  annotationType: 'numbered-circle',
  x: 800, y: 450,
  size: 40,
  number: 1,
  fill: '#5C6AC4',
  textColor: '#FFFFFF',
  zIndex: 0
}

// Highlight - semi-transparent overlay
{
  id: 'annotation-highlight',
  type: 'annotation',
  annotationType: 'highlight',
  x: 800, y: 450,
  width: 200, height: 100,
  fill: '#5C6AC4',
  opacity: 0.3,
  zIndex: 0
}
```

### Device Frame Element
```javascript
{
  id: 'device-unique-id',
  type: 'device',
  deviceType: 'browser' | 'laptop' | 'desktop',
  x: 600, y: 350,
  scale: 85,
  shadow: 50,
  rotation: 0,
  zIndex: 0,
  screenshot: 'data:image/...' | 'https://...' // Optional screenshot inside frame
}
```

### Image Overlay Element
```javascript
{
  id: 'image-unique-id',
  type: 'image',
  src: 'data:image/...' | 'https://...',
  x: 800, y: 450,
  width: 200, height: 200,
  opacity: 1,
  rotation: 0,
  zIndex: 0
}
```

## Element Properties

All elements support these optional properties:

```javascript
{
  // ... element-specific properties
  locked: true,    // Prevent moving/editing
  visible: true,   // Show/hide element
  rotation: 0      // Rotation in degrees
}
```

### When to Lock Elements
- **Header/branding elements** - App icon, app name that shouldn't move
- **Background shapes** - Decorative shapes that form the layout structure
- **Fixed layout elements** - Elements that define the template's visual identity

### When to Hide Elements
- Use `visible: false` for elements that are optional placeholders

## Groups

Group related elements together so they move/select as a unit.

### Template with Groups
```javascript
{
  id: 'template-id',
  name: 'Template Name',
  background: { /* ... */ },
  elements: [ /* ... */ ],
  groups: [
    {
      id: 'group-header',
      name: 'Header',
      elementIds: ['app-icon-bg', 'app-icon', 'header-text']
    },
    {
      id: 'group-feature-1',
      name: 'Feature 1',
      elementIds: ['feat-1-circle', 'feat-1-icon', 'feat-1-title', 'feat-1-desc']
    }
  ]
}
```

### When to Group Elements
- **Feature cards** - Circle/shape + icon + title + description
- **Header section** - Logo background + icon + app name
- **Call-to-action** - Button shape + text
- **Badge/label** - Background shape + text/icon

### Group Naming Convention
Use descriptive names:
- `group-header` - Header elements
- `group-feature-1`, `group-feature-2` - Feature sections
- `group-cta` - Call-to-action elements
- `group-footer` - Footer elements

## Canvas Dimensions

- **Canvas**: 1600 × 900 pixels
- **Center**: x=800, y=450
- Elements use top-left corner as origin

## Built-in Icons

| iconId | Description |
|--------|-------------|
| arrow-right/left/up/down | Direction arrows |
| check, check-circle | Checkmarks |
| star, heart, thumbs-up | Reactions |
| zap, shield, eye | Status icons |
| bell, gift, rocket | Action icons |
| tag, refresh, clock, folder | Utility icons |

## Analysis Guidelines

1. **Layout Pattern**
   - Header (logo, app name, tagline)
   - Main content (features, screenshots)
   - Feature cards/columns

2. **Typography Mapping**
   - Headline: size 48-72, weight 700-900
   - Subheadline: size 24-36, weight 600
   - Body: size 16-20, weight 400

3. **Positioning**
   - Use grid-based layout
   - Maintain visual balance on 1600×900

## Output Format

```javascript
const NEW_TEMPLATE = {
  id: 'template-name',
  name: 'Template Display Name',
  thumbnail: '#PrimaryColor',
  background: { /* ... */ },
  elements: [ /* ... */ ],
  groups: [ /* Optional: group related elements */ ]
};
```

## zIndex Guidelines

- **Background shapes**: zIndex 0-10
- **Content elements**: zIndex 11-50
- **Overlays/annotations**: zIndex 51-100
- Elements render in zIndex order (higher = on top)
