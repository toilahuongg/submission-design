import useEditorStore from '../store/editorStore';

const tools = [
  {
    id: 'select',
    label: 'Chọn',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      </svg>
    ),
    action: (state) => state.deselectElement(),
  },
  {
    id: 'text',
    label: 'Văn bản',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    ),
    action: (state) => state.addText(),
  },
  {
    id: 'shape',
    label: 'Hình',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    ),
    action: (state) => state.addShape('rectangle'),
  },
  {
    id: 'device',
    label: 'Thiết bị',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    action: (state) => state.addDevice('browser'),
  },
  {
    id: 'annotation',
    label: 'Chú thích',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="12" rx="2" />
        <path d="M8 15l4 6 4-6" />
      </svg>
    ),
    action: (state) => state.addAnnotation('callout'),
  },
  {
    id: 'icon',
    label: 'Icon',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
      </svg>
    ),
    action: (state) => state.addIcon(state.builtInIcons[0]),
  },
  {
    id: 'templates',
    label: 'Mẫu',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    action: (state) => state.toggleTemplateSidebar(),
  },
];

export default function ToolbarSidebar() {
  return (
    <aside className="toolbar-sidebar">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className="toolbar-sidebar__btn"
          onClick={() => tool.action(useEditorStore.getState())}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
    </aside>
  );
}
