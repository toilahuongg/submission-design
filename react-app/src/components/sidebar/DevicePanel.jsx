import useEditorStore from '../../store/editorStore';
import { NoFrameIcon, TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';

export default function DevicePanel() {
  const { addDevice, elements, selectedElementId, updateElement, deleteElement } = useEditorStore();

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isDeviceSelected = selectedElement?.type === 'device';

  const devices = [
    { type: 'none', label: 'Không khung', icon: <NoFrameIcon /> },
    { type: 'browser', label: 'Trình duyệt', preview: 'mock-browser-mini' },
    { type: 'laptop', label: 'Laptop', preview: 'mock-laptop-mini' },
    { type: 'desktop', label: 'Desktop', preview: 'mock-desktop-mini' },
    { type: 'iphone', label: 'iPhone', preview: 'mock-iphone-mini' },
    { type: 'android', label: 'Android', preview: 'mock-android-mini' },
    { type: 'ipad', label: 'iPad', preview: 'mock-ipad-mini' },
    { type: 'tablet', label: 'Tablet', preview: 'mock-tablet-mini' },
  ];

  return (
    <Panel title="Khung thiết bị" id="devicePanel" autoExpand={isDeviceSelected}>
      <div className="device-grid">
        {devices.map((d) => (
          <button key={d.type} className="device-option" onClick={() => addDevice(d.type)}>
            <div className="device-preview">{d.icon || <div className={d.preview}></div>}</div>
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {isDeviceSelected && (
        <>
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
        </>
      )}
    </Panel>
  );
}
