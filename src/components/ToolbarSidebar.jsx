import useEditorStore from '../store/editorStore';

const tools = [
  {
    id: 'select',
    label: 'Chọn',
    group: 'select',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      </svg>
    ),
  },
  { id: '_divider_1', divider: true },
  {
    id: 'text',
    label: 'Văn bản',
    group: 'content',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    ),
  },
  {
    id: 'shape',
    label: 'Hình',
    group: 'content',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="14" rx="2" />
      </svg>
    ),
  },
  {
    id: 'device',
    label: 'Thiết bị',
    group: 'content',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: 'image',
    label: 'Hình ảnh',
    group: 'content',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  { id: '_divider_2', divider: true },
  {
    id: 'annotation',
    label: 'Chú thích',
    group: 'utility',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="12" rx="2" />
        <path d="M8 15l4 6 4-6" />
      </svg>
    ),
  },
  {
    id: 'icon',
    label: 'Icon',
    group: 'utility',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
      </svg>
    ),
  },
  { id: '_divider_3', divider: true },
  {
    id: 'templates',
    label: 'Mẫu',
    group: 'templates',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
];

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function ToolbarSidebar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const deselectElement = useEditorStore((s) => s.deselectElement);
  const setShowShortcutsModal = useEditorStore((s) => s.setShowShortcutsModal);

  const handleClick = (toolId) => {
    if (toolId === 'select') {
      deselectElement();
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  return (
    <aside className="toolbar-sidebar">
      <div className="toolbar-sidebar__tools">
        {tools.map((tool) =>
          tool.divider ? (
            <div key={tool.id} className="toolbar-sidebar__divider" />
          ) : (
            <button
              key={tool.id}
              className={`toolbar-sidebar__btn ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleClick(tool.id)}
            >
              {tool.icon}
              <span className="toolbar-sidebar__tooltip">{tool.label}</span>
            </button>
          )
        )}
      </div>
      <div className="toolbar-sidebar__bottom">
        <div className="toolbar-sidebar__divider" />
        <button
          className="toolbar-sidebar__btn"
          onClick={() => setShowShortcutsModal(true)}
        >
          <HelpIcon />
          <span className="toolbar-sidebar__tooltip">Trợ giúp</span>
        </button>
      </div>
    </aside>
  );
}
