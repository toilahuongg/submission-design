const TEMPLATES = [
  {
    id: 'tagging-solution',
    name: 'Giải pháp Tagging',
    thumbnail: '#6B46C1',
    background: {
      type: 'gradient',
      gradientType: 'radial',
      gradientStart: '#FFFFFF',
      gradientEnd: '#F5F5F5',
      radialPosition: 'center'
    },
    elements: [
      // App Icon (purple rounded square with tag)
      {
        id: 'app-icon-bg',
        type: 'shape',
        shapeType: 'rectangle',
        x: 596,
        y: 55,
        width: 48,
        height: 48,
        fill: '#6B46C1',
        borderRadius: 12,
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'app-icon',
        type: 'icon',
        iconId: 'tag',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
        name: 'Tag',
        x: 608,
        y: 67,
        width: 24,
        height: 24,
        color: '#FFFFFF'
      },
      // Header text
      {
        id: 'header-text',
        type: 'text',
        content: 'SO: Auto Tags | ALL-in-One',
        x: 654,
        y: 62,
        size: 26,
        weight: '700',
        italic: true,
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'left'
      },
      // Main Title
      {
        id: 'main-title',
        type: 'text',
        content: 'ALL-IN-ONE TAGGING SOLUTION',
        x: 335,
        y: 135,
        size: 56,
        weight: '900',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'left',
        letterSpacing: 1
      },
      // ========== Feature 1: All In One Tagging ==========
      {
        id: 'feat-1-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 96,
        y: 285,
        width: 150,
        height: 150,
        fill: '#6B46C1',
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'feat-1-icon',
        type: 'icon',
        iconId: 'tag-arrow',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/><path d="M9 11l4 4m0-4l-4 4"/></svg>',
        name: 'Tag Arrow',
        x: 121,
        y: 310,
        width: 100,
        height: 100,
        color: '#FFFFFF'
      },
      {
        id: 'feat-1-title',
        type: 'text',
        content: 'All In One\nTagging',
        x: 95,
        y: 470,
        size: 26,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      {
        id: 'feat-1-desc',
        type: 'text',
        content: 'Automate tagging\norders, customers\n& products.',
        x: 70,
        y: 570,
        size: 18,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      // ========== Feature 2: Auto Triggers ==========
      {
        id: 'feat-2-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 381,
        y: 285,
        width: 150,
        height: 150,
        fill: '#6B46C1',
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'feat-2-icon',
        type: 'icon',
        iconId: 'zap',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>',
        name: 'Zap',
        x: 406,
        y: 310,
        width: 100,
        height: 100,
        color: '#FFFFFF'
      },
      {
        id: 'feat-2-title',
        type: 'text',
        content: 'Auto Triggers',
        x: 378,
        y: 470,
        size: 26,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      {
        id: 'feat-2-desc',
        type: 'text',
        content: 'Set real-time\nevent workflows.',
        x: 378,
        y: 545,
        size: 18,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      // ========== Feature 3: Reprocess ==========
      {
        id: 'feat-3-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 666,
        y: 285,
        width: 150,
        height: 150,
        fill: '#6B46C1',
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'feat-3-icon',
        type: 'icon',
        iconId: 'refresh',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
        name: 'Refresh',
        x: 691,
        y: 310,
        width: 100,
        height: 100,
        color: '#FFFFFF'
      },
      {
        id: 'feat-3-title',
        type: 'text',
        content: 'Reprocess',
        x: 680,
        y: 470,
        size: 26,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      {
        id: 'feat-3-desc',
        type: 'text',
        content: 'Run on existing\nentries.',
        x: 680,
        y: 545,
        size: 18,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      // ========== Feature 4: Schedule Workflows ==========
      {
        id: 'feat-4-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 951,
        y: 285,
        width: 150,
        height: 150,
        fill: '#6B46C1',
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'feat-4-icon',
        type: 'icon',
        iconId: 'clock',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        name: 'Clock',
        x: 976,
        y: 310,
        width: 100,
        height: 100,
        color: '#FFFFFF'
      },
      {
        id: 'feat-4-title',
        type: 'text',
        content: 'Schedule\nWorkflows',
        x: 960,
        y: 470,
        size: 26,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      {
        id: 'feat-4-desc',
        type: 'text',
        content: 'Daily, weekly,\nmonthly runs.',
        x: 968,
        y: 570,
        size: 18,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      // ========== Feature 5: Workflow Library ==========
      {
        id: 'feat-5-circle',
        type: 'shape',
        shapeType: 'circle',
        x: 1236,
        y: 285,
        width: 150,
        height: 150,
        fill: '#6B46C1',
        strokeWidth: 0,
        opacity: 1
      },
      {
        id: 'feat-5-icon',
        type: 'icon',
        iconId: 'folder',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>',
        name: 'Folder',
        x: 1261,
        y: 310,
        width: 100,
        height: 100,
        color: '#FFFFFF'
      },
      {
        id: 'feat-5-title',
        type: 'text',
        content: 'Workflow\nLibrary',
        x: 1258,
        y: 470,
        size: 26,
        weight: '700',
        color: '#1a1a1a',
        font: 'Instrument Sans',
        textAlign: 'center'
      },
      {
        id: 'feat-5-desc',
        type: 'text',
        content: 'Access pre-built\ntemplates.',
        x: 1253,
        y: 570,
        size: 18,
        weight: '400',
        color: '#4b5563',
        font: 'Instrument Sans',
        textAlign: 'center'
      }
    ]
  }
];

export default TEMPLATES;
