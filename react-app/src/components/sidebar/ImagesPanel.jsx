import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function ImagesPanel() {
  const {
    elements, selectedElementId,
    updateElement, deleteElement, saveState
  } = useEditorStore();

  const selectedImage = elements.find(i => i.id === selectedElementId && i.type === 'image');

  if (!selectedImage) return null;

  return (
    <Panel title="Hình ảnh" id="imagesPanel">
      <div className="image-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">Chiều rộng</label>
            <input type="number" className="form-input" value={Math.round(selectedImage.width)} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Chiều cao</label>
            <input type="number" className="form-input" value={Math.round(selectedImage.height)} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Độ trong suốt</label>
          <input type="range" min="0.1" max="1" step="0.1" value={selectedImage.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{Math.round(selectedImage.opacity * 100)}%</span>
        </div>

        <RotationControls elementId={selectedElementId} rotation={selectedImage.rotation || 0} />

        <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
          <TrashIcon /> Xóa hình ảnh
        </button>
      </div>
    </Panel>
  );
}
