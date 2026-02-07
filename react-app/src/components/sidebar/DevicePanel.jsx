import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function DevicePanel() {
  const { elements, selectedElementId, updateElement, deleteElement, saveState } = useEditorStore();

  const selectedElement = elements.find(el => el.id === selectedElementId && el.type === 'device');

  if (!selectedElement) return null;

  const deviceLabels = {
    browser: 'Trình duyệt',
    laptop: 'Laptop',
    desktop: 'Desktop',
    iphone: 'iPhone',
    android: 'Android',
    ipad: 'iPad',
    tablet: 'Tablet',
    none: 'Không khung',
  };

  // Use ?? to handle 0 values correctly
  const shadowValue = selectedElement.shadow ?? 50;

  return (
    <Panel title="Khung thiết bị" id="devicePanel">
      <div className="form-group">
        <label className="form-label">Loại thiết bị</label>
        <select className="form-select" value={selectedElement.deviceType} onChange={(e) => updateElement(selectedElementId, { deviceType: e.target.value })}>
          {Object.entries(deviceLabels).map(([type, label]) => (
            <option key={type} value={type}>{label}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Tỷ lệ khung</label>
        <input type="range" min="50" max="100" value={selectedElement.scale ?? 85} onChange={(e) => updateElement(selectedElementId, { scale: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
        <span className="range-value">{selectedElement.scale ?? 85}%</span>
      </div>
      <div className="form-group">
        <label className="form-label">Đổ bóng</label>
        <input type="range" min="0" max="100" value={shadowValue} onChange={(e) => updateElement(selectedElementId, { shadow: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
        <span className="range-value">{shadowValue}%</span>
      </div>

      <RotationControls
        elementId={selectedElementId}
        rotation={selectedElement.rotation || 0}
        rotateX={selectedElement.rotateX || 0}
        rotateY={selectedElement.rotateY || 0}
        rotateZ={selectedElement.rotateZ}
      />

      <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
        <TrashIcon /> Xóa khung hình
      </button>
    </Panel>
  );
}
