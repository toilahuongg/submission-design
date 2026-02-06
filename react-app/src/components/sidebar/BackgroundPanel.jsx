import { useState, useRef } from 'react';
import useEditorStore from '../../store/editorStore';
import { UploadIcon } from '../icons/SidebarIcons';
import Panel from './Panel';

export default function BackgroundPanel() {
  const { background, setBackground, setBackgroundType, colorPresets, showToastMessage } = useEditorStore();
  const bgImageRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground({ image: e.target.result, type: 'image' });
        showToastMessage('Đã tải ảnh nền');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetFromUrl = () => {
    if (!imageUrl.trim()) return;
    setBackground({ image: imageUrl, type: 'image' });
    setImageUrl('');
    showToastMessage('Đã cập nhật ảnh nền từ URL');
  };

  return (
    <Panel title="Nền" id="bgPanel">
      <div className="form-group">
        <label className="form-label">Kiểu nền</label>
        <div className="btn-group">
          {['solid', 'gradient', 'image'].map((type) => (
            <button
              key={type}
              className={`btn-group__item ${background.type === type ? 'active' : ''}`}
              onClick={() => setBackgroundType(type)}
            >
              {type === 'solid' ? 'Màu đơn' : type === 'gradient' ? 'Gradient' : 'Ảnh'}
            </button>
          ))}
        </div>
      </div>

      {background.type === 'solid' && (
        <div className="form-group">
          <label className="form-label">Màu nền</label>
          <div className="color-picker">
            <input type="color" value={background.color} onChange={(e) => setBackground({ color: e.target.value })} />
            <input
              type="text"
              className="form-input color-input"
              value={background.color}
              onChange={(e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                  setBackground({ color: e.target.value });
                }
              }}
            />
          </div>
        </div>
      )}

      {background.type === 'gradient' && (
        <>
          <div className="form-group">
            <label className="form-label">Kiểu gradient</label>
            <div className="btn-group">
              <button className={`btn-group__item ${background.gradientType === 'linear' ? 'active' : ''}`} onClick={() => setBackground({ gradientType: 'linear' })}>Tuyến tính</button>
              <button className={`btn-group__item ${background.gradientType === 'radial' ? 'active' : ''}`} onClick={() => setBackground({ gradientType: 'radial' })}>Tỏa tròn</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Màu gradient</label>
            <div className="gradient-controls">
              <div className="color-picker">
                <input type="color" value={background.gradientStart} onChange={(e) => setBackground({ gradientStart: e.target.value })} />
                <span className="color-label">Bắt đầu</span>
              </div>
              <div className="color-picker">
                <input type="color" value={background.gradientEnd} onChange={(e) => setBackground({ gradientEnd: e.target.value })} />
                <span className="color-label">Kết thúc</span>
              </div>
            </div>
          </div>
          {background.gradientType === 'linear' && (
            <div className="form-group">
              <label className="form-label">Góc</label>
              <input type="range" min="0" max="360" value={background.gradientAngle} onChange={(e) => setBackground({ gradientAngle: parseInt(e.target.value) })} />
              <span className="range-value">{background.gradientAngle}°</span>
            </div>
          )}
          {background.gradientType === 'radial' && (
            <div className="form-group">
              <label className="form-label">Vị trí tâm</label>
              <select className="form-select" value={background.radialPosition} onChange={(e) => setBackground({ radialPosition: e.target.value })}>
                <option value="center">Giữa</option>
                <option value="top">Trên</option>
                <option value="bottom">Dưới</option>
                <option value="left">Trái</option>
                <option value="right">Phải</option>
                <option value="top left">Trên trái</option>
                <option value="top right">Trên phải</option>
                <option value="bottom left">Dưới trái</option>
                <option value="bottom right">Dưới phải</option>
              </select>
            </div>
          )}
        </>
      )}

      {background.type === 'image' && (
        <>
          <div className="form-group">
            <label className="form-label">Ảnh nền</label>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dán link ảnh nền..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetFromUrl()}
                />
                <button className="btn btn--primary" onClick={handleSetFromUrl} style={{ padding: '0 12px', whiteSpace: 'nowrap' }}>
                  Cập nhật
                </button>
              </div>
            </div>
            <div
              className={`upload-zone ${dragOver ? 'dragover' : ''}`}
              onClick={() => bgImageRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleImageUpload(e.dataTransfer.files[0]); }}
            >
              <UploadIcon />
              <span>Kéo thả hoặc click để tải ảnh</span>
              <input ref={bgImageRef} type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(e.target.files[0])} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Làm mờ</label>
            <input type="range" min="0" max="20" value={background.blur} onChange={(e) => setBackground({ blur: parseInt(e.target.value) })} />
            <span className="range-value">{background.blur}px</span>
          </div>
        </>
      )}

      <div className="preset-colors">
        <span className="form-label">Màu gợi ý</span>
        <div className="color-swatches">
          {colorPresets.map((color) => (
            <button key={color} className={`swatch ${background.color === color ? 'active' : ''}`} style={{ background: color }} onClick={() => setBackground({ color, type: 'solid' })} />
          ))}
        </div>
      </div>
    </Panel>
  );
}
