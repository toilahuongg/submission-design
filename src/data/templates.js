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
  },
  {
    id: 'feature-showcase',
    name: 'Feature Showcase',
    thumbnail: '#667eea',
    background: {
      type: 'gradient',
      gradientStart: '#667eea',
      gradientEnd: '#764ba2',
      gradientAngle: 135,
      gradientType: 'linear',
      color: '#667eea'
    },
    elements: [
      {
        id: 'fs-device',
        type: 'device',
        deviceType: 'browser',
        scale: 60,
        shadow: 40,
        x: 800,
        y: 300,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'fs-title',
        type: 'text',
        content: 'Powerful Features\nfor Your Store',
        x: 800,
        y: 60,
        size: 52,
        weight: '700',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'fs-feat1',
        type: 'text',
        content: 'Real-time Analytics',
        x: 160,
        y: 780,
        size: 20,
        weight: '600',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'fs-feat2',
        type: 'text',
        content: 'Smart Automation',
        x: 800,
        y: 780,
        size: 20,
        weight: '600',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'fs-feat3',
        type: 'text',
        content: 'One-Click Setup',
        x: 1440,
        y: 780,
        size: 20,
        weight: '600',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      }
    ]
  },
  {
    id: 'before-after',
    name: 'Before / After',
    thumbnail: '#1a1a2e',
    background: {
      type: 'gradient',
      gradientStart: '#1a1a2e',
      gradientEnd: '#16213e',
      gradientAngle: 180,
      gradientType: 'linear',
      color: '#1a1a2e'
    },
    elements: [
      {
        id: 'ba-title',
        type: 'text',
        content: 'Before & After',
        x: 800,
        y: 50,
        size: 42,
        weight: '700',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'ba-device1',
        type: 'device',
        deviceType: 'browser',
        scale: 50,
        shadow: 30,
        x: 250,
        y: 350,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'ba-device2',
        type: 'device',
        deviceType: 'browser',
        scale: 50,
        shadow: 30,
        x: 1000,
        y: 350,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'ba-label1',
        type: 'text',
        content: 'BEFORE',
        x: 400,
        y: 140,
        size: 18,
        weight: '600',
        color: '#ff6b6b',
        font: 'Instrument Sans',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 5
      },
      {
        id: 'ba-label2',
        type: 'text',
        content: 'AFTER',
        x: 1150,
        y: 140,
        size: 18,
        weight: '600',
        color: '#51cf66',
        font: 'Instrument Sans',
        textAlign: 'center',
        letterSpacing: 3,
        zIndex: 5
      },
      {
        id: 'ba-arrow',
        type: 'shape',
        shapeType: 'arrow',
        x: 700,
        y: 400,
        width: 200,
        height: 60,
        fill: '#FFFFFF',
        strokeWidth: 3,
        opacity: 0.8,
        arrowStyle: 'solid',
        arrowHead: 'end',
        arrowHeadStyle: 'classic',
        zIndex: 3
      }
    ]
  },
  {
    id: 'app-overview',
    name: 'App Overview',
    thumbnail: '#008060',
    background: {
      type: 'gradient',
      gradientStart: '#008060',
      gradientEnd: '#004d3a',
      gradientAngle: 135,
      gradientType: 'linear',
      color: '#008060'
    },
    elements: [
      {
        id: 'ao-title',
        type: 'text',
        content: 'Your App Name',
        x: 800,
        y: 80,
        size: 56,
        weight: '700',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'ao-subtitle',
        type: 'text',
        content: 'The all-in-one solution for your Shopify store',
        x: 800,
        y: 170,
        size: 22,
        weight: '400',
        color: 'rgba(255,255,255,0.8)',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'ao-device',
        type: 'device',
        deviceType: 'browser',
        scale: 65,
        shadow: 50,
        x: 800,
        y: 420,
        rotation: 0,
        zIndex: 1
      },
      {
        id: 'ao-badge1',
        type: 'shape',
        shapeType: 'badge',
        x: 100,
        y: 750,
        width: 40,
        height: 40,
        fill: '#FFFFFF',
        strokeWidth: 0,
        opacity: 1,
        text: '5★',
        zIndex: 3
      },
      {
        id: 'ao-rating',
        type: 'text',
        content: '500+ Five Star Reviews',
        x: 250,
        y: 758,
        size: 18,
        weight: '600',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'left',
        zIndex: 5
      }
    ]
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    thumbnail: '#111111',
    background: {
      type: 'solid',
      color: '#111111'
    },
    elements: [
      {
        id: 'md-title',
        type: 'text',
        content: 'Simple. Powerful.',
        x: 800,
        y: 120,
        size: 64,
        weight: '700',
        color: '#FFFFFF',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'md-subtitle',
        type: 'text',
        content: 'Everything you need, nothing you don\'t.',
        x: 800,
        y: 220,
        size: 22,
        weight: '400',
        color: '#888888',
        font: 'Instrument Sans',
        textAlign: 'center',
        zIndex: 5
      },
      {
        id: 'md-device',
        type: 'device',
        deviceType: 'browser',
        scale: 70,
        shadow: 30,
        x: 800,
        y: 450,
        rotation: 0,
        zIndex: 1
      }
    ]
  }
];

export default TEMPLATES;
