import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function AnnotationsPanel() {
  const {
    elements, selectedElementId,
    updateElement, deleteElement, saveState
  } = useEditorStore();

  const selectedAnnotation = elements.find(a => a.id === selectedElementId && a.type === 'annotation');

  if (!selectedAnnotation) return null;

  return (
    <Panel title="Chú thích" id="annotationsPanel">
      <div className="annotation-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">X</label>
            <input type="number" className="form-input" value={Math.round(selectedAnnotation.x)} onChange={(e) => updateElement(selectedElementId, { x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Y</label>
            <input type="number" className="form-input" value={Math.round(selectedAnnotation.y)} onChange={(e) => updateElement(selectedElementId, { y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Màu nền</label>
          <div className="color-picker">
            <input type="color" value={selectedAnnotation.fill} onChange={(e) => updateElement(selectedElementId, { fill: e.target.value })} />
          </div>
        </div>

        {selectedAnnotation.annotationType === 'callout' && (
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <input type="text" className="form-input" value={selectedAnnotation.text} onChange={(e) => updateElement(selectedElementId, { text: e.target.value })} />
          </div>
        )}

        {selectedAnnotation.annotationType === 'numbered-circle' && (
          <>
            <div className="form-group">
              <label className="form-label">Số</label>
              <input type="number" className="form-input" value={selectedAnnotation.number} min="1" max="99" onChange={(e) => updateElement(selectedElementId, { number: parseInt(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Kích thước</label>
              <input type="range" min="24" max="80" value={selectedAnnotation.size} onChange={(e) => updateElement(selectedElementId, { size: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
              <span className="range-value">{selectedAnnotation.size}px</span>
            </div>
          </>
        )}

        {selectedAnnotation.annotationType === 'highlight' && (
          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Rộng</label>
              <input type="number" className="form-input" value={selectedAnnotation.width} onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })} />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Cao</label>
              <input type="number" className="form-input" value={selectedAnnotation.height} onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })} />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Độ trong suốt</label>
          <input type="range" min="0.1" max="1" step="0.1" value={selectedAnnotation.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{Math.round(selectedAnnotation.opacity * 100)}%</span>
        </div>

        <RotationControls
          elementId={selectedElementId}
          rotation={selectedAnnotation.rotation || 0}
          rotateX={selectedAnnotation.rotateX || 0}
          rotateY={selectedAnnotation.rotateY || 0}
          rotateZ={selectedAnnotation.rotateZ}
        />

        <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
          <TrashIcon /> Xóa chú thích
        </button>
      </div>
    </Panel>
  );
}
