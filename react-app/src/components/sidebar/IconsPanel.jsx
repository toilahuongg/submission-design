import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function IconsPanel() {
  const {
    elements, selectedElementId,
    updateElement, deleteElement, saveState
  } = useEditorStore();

  const selectedIcon = elements.find(i => i.id === selectedElementId && i.type === 'icon');

  if (!selectedIcon) return null;

  return (
    <Panel title="Biểu tượng" id="iconsPanel">
      <div className="icon-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">X</label>
            <input type="number" className="form-input" value={Math.round(selectedIcon.x)} onChange={(e) => updateElement(selectedElementId, { x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Y</label>
            <input type="number" className="form-input" value={Math.round(selectedIcon.y)} onChange={(e) => updateElement(selectedElementId, { y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
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
    </Panel>
  );
}
