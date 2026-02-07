import { create } from 'zustand';

const AUTO_SAVE_KEY = 'screenshot-editor-autosave';



const COLOR_PRESETS = [
  '#5C6AC4', '#008060', '#BF0711', '#9C6ADE',
  '#47C1BF', '#F49342', '#212B36', '#637381'
];

const GRADIENT_PRESETS = [
  { name: 'Shopify Purple', start: '#5C6AC4', end: '#202E78', angle: 135 },
  { name: 'Ocean Blue', start: '#2193b0', end: '#6dd5ed', angle: 135 },
  { name: 'Sunset', start: '#f7971e', end: '#ffd200', angle: 135 },
  { name: 'Forest Green', start: '#11998e', end: '#38ef7d', angle: 135 },
  { name: 'Berry Red', start: '#e52d27', end: '#b31217', angle: 135 },
  { name: 'Midnight', start: '#232526', end: '#414345', angle: 135 },
  { name: 'Peach', start: '#ffecd2', end: '#fcb69f', angle: 135 },
  { name: 'Lavender', start: '#a18cd1', end: '#fbc2eb', angle: 135 },
  { name: 'Cool Sky', start: '#2980B9', end: '#6DD5FA', angle: 135 },
  { name: 'Rose Gold', start: '#f4c4f3', end: '#fc67fa', angle: 135 },
  { name: 'Deep Space', start: '#000428', end: '#004e92', angle: 135 },
  { name: 'Warm Flame', start: '#ff9a9e', end: '#fecfef', angle: 135 },
];

const BUILT_IN_ICONS = [
  { id: 'arrow-right', name: 'Mũi tên phải', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' },
  { id: 'arrow-left', name: 'Mũi tên trái', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' },
  { id: 'arrow-up', name: 'Mũi tên lên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>' },
  { id: 'arrow-down', name: 'Mũi tên xuống', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>' },
  { id: 'check', name: 'Dấu tích', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
  { id: 'check-circle', name: 'Tích tròn', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' },
  { id: 'star', name: 'Ngôi sao', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/></svg>' },
  { id: 'heart', name: 'Trái tim', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
  { id: 'thumbs-up', name: 'Thích', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>' },
  { id: 'zap', name: 'Sấm sét', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>' },
  { id: 'shield', name: 'Khiên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { id: 'eye', name: 'Mắt', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { id: 'bell', name: 'Chuông', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
  { id: 'gift', name: 'Quà', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>' },
  { id: 'rocket', name: 'Tên lửa', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' },
  { id: 'cursor-click', name: 'Con trỏ click', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 9l-1 11 3.5-5 5.5 1L9 9z"/></svg>' },
  { id: 'tag', name: 'Thẻ tag', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>' },
  { id: 'refresh', name: 'Làm mới', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>' },
  { id: 'clock', name: 'Đồng hồ', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { id: 'folder', name: 'Thư mục', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>' },
  { id: 'tag-arrow', name: 'Thẻ tag mũi tên', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/><path d="M10 10l4 4m0-4l-4 4"/></svg>' }
];

const useEditorStore = create((set, get) => ({
  // State
  zoom: 1,
  background: {
    type: 'gradient',
    color: '#5C6AC4',
    gradientStart: '#5C6AC4',
    gradientEnd: '#202E78',
    gradientAngle: 135,
    gradientType: 'linear',
    radialPosition: 'center',
    image: null,
    blur: 0
  },

  // Unified elements system
  elements: [],
  selectedElementId: null,
  selectedElementIds: [],
  clipboard: null,

  // Groups
  groups: [],
  editingGroupId: null,

  // History
  history: [],
  historyIndex: -1,

  // UI state
  showExportModal: false,
  showPropertiesSidebar: true,
  showTemplateSidebar: false,
  showShortcutsModal: false,
  activeTool: null,
  toast: null,

  // Rulers & Guides
  showRulers: false,
  showGuides: true,
  showGrid: false,
  guides: [],
  snapToGuides: true,
  snapThreshold: 5,

  // Recent colors
  recentColors: [],

  // Auto-save
  enableAutoSave: true,

  // Constants

  colorPresets: COLOR_PRESETS,
  gradientPresets: GRADIENT_PRESETS,
  builtInIcons: BUILT_IN_ICONS,

  // ============ ZOOM ============
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(2, zoom)) }),

  // ============ BACKGROUND ============
  setBackground: (updates) => {
    set((state) => ({
      background: { ...state.background, ...updates }
    }));
    get().saveState();
  },

  setBackgroundType: (type) => {
    set((state) => ({
      background: { ...state.background, type }
    }));
    get().saveState();
  },

  getBackgroundStyle: () => {
    const { background } = get();
    switch (background.type) {
      case 'solid':
        return { background: background.color };
      case 'gradient':
        if (background.gradientType === 'radial') {
          return {
            background: `radial-gradient(circle at ${background.radialPosition}, ${background.gradientStart}, ${background.gradientEnd})`
          };
        }
        return {
          background: `linear-gradient(${background.gradientAngle}deg, ${background.gradientStart}, ${background.gradientEnd})`
        };
      case 'image':
        return background.image
          ? { backgroundImage: `url(${background.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: background.color };
      default:
        return { background: '#5C6AC4' };
    }
  },

  // ============ DEVICE ============
  setScreenshot: (screenshot) => {
    const { elements, selectedElementId } = get();
    const selectedElement = elements.find(el => el.id === selectedElementId);

    if (selectedElement && selectedElement.type === 'device') {
      get().updateElement(selectedElementId, { screenshot });
      get().saveState();
      get().showToastMessage('Đã cập nhật ảnh cho khung hình');
    } else {
      const id = 'device-' + Date.now();
      const newDevice = {
        id,
        type: 'device',
        deviceType: 'browser',
        scale: 85,
        shadow: 50,
        x: 600,
        y: 350,
        zIndex: elements.length,
        rotation: 0,
        screenshot
      };

      set((state) => ({
        elements: [...state.elements, newDevice],
        selectedElementId: id,
        selectedElementIds: [id]
      }));
      get().saveState();
      get().showToastMessage('Đã tạo khung hình mới với ảnh');
    }
  },

  addDevice: (deviceType) => {
    if (deviceType === 'none') return;
    const id = 'device-' + Date.now();
    const newDevice = {
      id,
      type: 'device',
      deviceType,
      scale: 85,
      shadow: 50,
      x: 600,
      y: 350,
      zIndex: get().elements.length,
      rotation: 0
    };

    set((state) => ({
      elements: [...state.elements, newDevice],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
    get().showToastMessage('Đã thêm thiết bị');
  },

  // ============ UNIFIED ELEMENT ACTIONS ============
  addElement: (elementData) => {
    const { elements } = get();
    const newElement = {
      ...elementData,
      zIndex: elements.length
    };
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id,
      selectedElementIds: [newElement.id]
    }));
    get().saveState();
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
  },

  updateElementWithHistory: (id, updates) => {
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, ...updates } : el)
    }));
    get().saveState();
  },

  deleteElement: (id) => {
    set((state) => {
      const newSelectedIds = state.selectedElementIds.filter(eid => eid !== id);
      return {
        elements: state.elements.filter(el => el.id !== id),
        selectedElementId: newSelectedIds[0] || null,
        selectedElementIds: newSelectedIds,
        groups: state.groups.map(g => ({
          ...g,
          elementIds: g.elementIds.filter(eid => eid !== id)
        })).filter(g => g.elementIds.length > 1)
      };
    });
    get().saveState();
    get().showToastMessage('Đã xóa phần tử');
  },

  deleteSelectedElements: () => {
    const { selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;
    set((state) => ({
      elements: state.elements.filter(el => !selectedElementIds.includes(el.id)),
      selectedElementId: null,
      selectedElementIds: [],
      groups: state.groups.map(g => ({
        ...g,
        elementIds: g.elementIds.filter(eid => !selectedElementIds.includes(eid))
      })).filter(g => g.elementIds.length > 1)
    }));
    get().saveState();
    get().showToastMessage('Đã xóa phần tử');
  },

  selectElement: (id) => {
    const { editingGroupId } = get();
    const group = get().getGroupForElement(id);
    if (group && editingGroupId === group.id) {
      // Inside this group: select individual element
      set({ selectedElementId: id, selectedElementIds: [id] });
    } else if (group) {
      // Click on grouped element: select whole group
      set({ selectedElementId: id, selectedElementIds: [...group.elementIds], editingGroupId: null });
    } else {
      set({ selectedElementId: id, selectedElementIds: [id], editingGroupId: null });
    }
  },
  enterGroup: (groupId) => {
    set({ editingGroupId: groupId });
  },
  deselectElement: () => set({ selectedElementId: null, selectedElementIds: [], editingGroupId: null }),

  toggleSelectElement: (id) => {
    const { selectedElementIds } = get();
    let newIds;
    if (selectedElementIds.includes(id)) {
      newIds = selectedElementIds.filter(eid => eid !== id);
    } else {
      newIds = [...selectedElementIds, id];
    }
    set({
      selectedElementIds: newIds,
      selectedElementId: newIds[0] || null
    });
  },

  selectAllElements: () => {
    const { elements } = get();
    const allIds = elements.map(el => el.id);
    set({
      selectedElementIds: allIds,
      selectedElementId: allIds[0] || null
    });
  },

  getSelectedElement: () => {
    const { elements, selectedElementId } = get();
    return elements.find(el => el.id === selectedElementId) || null;
  },

  // ============ LAYER MANAGEMENT ============
  bringToFront: (id) => {
    const { elements } = get();
    if (elements.length === 0) return;
    const maxZ = Math.max(...elements.map(el => el.zIndex));
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, zIndex: maxZ + 1 } : el)
    }));
    get().saveState();
  },

  sendToBack: (id) => {
    const { elements } = get();
    if (elements.length === 0) return;
    const minZ = Math.min(...elements.map(el => el.zIndex));
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, zIndex: minZ - 1 } : el)
    }));
    get().saveState();
  },

  moveLayerUp: (id) => {
    const { elements } = get();
    const current = elements.find(el => el.id === id);
    if (!current) return;

    const above = elements
      .filter(el => el.zIndex > current.zIndex)
      .sort((a, b) => a.zIndex - b.zIndex)[0];

    if (above) {
      set((state) => ({
        elements: state.elements.map(el => {
          if (el.id === id) return { ...el, zIndex: above.zIndex };
          if (el.id === above.id) return { ...el, zIndex: current.zIndex };
          return el;
        })
      }));
      get().saveState();
    }
  },

  moveLayerDown: (id) => {
    const { elements } = get();
    const current = elements.find(el => el.id === id);
    if (!current) return;

    const below = elements
      .filter(el => el.zIndex < current.zIndex)
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    if (below) {
      set((state) => ({
        elements: state.elements.map(el => {
          if (el.id === id) return { ...el, zIndex: below.zIndex };
          if (el.id === below.id) return { ...el, zIndex: current.zIndex };
          return el;
        })
      }));
      get().saveState();
    }
  },

  reorderElements: (newElements) => {
    set({ elements: newElements });
    get().saveState();
  },

  // ============ COPY/PASTE ============
  copyElement: () => {
    const { selectedElementIds, elements } = get();
    if (selectedElementIds.length === 0) return;

    if (selectedElementIds.length === 1) {
      const element = elements.find(el => el.id === selectedElementIds[0]);
      if (element) {
        set({ clipboard: JSON.parse(JSON.stringify(element)) });
        get().showToastMessage('Đã sao chép');
      }
    } else {
      const selected = elements.filter(el => selectedElementIds.includes(el.id));
      set({ clipboard: JSON.parse(JSON.stringify(selected)) });
      get().showToastMessage(`Đã sao chép ${selected.length} phần tử`);
    }
  },

  pasteElement: () => {
    const { clipboard, elements } = get();
    if (!clipboard) return;

    const items = Array.isArray(clipboard) ? clipboard : [clipboard];
    const newElements = [];
    const newIds = [];

    items.forEach((item) => {
      const newId = `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      newElements.push({
        ...item,
        id: newId,
        x: item.x + 20,
        y: item.y + 20,
        zIndex: elements.length + newElements.length
      });
      newIds.push(newId);
    });

    set((state) => ({
      elements: [...state.elements, ...newElements],
      selectedElementId: newIds[0],
      selectedElementIds: newIds
    }));
    get().saveState();
    get().showToastMessage('Đã dán');
  },

  // ============ TEXT ELEMENT ACTIONS ============
  addText: () => {
    const id = 'text-' + Date.now();
    const newText = {
      id,
      type: 'text',
      content: 'Văn bản mới',
      font: 'Instrument Sans',
      size: 48,
      color: '#FFFFFF',
      weight: '600',
      textAlign: 'center',
      letterSpacing: 0,
      shadow: { enabled: false, color: '#000000', blur: 4, offsetX: 2, offsetY: 2 },
      outline: { enabled: false, color: '#000000', width: 1 },
      textDecoration: 'none',
      textTransform: 'none',
      wordSpacing: 0,
      maxWidth: 0,
      gradient: { enabled: false, start: '#5C6AC4', end: '#202E78', angle: 135 },
      glow: { enabled: false, color: '#5C6AC4', blur: 10, intensity: 2 },
      rotation: 0,
      x: 800,
      y: 100,
      zIndex: get().elements.length
    };

    set((state) => ({
      elements: [...state.elements, newText],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
  },

  updateText: (id, updates) => {
    get().updateElement(id, updates);
  },

  deleteText: (id) => {
    get().deleteElement(id);
  },

  selectText: (id) => get().selectElement(id),
  deselectText: () => get().deselectElement(),

  // ============ SHAPE ELEMENT ACTIONS ============
  addShape: (shapeType) => {
    const id = 'shape-' + Date.now();
    const sizeDefaults = {
      rectangle: { width: 200, height: 100, borderRadius: 8 },
      circle: { width: 100, height: 100 },
      triangle: { width: 140, height: 120 },
      star: { width: 120, height: 120, starPoints: 5, starInnerRadius: 0.4 },
      pentagon: { width: 120, height: 120 },
      hexagon: { width: 130, height: 120 },
      diamond: { width: 100, height: 140 },
      line: { width: 200, height: 4, strokeWidth: 2, fill: '#FFFFFF' },
      callout: { width: 200, height: 120, pointerPosition: 'bottom-center' },
      heart: { width: 120, height: 110 },
      cross: { width: 100, height: 100, crossThickness: 0.33 },
      arrow: { width: 160, height: 80, arrowStyle: 'solid', arrowHead: 'end', arrowHeadStyle: 'classic', curvature: 0 },
      badge: { width: 60, height: 60, text: '1' }
    };

    const newShape = {
      id,
      type: 'shape',
      shapeType,
      x: 800,
      y: 450,
      fill: '#5C6AC4',
      fillType: 'solid',
      fillGradientStart: '#5C6AC4',
      fillGradientEnd: '#202E78',
      fillGradientAngle: 135,
      fillGradientType: 'linear',
      stroke: '#FFFFFF',
      strokeWidth: 0,
      strokeStyle: 'solid',
      opacity: 1,
      rotation: 0,
      shadow: { enabled: false, color: '#00000066', blur: 10, offsetX: 0, offsetY: 4 },
      flipH: false,
      flipV: false,
      shapeText: '',
      shapeTextColor: '#FFFFFF',
      shapeTextSize: 16,
      zIndex: get().elements.length,
      ...sizeDefaults[shapeType]
    };

    set((state) => ({
      elements: [...state.elements, newShape],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
    get().showToastMessage('Đã thêm hình dạng');
  },

  // ============ IMAGE OVERLAY ACTIONS ============
  addImageOverlay: (src, width = 200, height = 200) => {
    const id = 'image-' + Date.now();
    const newImage = {
      id,
      type: 'image',
      src,
      x: 800,
      y: 450,
      width,
      height,
      opacity: 1,
      rotation: 0,
      zIndex: get().elements.length
    };

    set((state) => ({
      elements: [...state.elements, newImage],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
    get().showToastMessage('Đã thêm hình ảnh');
  },

  // ============ ANNOTATION ACTIONS ============
  addAnnotation: (annotationType) => {
    const id = 'annotation-' + Date.now();
    const defaults = {
      callout: { width: 200, height: 80, text: 'Callout', pointerPosition: 'bottom' },
      'numbered-circle': { size: 40, number: 1 },
      highlight: { width: 200, height: 100 }
    };

    const newAnnotation = {
      id,
      type: 'annotation',
      annotationType,
      x: 800,
      y: 450,
      fill: '#5C6AC4',
      textColor: '#FFFFFF',
      opacity: 1,
      rotation: 0,
      zIndex: get().elements.length,
      ...defaults[annotationType]
    };

    set((state) => ({
      elements: [...state.elements, newAnnotation],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
    get().showToastMessage('Đã thêm chú thích');
  },

  // ============ ICON ELEMENT ACTIONS ============
  addIcon: (iconData) => {
    const id = 'icon-' + Date.now();
    const newIcon = {
      id,
      type: 'icon',
      iconId: iconData.id,
      svg: iconData.svg,
      name: iconData.name,
      x: 800,
      y: 450,
      width: 64,
      height: 64,
      color: '#FFFFFF',
      opacity: 1,
      rotation: 0,
      zIndex: get().elements.length
    };

    set((state) => ({
      elements: [...state.elements, newIcon],
      selectedElementId: id,
      selectedElementIds: [id]
    }));
    get().saveState();
    get().showToastMessage('Đã thêm biểu tượng');
  },

  // ============ GROUP ACTIONS ============
  groupElements: (elementIds) => {
    if (!elementIds || elementIds.length < 2) return;
    const groupId = 'group-' + Date.now();
    set((state) => ({
      groups: [...state.groups, { id: groupId, elementIds, name: `Nhóm ${state.groups.length + 1}` }]
    }));
    get().saveState();
    get().showToastMessage('Đã nhóm phần tử');
  },

  ungroupElements: (groupId) => {
    set((state) => ({
      groups: state.groups.filter(g => g.id !== groupId)
    }));
    get().saveState();
    get().showToastMessage('Đã bỏ nhóm');
  },

  getGroupForElement: (elementId) => {
    const { groups } = get();
    return groups.find(g => g.elementIds.includes(elementId)) || null;
  },

  getGroupMembers: (elementId) => {
    const { groups, elements } = get();
    const group = groups.find(g => g.elementIds.includes(elementId));
    if (!group) return [];
    return elements.filter(el => group.elementIds.includes(el.id));
  },

  // ============ ALIGN / DISTRIBUTE ============
  alignElements: (direction) => {
    const { elements, selectedElementIds } = get();
    const targetIds = selectedElementIds.length >= 2 ? selectedElementIds : elements.map(el => el.id);
    const targets = elements.filter(el => targetIds.includes(el.id));
    if (targets.length < 2) return;

    const updated = elements.map(el => {
      if (!targetIds.includes(el.id)) return el;
      const clone = { ...el };
      switch (direction) {
        case 'left': {
          const minX = Math.min(...targets.map(t => t.x));
          clone.x = minX;
          break;
        }
        case 'center': {
          const avgX = targets.reduce((sum, t) => sum + t.x + (t.width || 100) / 2, 0) / targets.length;
          clone.x = avgX - (el.width || 100) / 2;
          break;
        }
        case 'right': {
          const maxRight = Math.max(...targets.map(t => t.x + (t.width || 100)));
          clone.x = maxRight - (el.width || 100);
          break;
        }
        case 'top': {
          const minY = Math.min(...targets.map(t => t.y));
          clone.y = minY;
          break;
        }
        case 'middle': {
          const avgY = targets.reduce((sum, t) => sum + t.y + (t.height || 50) / 2, 0) / targets.length;
          clone.y = avgY - (el.height || 50) / 2;
          break;
        }
        case 'bottom': {
          const maxBottom = Math.max(...targets.map(t => t.y + (t.height || 50)));
          clone.y = maxBottom - (el.height || 50);
          break;
        }
      }
      return clone;
    });

    set({ elements: updated });
    get().saveState();
    get().showToastMessage('Đã căn chỉnh');
  },

  distributeElements: (direction) => {
    const { elements, selectedElementIds } = get();
    const targetIds = selectedElementIds.length >= 3 ? selectedElementIds : elements.map(el => el.id);
    const targets = elements.filter(el => targetIds.includes(el.id));
    if (targets.length < 3) return;

    const sorted = [...targets].sort((a, b) =>
      direction === 'horizontal' ? a.x - b.x : a.y - b.y
    );

    const positionMap = {};
    if (direction === 'horizontal') {
      const first = sorted[0].x;
      const last = sorted[sorted.length - 1].x;
      const step = (last - first) / (sorted.length - 1);
      sorted.forEach((el, i) => { positionMap[el.id] = { x: first + step * i }; });
    } else {
      const first = sorted[0].y;
      const last = sorted[sorted.length - 1].y;
      const step = (last - first) / (sorted.length - 1);
      sorted.forEach((el, i) => { positionMap[el.id] = { y: first + step * i }; });
    }

    const updated = elements.map(el => {
      if (positionMap[el.id]) {
        return { ...el, ...positionMap[el.id] };
      }
      return el;
    });

    set({ elements: updated });
    get().saveState();
    get().showToastMessage('Đã phân bố đều');
  },

  // ============ GRID ============
  setShowGrid: (show) => set({ showGrid: show }),

  // ============ RECENT COLORS ============
  addRecentColor: (color) => {
    set((state) => {
      const filtered = state.recentColors.filter(c => c !== color);
      return { recentColors: [color, ...filtered].slice(0, 8) };
    });
  },

  // ============ RULERS & GUIDES ============
  setShowRulers: (show) => set({ showRulers: show }),
  setShowGuides: (show) => set({ showGuides: show }),
  setSnapToGuides: (snap) => set({ snapToGuides: snap }),

  addGuide: (orientation, position) => {
    const id = 'guide-' + Date.now();
    set((state) => ({
      guides: [...state.guides, { id, orientation, position }]
    }));
  },

  removeGuide: (id) => {
    set((state) => ({
      guides: state.guides.filter(g => g.id !== id)
    }));
  },

  clearGuides: () => set({ guides: [] }),

  // ============ SAVE / LOAD PROJECT ============
  saveProject: () => {
    const { background, screenshot, elements, groups, guides } = get();
    const projectData = JSON.stringify({
      version: 1,
      background,

      screenshot,
      elements,
      groups,
      guides,
      savedAt: new Date().toISOString()
    });

    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'screenshot-project.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    get().showToastMessage('Đã lưu dự án');
  },

  loadProject: (json) => {
    try {
      const data = JSON.parse(json);
      set({
        background: data.background || get().background,

        screenshot: data.screenshot || null,
        elements: data.elements || [],
        groups: data.groups || [],
        guides: data.guides || [],
        selectedElementId: null,
        selectedElementIds: [],
        history: [],
        historyIndex: -1
      });
      get().saveState();
      get().showToastMessage('Đã tải dự án');
    } catch {
      get().showToastMessage('Lỗi: File không hợp lệ');
    }
  },

  // ============ AUTO-SAVE ============
  setEnableAutoSave: (enabled) => set({ enableAutoSave: enabled }),

  autoSave: () => {
    const { enableAutoSave, background, screenshot, elements, groups, guides } = get();
    if (!enableAutoSave) return;
    try {
      const data = JSON.stringify({ background, screenshot, elements, groups, guides });
      localStorage.setItem(AUTO_SAVE_KEY, data);
    } catch {
      // localStorage full or unavailable
    }
  },

  loadAutoSave: () => {
    try {
      const data = localStorage.getItem(AUTO_SAVE_KEY);
      if (!data) return false;
      const parsed = JSON.parse(data);
      set({
        background: parsed.background || get().background,

        screenshot: parsed.screenshot || null,
        elements: parsed.elements || [],
        groups: parsed.groups || [],
        guides: parsed.guides || [],
        selectedElementId: null,
        selectedElementIds: []
      });
      return true;
    } catch {
      return false;
    }
  },

  clearAutoSave: () => {
    localStorage.removeItem(AUTO_SAVE_KEY);
  },

  // ============ HISTORY ============
  saveState: () => {
    const { background, screenshot, elements, groups, history, historyIndex } = get();
    const stateCopy = JSON.parse(JSON.stringify({ background, screenshot, elements, groups }));

    let newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(stateCopy);

    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });

    // Auto-save after each state change
    get().autoSave();
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const savedState = history[newIndex];
      set({
        ...savedState,
        historyIndex: newIndex,
        selectedElementId: null,
        selectedElementIds: []
      });
      get().showToastMessage('Hoàn tác');
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const savedState = history[newIndex];
      set({
        ...savedState,
        historyIndex: newIndex,
        selectedElementId: null,
        selectedElementIds: []
      });
      get().showToastMessage('Làm lại');
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // ============ MODAL ============
  setShowExportModal: (show) => set({ showExportModal: show }),

  // ============ SIDEBAR TOGGLE ============
  togglePropertiesSidebar: () => set((state) => ({ showPropertiesSidebar: !state.showPropertiesSidebar })),
  setShowPropertiesSidebar: (show) => set({ showPropertiesSidebar: show }),
  toggleTemplateSidebar: () => set((state) => ({ showTemplateSidebar: !state.showTemplateSidebar })),
  setShowTemplateSidebar: (show) => set({ showTemplateSidebar: show }),

  // ============ ACTIVE TOOL ============
  setActiveTool: (tool) => set((state) => ({
    activeTool: state.activeTool === tool ? null : tool
  })),

  // ============ SHORTCUTS MODAL ============
  setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),

  // ============ DUPLICATE ============
  duplicateElement: () => {
    const { selectedElementIds, elements } = get();
    if (selectedElementIds.length === 0) return;

    const newElements = [];
    const newIds = [];
    selectedElementIds.forEach((selId) => {
      const element = elements.find(el => el.id === selId);
      if (!element) return;
      const newId = `${element.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      newElements.push({
        ...JSON.parse(JSON.stringify(element)),
        id: newId,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length + newElements.length
      });
      newIds.push(newId);
    });

    if (newElements.length === 0) return;
    set((state) => ({
      elements: [...state.elements, ...newElements],
      selectedElementId: newIds[0],
      selectedElementIds: newIds
    }));
    get().saveState();
    get().showToastMessage('Đã nhân đôi');
  },

  // ============ NUDGE ============
  nudgeElement: (direction, amount) => {
    const { selectedElementIds } = get();
    if (selectedElementIds.length === 0) return;

    const updates = {};
    switch (direction) {
      case 'left': updates.x = -amount; break;
      case 'right': updates.x = amount; break;
      case 'up': updates.y = -amount; break;
      case 'down': updates.y = amount; break;
    }

    set((state) => ({
      elements: state.elements.map(el => {
        if (!selectedElementIds.includes(el.id)) return el;
        if (el.locked) return el;
        return {
          ...el,
          x: el.x + (updates.x || 0),
          y: el.y + (updates.y || 0)
        };
      })
    }));
    get().saveState();
  },

  // ============ LOCK/UNLOCK ============
  toggleElementLock: (id) => {
    const { elements } = get();
    const element = elements.find(el => el.id === id);
    if (!element) return;
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, locked: !el.locked } : el)
    }));
    get().saveState();
    get().showToastMessage(element.locked ? 'Đã mở khóa' : 'Đã khóa');
  },

  // ============ VISIBILITY ============
  toggleElementVisibility: (id) => {
    const { elements } = get();
    const element = elements.find(el => el.id === id);
    if (!element) return;
    const newVisible = element.visible === false ? true : false;
    set((state) => ({
      elements: state.elements.map(el => el.id === id ? { ...el, visible: newVisible } : el)
    }));
    get().saveState();
    get().showToastMessage(newVisible ? 'Đã hiện' : 'Đã ẩn');
  },

  // ============ TEMPLATE ============
  applyTemplate: (template) => {
    set({
      background: template.background,
      elements: template.elements.map((el, i) => ({ ...el, zIndex: i })),
      selectedElementId: null,
      selectedElementIds: [],
      history: [],
      historyIndex: -1
    });
    get().saveState();
    get().showToastMessage('Đã áp dụng mẫu');
  },

  // ============ RESET PROJECT ============
  resetProject: () => {
    set({
      background: {
        type: 'gradient',
        color: '#5C6AC4',
        gradientStart: '#5C6AC4',
        gradientEnd: '#202E78',
        gradientAngle: 135,
        gradientType: 'linear',
        radialPosition: 'center',
        image: null,
        blur: 0
      },
      elements: [],
      selectedElementId: null,
      selectedElementIds: [],
      clipboard: null,
      groups: [],
      editingGroupId: null,
      history: [],
      historyIndex: -1,
      guides: [],
    });
    get().saveState();
    get().showToastMessage('Đã tạo dự án mới');
  },

  // ============ TOAST ============
  showToastMessage: (messageOrObj) => {
    const toast = typeof messageOrObj === 'string'
      ? { message: messageOrObj, type: 'info' }
      : { type: 'info', ...messageOrObj };
    set({ toast });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null })
}));

export default useEditorStore;
