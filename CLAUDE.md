# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains tools for creating Shopify app submission assets:

- **SubmissionTemplates/** - PSD and Sketch templates for app icons, feature banners, feature images, video thumbnails, and screenshots
- **react-app/** - A React-based screenshot editor for creating 1600×900 Shopify app listing images

## Development Commands

All commands run from the `react-app/` directory:

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

### Screenshot Editor (react-app)

The app is a visual editor for composing Shopify app store screenshots with device frames and text overlays.

**State Management**: Single Zustand store ([src/store/editorStore.js](react-app/src/store/editorStore.js)) manages:
- Canvas zoom level
- Background (solid color, gradient, or image)
- Device frame settings (type, scale, shadow)
- Screenshot image
- Text overlays array
- Undo/redo history (50 states max)
- Template presets

**Key Components**:
- [Canvas.jsx](react-app/src/components/Canvas.jsx) - Main editing canvas with device frames (browser/laptop/desktop) and draggable text elements
- [PropertiesSidebar.jsx](react-app/src/components/PropertiesSidebar.jsx) - Controls for background, device, and text properties
- [TemplateSidebar.jsx](react-app/src/components/TemplateSidebar.jsx) - Preset template selection
- [ExportModal.jsx](react-app/src/components/ExportModal.jsx) - PNG/JPG export using html2canvas

**Canvas Dimensions**: Fixed 1600×900 pixel output size, viewport-scaled for editing.

**Keyboard Shortcuts**:
- Ctrl+Z / Cmd+Z: Undo
- Ctrl+Y / Cmd+Shift+Z: Redo
- Delete: Remove selected text

## Tech Stack

- React 19 with Vite 7
- Zustand for state management
- html2canvas for image export
- ESLint with React hooks plugin
