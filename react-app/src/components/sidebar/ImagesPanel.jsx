import { useState, useRef } from 'react';
import useEditorStore from '../../store/editorStore';
import { UploadIcon, TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function ImagesPanel() {
  const {
    elements, selectedElementId, addImageOverlay,
    updateElement, deleteElement, selectElement, saveState
  } = useEditorStore();

  const images = elements.filter(el => el.type === 'image');
  const selectedImage = images.find(i => i.id === selectedElementId);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 300;
          const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
          addImageOverlay(e.target.result, img.width * ratio, img.height * ratio);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Panel title="Hình ảnh overlay" id="imagesPanel" defaultOpen={false}>
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
      >
        <UploadIcon />
        <span>Thêm logo / sticker</span>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
      </div>

      {images.length > 0 && (
        <div className="element-list">
          {images.map((image) => (
            <div key={image.id} className={`element-item ${image.id === selectedElementId ? 'active' : ''}`} onClick={() => selectElement(image.id)}>
              <img src={image.src} alt="" className="element-item__thumb" />
              <span className="element-item__name">Hình ảnh</span>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
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
      )}
    </Panel>
  );
}
