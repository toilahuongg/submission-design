// Canvas: 1600x900
// 5 feature columns - centers at: 160, 480, 800, 1120, 1440

const TEMPLATES = [
  {
    id: 'tagging-solution',
    name: 'Tagging Solution',
    thumbnail: '#6B2D7B',
    background: {
      type: 'solid',
      color: '#FFFFFF'
    },
    elements: [
      // ===== HEADER SECTION =====
      // App Icon background (centered header)
      {
        id: 'app-icon-bg',
        type: 'shape',
        shapeType: 'rectangle',
        x: 590,
        y: 60,
        width: 44,
        height: 44,
        fill: '#6B2D7B',
        borderRadius: 10,
        strokeWidth: 0,
        opacity: 1,
        zIndex: 1
      },
      {
        id: 'app-icon',
        type: 'icon',
        iconId: 'tag',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
        name: 'Tag',
        x: 600,
        y: 70,
        width: 24,
        height: 24,
        color: '#FFFFFF',
        zIndex: 2
      },
      {
        id: 'header-text',
        type: 'text',
        content: 'SO: Auto Tags | ALL-in-One',
        x: 644,
        y: 68,
        size: 22,
        weight: '700',
        italic: true,
        color: '#6B2D7B',
        font: 'Instrument Sans',
        textAlign: 'left',
        zIndex: 3
      },
      // Main Title (centered)
      {
        id: 'main-title',
        type: 'text',
        content: 'ALL-IN-ONE TAGGING SOLUTION',
        x: 800,
        y: 150,
        size: 48,
        weight: '900',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        letterSpacing: 1,
        zIndex: 3
      },

      // ===== FEATURE 1: All In One Tagging (center: 160) =====
      {
        id: 'feat-1-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 85,
        y: 280,
        width: 150,
        height: 150,
        fill: '#6B2D7B',
        strokeWidth: 0,
        opacity: 1,
        zIndex: 10
      },
      {
        id: 'feat-1-icon',
        type: 'icon',
        iconId: 'tag-arrow',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/><path d="m14 7 3 3m0-3-3 3"/></svg>',
        name: 'Tag Arrow',
        x: 110,
        y: 305,
        width: 100,
        height: 100,
        color: '#FFFFFF',
        zIndex: 11
      },
      {
        id: 'feat-1-title',
        type: 'text',
        content: 'All In One\nTagging',
        x: 160,
        y: 470,
        size: 24,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },
      {
        id: 'feat-1-desc',
        type: 'text',
        content: 'Automate tagging\norders, customers\n& products.',
        x: 160,
        y: 560,
        size: 16,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },

      // ===== FEATURE 2: Auto Triggers (center: 480) =====
      {
        id: 'feat-2-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 405,
        y: 280,
        width: 150,
        height: 150,
        fill: '#6B2D7B',
        strokeWidth: 0,
        opacity: 1,
        zIndex: 10
      },
      {
        id: 'feat-2-icon',
        type: 'icon',
        iconId: 'zap',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>',
        name: 'Zap',
        x: 430,
        y: 305,
        width: 100,
        height: 100,
        color: '#FFFFFF',
        zIndex: 11
      },
      {
        id: 'feat-2-title',
        type: 'text',
        content: 'Auto Triggers',
        x: 480,
        y: 470,
        size: 24,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },
      {
        id: 'feat-2-desc',
        type: 'text',
        content: 'Set real-time\nevent workflows.',
        x: 480,
        y: 560,
        size: 16,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },

      // ===== FEATURE 3: Reprocess (center: 800) =====
      {
        id: 'feat-3-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 725,
        y: 280,
        width: 150,
        height: 150,
        fill: '#6B2D7B',
        strokeWidth: 0,
        opacity: 1,
        zIndex: 10
      },
      {
        id: 'feat-3-icon',
        type: 'icon',
        iconId: 'refresh',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
        name: 'Refresh',
        x: 750,
        y: 305,
        width: 100,
        height: 100,
        color: '#FFFFFF',
        zIndex: 11
      },
      {
        id: 'feat-3-title',
        type: 'text',
        content: 'Reprocess',
        x: 800,
        y: 470,
        size: 24,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },
      {
        id: 'feat-3-desc',
        type: 'text',
        content: 'Run on existing\nentries.',
        x: 800,
        y: 560,
        size: 16,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },

      // ===== FEATURE 4: Schedule Workflows (center: 1120) =====
      {
        id: 'feat-4-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 1045,
        y: 280,
        width: 150,
        height: 150,
        fill: '#6B2D7B',
        strokeWidth: 0,
        opacity: 1,
        zIndex: 10
      },
      {
        id: 'feat-4-icon',
        type: 'icon',
        iconId: 'clock',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        name: 'Clock',
        x: 1070,
        y: 305,
        width: 100,
        height: 100,
        color: '#FFFFFF',
        zIndex: 11
      },
      {
        id: 'feat-4-title',
        type: 'text',
        content: 'Schedule\nWorkflows',
        x: 1120,
        y: 470,
        size: 24,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },
      {
        id: 'feat-4-desc',
        type: 'text',
        content: 'Daily, weekly,\nmonthly runs.',
        x: 1120,
        y: 560,
        size: 16,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },

      // ===== FEATURE 5: Workflow Library (center: 1440) =====
      {
        id: 'feat-5-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 1365,
        y: 280,
        width: 150,
        height: 150,
        fill: '#6B2D7B',
        strokeWidth: 0,
        opacity: 1,
        zIndex: 10
      },
      {
        id: 'feat-5-icon',
        type: 'icon',
        iconId: 'folder',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M8 18h5"/></svg>',
        name: 'Folder',
        x: 1390,
        y: 305,
        width: 100,
        height: 100,
        color: '#FFFFFF',
        zIndex: 11
      },
      {
        id: 'feat-5-title',
        type: 'text',
        content: 'Workflow\nLibrary',
        x: 1440,
        y: 470,
        size: 24,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      },
      {
        id: 'feat-5-desc',
        type: 'text',
        content: 'Access pre-built\ntemplates.',
        x: 1440,
        y: 560,
        size: 16,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 12
      }
    ]
  }
];

export default TEMPLATES;
