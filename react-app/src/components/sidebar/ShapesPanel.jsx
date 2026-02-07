import useEditorStore from '../../store/editorStore';
import { TrashIcon, FlipHIcon, FlipVIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function ShapesPanel() {
  const {
    elements, selectedElementId, updateElement,
    updateElementWithHistory, deleteElement, saveState,
    recentColors, addRecentColor
  } = useEditorStore();

  const selectedShape = elements.find(s => s.id === selectedElementId && s.type === 'shape');

  if (!selectedShape) return null;

  const isLine = selectedShape.shapeType === 'line';
  const isArrow = selectedShape.shapeType === 'arrow';
  const showTextControls = !isLine && !isArrow;
  const shadow = selectedShape.shadow || { enabled: false, color: '#00000066', blur: 10, offsetX: 0, offsetY: 4 };

  return (
    <Panel title="Hình dạng" id="shapesPanel">
      <div className="shape-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">X</label>
            <input type="number" className="form-input" value={Math.round(selectedShape.x)} onChange={(e) => updateElement(selectedElementId, { x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Y</label>
            <input type="number" className="form-input" value={Math.round(selectedShape.y)} onChange={(e) => updateElement(selectedElementId, { y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
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
              <input type="color" value={selectedShape.fill} onChange={(e) => { updateElement(selectedElementId, { fill: e.target.value }); addRecentColor(e.target.value); }} />
              <input type="text" className="form-input color-input" value={selectedShape.fill} onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) { updateElement(selectedElementId, { fill: e.target.value }); addRecentColor(e.target.value); } }} />
            </div>
            {recentColors.length > 0 && (
              <div className="color-swatches" style={{ marginTop: 6 }}>
                {recentColors.map((c) => (
                  <button key={c} className={`swatch ${selectedShape.fill === c ? 'active' : ''}`} style={{ background: c, width: 22, height: 22 }} onClick={() => updateElement(selectedElementId, { fill: c })} />
                ))}
              </div>
            )}
          </div>
        )}

        {selectedShape.fillType === 'gradient' && (
          <>
            <div className="form-group">
              <label className="form-label">Kiểu gradient</label>
              <div className="btn-group">
                <button className={`btn-group__item ${(selectedShape.fillGradientType || 'linear') === 'linear' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillGradientType: 'linear' })}>Tuyến tính</button>
                <button className={`btn-group__item ${selectedShape.fillGradientType === 'radial' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillGradientType: 'radial' })}>Tỏa tròn</button>
              </div>
            </div>
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
            {(selectedShape.fillGradientType || 'linear') === 'linear' && (
              <div className="form-group">
                <label className="form-label">Góc gradient</label>
                <input type="range" min="0" max="360" value={selectedShape.fillGradientAngle || 135} onChange={(e) => updateElement(selectedElementId, { fillGradientAngle: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
                <span className="range-value">{selectedShape.fillGradientAngle || 135}°</span>
              </div>
            )}
          </>
        )}

        <div className="form-group">
          <label className="form-label">Viền</label>
          <input type="range" min="0" max="10" value={selectedShape.strokeWidth} onChange={(e) => updateElement(selectedElementId, { strokeWidth: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{selectedShape.strokeWidth}px</span>
        </div>

        {selectedShape.strokeWidth > 0 && (
          <>
            <div className="form-group">
              <label className="form-label">Màu viền</label>
              <div className="color-picker">
                <input type="color" value={selectedShape.stroke} onChange={(e) => updateElement(selectedElementId, { stroke: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Kiểu viền</label>
              <div className="btn-group">
                <button className={`btn-group__item ${(selectedShape.strokeStyle || 'solid') === 'solid' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'solid' })}>Liền</button>
                <button className={`btn-group__item ${selectedShape.strokeStyle === 'dashed' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'dashed' })}>Đứt</button>
                <button className={`btn-group__item ${selectedShape.strokeStyle === 'dotted' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'dotted' })}>Chấm</button>
              </div>
            </div>
          </>
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

        {selectedShape.shapeType === 'star' && (
          <>
            <div className="form-group">
              <label className="form-label">Số cánh</label>
              <input type="range" min="3" max="12" value={selectedShape.starPoints || 5} onChange={(e) => updateElement(selectedElementId, { starPoints: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
              <span className="range-value">{selectedShape.starPoints || 5}</span>
            </div>
            <div className="form-group">
              <label className="form-label">Độ lõm</label>
              <input type="range" min="0.1" max="0.9" step="0.05" value={selectedShape.starInnerRadius || 0.4} onChange={(e) => updateElement(selectedElementId, { starInnerRadius: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
              <span className="range-value">{Math.round((selectedShape.starInnerRadius || 0.4) * 100)}%</span>
            </div>
          </>
        )}

        {selectedShape.shapeType === 'cross' && (
          <div className="form-group">
            <label className="form-label">Độ dày</label>
            <input type="range" min="0.15" max="0.6" step="0.01" value={selectedShape.crossThickness || 0.33} onChange={(e) => updateElement(selectedElementId, { crossThickness: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
            <span className="range-value">{Math.round((selectedShape.crossThickness || 0.33) * 100)}%</span>
          </div>
        )}

        {selectedShape.shapeType === 'callout' && (
          <div className="form-group">
            <label className="form-label">Vị trí pointer</label>
            <select
              className="form-input"
              value={selectedShape.pointerPosition || 'bottom-center'}
              onChange={(e) => updateElementWithHistory(selectedElementId, { pointerPosition: e.target.value })}
            >
              <option value="bottom-center">Dưới giữa</option>
              <option value="bottom-left">Dưới trái</option>
              <option value="bottom-right">Dưới phải</option>
              <option value="top-center">Trên giữa</option>
              <option value="left">Trái</option>
              <option value="right">Phải</option>
            </select>
          </div>
        )}

        {isArrow && (
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

        {isLine && (
          <div className="form-group">
            <label className="form-label">Kiểu đường</label>
            <div className="btn-group">
              <button className={`btn-group__item ${(selectedShape.strokeStyle || 'solid') === 'solid' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'solid' })}>Liền</button>
              <button className={`btn-group__item ${selectedShape.strokeStyle === 'dashed' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'dashed' })}>Đứt</button>
              <button className={`btn-group__item ${selectedShape.strokeStyle === 'dotted' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { strokeStyle: 'dotted' })}>Chấm</button>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Độ trong suốt</label>
          <input type="range" min="0.1" max="1" step="0.1" value={selectedShape.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{Math.round(selectedShape.opacity * 100)}%</span>
        </div>

        {/* Shadow */}
        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              checked={shadow.enabled}
              onChange={(e) => updateElementWithHistory(selectedElementId, { shadow: { ...shadow, enabled: e.target.checked } })}
              style={{ marginRight: 6 }}
            />
            Đổ bóng
          </label>
        </div>
        {shadow.enabled && (
          <>
            <div className="form-group">
              <label className="form-label">Màu bóng</label>
              <div className="color-picker">
                <input type="color" value={shadow.color?.slice(0, 7) || '#000000'} onChange={(e) => updateElement(selectedElementId, { shadow: { ...shadow, color: e.target.value + '66' } })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Blur</label>
              <input type="range" min="0" max="50" value={shadow.blur || 10} onChange={(e) => updateElement(selectedElementId, { shadow: { ...shadow, blur: parseInt(e.target.value) } })} onMouseUp={() => saveState()} />
              <span className="range-value">{shadow.blur || 10}px</span>
            </div>
            <div className="form-row">
              <div className="form-group form-group--half">
                <label className="form-label">X offset</label>
                <input type="number" className="form-input" value={shadow.offsetX || 0} onChange={(e) => updateElementWithHistory(selectedElementId, { shadow: { ...shadow, offsetX: parseInt(e.target.value) || 0 } })} />
              </div>
              <div className="form-group form-group--half">
                <label className="form-label">Y offset</label>
                <input type="number" className="form-input" value={shadow.offsetY || 0} onChange={(e) => updateElementWithHistory(selectedElementId, { shadow: { ...shadow, offsetY: parseInt(e.target.value) || 0 } })} />
              </div>
            </div>
          </>
        )}

        {/* Flip */}
        <div className="form-group">
          <label className="form-label">Lật</label>
          <div className="btn-group">
            <button
              className={`btn-group__item ${selectedShape.flipH ? 'active' : ''}`}
              onClick={() => updateElementWithHistory(selectedElementId, { flipH: !selectedShape.flipH })}
              title="Lật ngang"
            >
              <FlipHIcon /> Ngang
            </button>
            <button
              className={`btn-group__item ${selectedShape.flipV ? 'active' : ''}`}
              onClick={() => updateElementWithHistory(selectedElementId, { flipV: !selectedShape.flipV })}
              title="Lật dọc"
            >
              <FlipVIcon /> Dọc
            </button>
          </div>
        </div>

        <RotationControls
          elementId={selectedElementId}
          rotation={selectedShape.rotation || 0}
          rotateX={selectedShape.rotateX || 0}
          rotateY={selectedShape.rotateY || 0}
          rotateZ={selectedShape.rotateZ}
        />

        {/* Text in shape */}
        {showTextControls && (
          <>
            <div className="form-group">
              <label className="form-label">Văn bản trong shape</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nhập văn bản..."
                value={selectedShape.shapeText || ''}
                onChange={(e) => updateElement(selectedElementId, { shapeText: e.target.value })}
                onBlur={() => saveState()}
              />
            </div>
            {selectedShape.shapeText && (
              <div className="form-row">
                <div className="form-group form-group--half">
                  <label className="form-label">Màu chữ</label>
                  <div className="color-picker">
                    <input type="color" value={selectedShape.shapeTextColor || '#FFFFFF'} onChange={(e) => updateElement(selectedElementId, { shapeTextColor: e.target.value })} />
                  </div>
                </div>
                <div className="form-group form-group--half">
                  <label className="form-label">Cỡ chữ</label>
                  <input type="number" className="form-input" min="8" max="72" value={selectedShape.shapeTextSize || 16} onChange={(e) => updateElementWithHistory(selectedElementId, { shapeTextSize: parseInt(e.target.value) || 16 })} />
                </div>
              </div>
            )}
          </>
        )}

        <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
          <TrashIcon /> Xóa hình dạng
        </button>
      </div>
    </Panel>
  );
}
