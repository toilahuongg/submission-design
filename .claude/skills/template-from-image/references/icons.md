# Built-in Icons Reference

Complete list of built-in icons available in the screenshot editor.

## Icon SVG Definitions

Use these SVG definitions when creating icon elements in templates.

### Arrow Icons

```javascript
// arrow-right
{ id: 'arrow-right', name: 'Mũi tên phải', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' }

// arrow-left
{ id: 'arrow-left', name: 'Mũi tên trái', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' }

// arrow-up
{ id: 'arrow-up', name: 'Mũi tên lên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' }

// arrow-down
{ id: 'arrow-down', name: 'Mũi tên xuống', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>' }
```

### Check/Confirmation Icons

```javascript
// check
{ id: 'check', name: 'Dấu tích', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' }

// check-circle
{ id: 'check-circle', name: 'Tích tròn', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }
```

### Reaction Icons

```javascript
// star
{ id: 'star', name: 'Ngôi sao', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>' }

// heart
{ id: 'heart', name: 'Trái tim', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' }

// thumbs-up
{ id: 'thumbs-up', name: 'Thích', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' }
```

### Status Icons

```javascript
// zap (lightning)
{ id: 'zap', name: 'Sấm sét', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>' }

// shield
{ id: 'shield', name: 'Khiên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' }

// eye
{ id: 'eye', name: 'Mắt', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' }
```

### Action Icons

```javascript
// bell
{ id: 'bell', name: 'Chuông', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' }

// gift
{ id: 'gift', name: 'Quà', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' }

// rocket
{ id: 'rocket', name: 'Tên lửa', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' }

// cursor-click
{ id: 'cursor-click', name: 'Con trỏ click', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 9l-1 11 3.5-5 5.5 1L9 9z"/></svg>' }
```

### Utility Icons

```javascript
// tag
{ id: 'tag', name: 'Thẻ tag', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>' }

// refresh
{ id: 'refresh', name: 'Làm mới', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>' }

// clock
{ id: 'clock', name: 'Đồng hồ', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' }

// folder
{ id: 'folder', name: 'Thư mục', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>' }

// tag-arrow
{ id: 'tag-arrow', name: 'Thẻ tag mũi tên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/><path d="M10 10l4 4m0-4l-4 4"/></svg>' }
```

## Usage in Templates

When creating an icon element in a template:

```javascript
{
  id: 'feat-icon',
  type: 'icon',
  iconId: 'zap',  // Reference from list above
  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>',
  name: 'Zap',
  x: 406,
  y: 310,
  width: 100,
  height: 100,
  color: '#FFFFFF'
}
```

## Creating Custom Icons

For icons not in the built-in list, create custom SVG:

```javascript
{
  id: 'custom-icon',
  type: 'icon',
  iconId: 'custom-name',
  svg: '<svg viewBox="0 0 24 24"><!-- your SVG paths --></svg>',
  name: 'Custom Icon Name',
  x: 800,
  y: 450,
  width: 64,
  height: 64,
  color: '#5C6AC4'
}
```

SVG Guidelines:
- Use `viewBox="0 0 24 24"` for consistency
- Use `currentColor` for fill/stroke to enable color customization
- Keep paths simple for better scaling
