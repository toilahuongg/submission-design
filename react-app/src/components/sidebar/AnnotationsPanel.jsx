import useEditorStore from '../../store/editorStore';
import { CalloutIcon, NumberIcon, HighlightIcon, TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function AnnotationsPanel() {
  const {
    elements, selectedElementId, addAnnotation,
    updateElement, deleteElement, selectElement, saveState
  } = useEditorStore();

  const annotations = elements.filter(el => el.type === 'annotation');
  const selectedAnnotation = annotations.find(a => a.id === selectedElementId);

  const annotationTypes = [
    { type: 'callout', icon: <CalloutIcon />, label: 'Callout' },
    { type: 'numbered-circle', icon: <NumberIcon />, label: 'Số thứ tự' },
    { type: 'highlight', icon: <HighlightIcon />, label: 'Highlight' },
  ];

  return (
    <Panel title="Chú thích" id="annotationsPanel" defaultOpen={false}>
      <div className="shape-buttons">
        {annotationTypes.map((a) => (
          <button key={a.type} className="shape-btn" onClick={() => addAnnotation(a.type)} title={a.label}>{a.icon}</button>
        ))}
      </div>

      {annotations.length > 0 && (
        <div className="element-list">
          {annotations.map((annotation) => (
            <div key={annotation.id} className={`element-item ${annotation.id === selectedElementId ? 'active' : ''}`} onClick={() => selectElement(annotation.id)}>
              <div className="element-item__icon" style={{ color: annotation.fill }}>{annotationTypes.find(a => a.type === annotation.annotationType)?.icon}</div>
              <span className="element-item__name">{annotationTypes.find(a => a.type === annotation.annotationType)?.label}</span>
            </div>
          ))}
        </div>
      )}

      {selectedAnnotation && (
        <div className="annotation-properties">
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

          <RotationControls elementId={selectedElementId} rotation={selectedAnnotation.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon /> Xóa chú thích
          </button>
        </div>
      )}
    </Panel>
  );
}
