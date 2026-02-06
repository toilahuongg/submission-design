import useEditorStore from '../store/editorStore';
import TEMPLATES from '../data/templates';

export default function TemplateSidebar() {
  const { showTemplateSidebar, toggleTemplateSidebar, applyTemplate } = useEditorStore();

  if (!showTemplateSidebar) return null;

  return (
    <aside className="sidebar sidebar--left template-sidebar">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Mẫu thiết kế</h2>
        <button className="btn btn--ghost btn--sm" onClick={toggleTemplateSidebar} title="Đóng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="sidebar__content">
        <div className="template-grid">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              className="template-card"
              onClick={() => {
                applyTemplate(template);
                toggleTemplateSidebar();
              }}
            >
              <div
                className="template-card__preview"
                style={{ background: template.thumbnail }}
              >
                <span className="template-card__label">{template.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
