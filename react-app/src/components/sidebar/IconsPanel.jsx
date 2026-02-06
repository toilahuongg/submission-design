import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function IconsPanel() {
  const {
    builtInIcons, elements, selectedElementId,
    addIcon, updateElement, deleteElement, selectElement, saveState
  } = useEditorStore();

  const icons = elements.filter(el => el.type === 'icon');
  const selectedIcon = icons.find(i => i.id === selectedElementId);

  return (
    <Panel title="Biểu tượng" id="iconsPanel" defaultOpen={false}>
      <div className="icons-grid">
        {builtInIcons.map((icon) => (
          <button key={icon.id} className="icon-item" onClick={() => addIcon(icon)} title={icon.name}>
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
          </button>
        ))}
      </div>

      {icons.length > 0 && (
        <div className="element-list" style={{ marginTop: 8 }}>
          {icons.map((icon) => (
            <div key={icon.id} className={`element-item ${icon.id === selectedElementId ? 'active' : ''}`} onClick={() => selectElement(icon.id)}>
              <div className="element-item__icon" dangerouslySetInnerHTML={{ __html: icon.svg }} />
              <span className="element-item__name">{icon.name}</span>
            </div>
          ))}
        </div>
      )}

      {selectedIcon && (
        <div className="icon-properties" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label className="form-label">Màu</label>
            <div className="color-picker">
              <input type="color" value={selectedIcon.color} onChange={(e) => updateElement(selectedElementId, { color: e.target.value })} />
              <input type="text" className="form-input color-input" value={selectedIcon.color} onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateElement(selectedElementId, { color: e.target.value }); }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Rộng</label>
              <input type="number" className="form-input" value={selectedIcon.width} min="16" max="400" onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })} />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Cao</label>
              <input type="number" className="form-input" value={selectedIcon.height} min="16" max="400" onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input type="range" min="0.1" max="1" step="0.1" value={selectedIcon.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
            <span className="range-value">{Math.round(selectedIcon.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedIcon.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon /> Xóa biểu tượng
          </button>
        </div>
      )}
    </Panel>
  );
}
