import useEditorStore from '../../store/editorStore';
import { TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function ShapesPanel() {
  const {
    elements, selectedElementId, updateElement,
    updateElementWithHistory, deleteElement, saveState
  } = useEditorStore();

  const selectedShape = elements.find(s => s.id === selectedElementId && s.type === 'shape');

  if (!selectedShape) return null;

  return (
    <Panel title="Hình dạng" id="shapesPanel">
      <div className="shape-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">Chiều rộng</label>
            <input type="number" className="form-input" value={selectedShape.width} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Chiều cao</label>
            <input type="number" className="form-input" value={selectedShape.height} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Kiểu tô</label>
          <div className="btn-group">
            <button className={`btn-group__item ${(selectedShape.fillType || 'solid') === 'solid' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'solid' })}>Màu đơn</button>
            <button className={`btn-group__item ${selectedShape.fillType === 'gradient' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'gradient' })}>Gradient</button>
          </div>
        </div>

        {(selectedShape.fillType || 'solid') === 'solid' && (
          <div className="form-group">
            <label className="form-label">Màu nền</label>
            <div className="color-picker">
              <input type="color" value={selectedShape.fill} onChange={(e) => updateElement(selectedElementId, { fill: e.target.value })} />
              <input type="text" className="form-input color-input" value={selectedShape.fill} onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateElement(selectedElementId, { fill: e.target.value }); }} />
            </div>
          </div>
        )}

        {selectedShape.fillType === 'gradient' && (
          <>
            <div className="form-group">
              <label className="form-label">Màu gradient</label>
              <div className="gradient-controls">
                <div className="color-picker">
                  <input type="color" value={selectedShape.fillGradientStart || '#5C6AC4'} onChange={(e) => updateElement(selectedElementId, { fillGradientStart: e.target.value })} />
                  <span className="color-label">Bắt đầu</span>
                </div>
                <div className="color-picker">
                  <input type="color" value={selectedShape.fillGradientEnd || '#202E78'} onChange={(e) => updateElement(selectedElementId, { fillGradientEnd: e.target.value })} />
                  <span className="color-label">Kết thúc</span>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Góc gradient</label>
              <input type="range" min="0" max="360" value={selectedShape.fillGradientAngle || 135} onChange={(e) => updateElement(selectedElementId, { fillGradientAngle: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
              <span className="range-value">{selectedShape.fillGradientAngle || 135}°</span>
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Viền</label>
          <input type="range" min="0" max="10" value={selectedShape.strokeWidth} onChange={(e) => updateElement(selectedElementId, { strokeWidth: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{selectedShape.strokeWidth}px</span>
        </div>

        {selectedShape.strokeWidth > 0 && (
          <div className="form-group">
            <label className="form-label">Màu viền</label>
            <div className="color-picker">
              <input type="color" value={selectedShape.stroke} onChange={(e) => updateElement(selectedElementId, { stroke: e.target.value })} />
            </div>
          </div>
        )}

        {selectedShape.shapeType === 'rectangle' && (
          <div className="form-group">
            <label className="form-label">Bo góc</label>
            <input type="range" min="0" max="50" value={selectedShape.borderRadius} onChange={(e) => updateElement(selectedElementId, { borderRadius: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
            <span className="range-value">{selectedShape.borderRadius}px</span>
          </div>
        )}

        {selectedShape.shapeType === 'badge' && (
          <div className="form-group">
            <label className="form-label">Số</label>
            <input type="text" className="form-input" value={selectedShape.text} maxLength={3} onChange={(e) => updateElement(selectedElementId, { text: e.target.value })} />
          </div>
        )}

        {selectedShape.shapeType === 'arrow' && (
          <>
            <div className="form-group">
              <label className="form-label">Kiểu đường kẻ</label>
              <select
                className="form-input"
                value={selectedShape.arrowStyle || 'solid'}
                onChange={(e) => updateElementWithHistory(selectedElementId, { arrowStyle: e.target.value })}
              >
                <option value="solid">Liền nét</option>
                <option value="dashed">Đứt đoạn (Dashed)</option>
                <option value="dotted">Chấm bi (Dotted)</option>
                <option value="curved">Đường cong</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Vị trí đầu mũi tên</label>
              <div className="btn-group">
                <button className={`btn-group__item ${(selectedShape.arrowHead || 'end') === 'none' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { arrowHead: 'none' })}>Không</button>
                <button className={`btn-group__item ${selectedShape.arrowHead === 'end' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { arrowHead: 'end' })}>Cuối</button>
                <button className={`btn-group__item ${selectedShape.arrowHead === 'start' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { arrowHead: 'start' })}>Đầu</button>
                <button className={`btn-group__item ${selectedShape.arrowHead === 'both' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { arrowHead: 'both' })}>Cả hai</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kiểu đầu mũi tên</label>
              <select
                className="form-input"
                value={selectedShape.arrowHeadStyle || 'classic'}
                onChange={(e) => updateElementWithHistory(selectedElementId, { arrowHeadStyle: e.target.value })}
              >
                <option value="classic">Tam giác</option>
                <option value="stealth">Stealth</option>
                <option value="open">Mở (Open)</option>
                <option value="circle">Tròn</option>
                <option value="diamond">Kim cương</option>
              </select>
            </div>

            {selectedShape.arrowStyle === 'curved' && (
              <div className="form-group">
                <label className="form-label">Độ cong</label>
                <input
                  type="range" min="-1" max="1" step="0.1"
                  value={selectedShape.curvature || 0}
                  onChange={(e) => updateElement(selectedElementId, { curvature: parseFloat(e.target.value) })}
                  onMouseUp={() => saveState()}
                />
                <span className="range-value">{selectedShape.curvature || 0}</span>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label className="form-label">Độ trong suốt</label>
          <input type="range" min="0.1" max="1" step="0.1" value={selectedShape.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{Math.round(selectedShape.opacity * 100)}%</span>
        </div>

        <RotationControls elementId={selectedElementId} rotation={selectedShape.rotation || 0} />

        <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
          <TrashIcon /> Xóa hình dạng
        </button>
      </div>
    </Panel>
  );
}
