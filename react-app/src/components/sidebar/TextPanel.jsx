import useEditorStore from '../../store/editorStore';
import { TrashIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function TextPanel() {
  const {
    elements, selectedElementId, updateElement,
    updateElementWithHistory, deleteElement, saveState,
    recentColors, addRecentColor
  } = useEditorStore();

  const selectedText = elements.find(t => t.id === selectedElementId && t.type === 'text');

  if (!selectedText) return null;

  return (
    <Panel title="Văn bản" id="textPanel">
      <div className="text-properties">
        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">X</label>
            <input type="number" className="form-input" value={Math.round(selectedText.x)} onChange={(e) => updateElement(selectedElementId, { x: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Y</label>
            <input type="number" className="form-input" value={Math.round(selectedText.y)} onChange={(e) => updateElement(selectedElementId, { y: parseInt(e.target.value) || 0 })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung</label>
          <textarea className="form-input" value={selectedText.content} onChange={(e) => updateElement(selectedElementId, { content: e.target.value })} placeholder="Nhập văn bản..." rows={3} style={{ resize: 'vertical' }} />
        </div>

        <div className="form-row">
          <div className="form-group form-group--half">
            <label className="form-label">Font</label>
            <select className="form-select" value={selectedText.font} onChange={(e) => updateElementWithHistory(selectedElementId, { font: e.target.value })}>
              <option value="Instrument Sans">Instrument Sans</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Poppins">Poppins</option>
              <option value="Lato">Lato</option>
              <option value="Raleway">Raleway</option>
              <option value="Nunito">Nunito</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
              <option value="Ubuntu">Ubuntu</option>
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>
          <div className="form-group form-group--half">
            <label className="form-label">Cỡ chữ</label>
            <input type="number" className="form-input" value={selectedText.size} min="12" max="200" onChange={(e) => updateElement(selectedElementId, { size: parseInt(e.target.value) })} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Căn chỉnh</label>
          <div className="btn-group">
            <button className={`btn-group__item ${selectedText.textAlign === 'left' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'left' })}><AlignLeftIcon /></button>
            <button className={`btn-group__item ${selectedText.textAlign === 'center' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'center' })}><AlignCenterIcon /></button>
            <button className={`btn-group__item ${selectedText.textAlign === 'right' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'right' })}><AlignRightIcon /></button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Màu chữ</label>
          <div className="color-picker">
            <input type="color" value={selectedText.color} onChange={(e) => { updateElement(selectedElementId, { color: e.target.value }); addRecentColor(e.target.value); }} />
            <input type="text" className="form-input color-input" value={selectedText.color} onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) { updateElement(selectedElementId, { color: e.target.value }); addRecentColor(e.target.value); } }} />
          </div>
          {recentColors.length > 0 && (
            <div className="color-swatches" style={{ marginTop: 6 }}>
              {recentColors.map((c) => (
                <button key={c} className={`swatch ${selectedText.color === c ? 'active' : ''}`} style={{ background: c, width: 22, height: 22 }} onClick={() => updateElement(selectedElementId, { color: c })} />
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Độ đậm</label>
          <div className="btn-group">
            {[{ value: '400', label: 'Thường' }, { value: '600', label: 'Đậm' }, { value: '700', label: 'Rất đậm' }].map((w) => (
              <button key={w.value} className={`btn-group__item ${selectedText.weight === w.value ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { weight: w.value })}>{w.label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Khoảng cách chữ</label>
          <input type="range" min="-5" max="20" value={selectedText.letterSpacing || 0} onChange={(e) => updateElement(selectedElementId, { letterSpacing: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{selectedText.letterSpacing || 0}px</span>
        </div>

        <div className="form-group">
          <label className="form-label">Chiều cao dòng</label>
          <input type="range" min="0.8" max="3.0" step="0.1" value={selectedText.lineHeight || 1.5} onChange={(e) => updateElement(selectedElementId, { lineHeight: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{selectedText.lineHeight || 1.5}</span>
        </div>

        <div className="form-group">
          <label className="form-label">Độ trong suốt</label>
          <input type="range" min="0.1" max="1" step="0.1" value={selectedText.opacity ?? 1} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
          <span className="range-value">{Math.round((selectedText.opacity ?? 1) * 100)}%</span>
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={selectedText.textBg?.enabled || false} onChange={(e) => updateElementWithHistory(selectedElementId, { textBg: { ...selectedText.textBg, enabled: e.target.checked, color: selectedText.textBg?.color || '#000000', padding: selectedText.textBg?.padding || 8 } })} />
            Nền văn bản
          </label>
          {selectedText.textBg?.enabled && (
            <div className="sub-controls">
              <div className="color-picker">
                <input type="color" value={selectedText.textBg?.color || '#000000'} onChange={(e) => updateElement(selectedElementId, { textBg: { ...selectedText.textBg, color: e.target.value } })} />
                <span className="color-label">Màu nền</span>
              </div>
              <div className="form-group">
                <label className="form-label">Padding</label>
                <input type="range" min="0" max="32" value={selectedText.textBg?.padding || 8} onChange={(e) => updateElement(selectedElementId, { textBg: { ...selectedText.textBg, padding: parseInt(e.target.value) } })} onMouseUp={() => saveState()} />
                <span className="range-value">{selectedText.textBg?.padding || 8}px</span>
              </div>
            </div>
          )}
        </div>

        <RotationControls elementId={selectedElementId} rotation={selectedText.rotation || 0} />

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={selectedText.shadow?.enabled || false} onChange={(e) => updateElementWithHistory(selectedElementId, { shadow: { ...selectedText.shadow, enabled: e.target.checked } })} />
            Đổ bóng chữ
          </label>
          {selectedText.shadow?.enabled && (
            <div className="sub-controls">
              <div className="color-picker">
                <input type="color" value={selectedText.shadow?.color || '#000000'} onChange={(e) => updateElement(selectedElementId, { shadow: { ...selectedText.shadow, color: e.target.value } })} />
                <span className="color-label">Màu bóng</span>
              </div>
              <div className="form-group">
                <label className="form-label">Độ mờ</label>
                <input type="range" min="0" max="20" value={selectedText.shadow?.blur || 4} onChange={(e) => updateElement(selectedElementId, { shadow: { ...selectedText.shadow, blur: parseInt(e.target.value) } })} onMouseUp={() => saveState()} />
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <input type="checkbox" checked={selectedText.outline?.enabled || false} onChange={(e) => updateElementWithHistory(selectedElementId, { outline: { ...selectedText.outline, enabled: e.target.checked } })} />
            Viền chữ
          </label>
          {selectedText.outline?.enabled && (
            <div className="sub-controls">
              <div className="color-picker">
                <input type="color" value={selectedText.outline?.color || '#000000'} onChange={(e) => updateElement(selectedElementId, { outline: { ...selectedText.outline, color: e.target.value } })} />
                <span className="color-label">Màu viền</span>
              </div>
              <div className="form-group">
                <label className="form-label">Độ dày</label>
                <input type="range" min="1" max="5" value={selectedText.outline?.width || 1} onChange={(e) => updateElement(selectedElementId, { outline: { ...selectedText.outline, width: parseInt(e.target.value) } })} onMouseUp={() => saveState()} />
              </div>
            </div>
          )}
        </div>

        <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
          <TrashIcon /> Xóa văn bản
        </button>
      </div>
    </Panel>
  );
}
