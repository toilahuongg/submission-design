import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';

export default function DevicePanel() {
  const { elements, selectedElementId, updateElement, deleteElement } = useEditorStore();

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
        <input type="range" min="50" max="100" value={selectedElement.scale || 85} onChange={(e) => updateElement(selectedElementId, { scale: parseInt(e.target.value) })} />
        <span className="range-value">{selectedElement.scale || 85}%</span>
      </div>
      <div className="form-group">
        <label className="form-label">Đổ bóng</label>
        <input type="range" min="0" max="100" value={selectedElement.shadow || 50} onChange={(e) => updateElement(selectedElementId, { shadow: parseInt(e.target.value) })} />
        <span className="range-value">{selectedElement.shadow || 50}%</span>
      </div>
      <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
        <TrashIcon /> Xóa khung hình
      </button>
    </Panel>
  );
}
