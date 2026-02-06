import { useState, useRef } from 'react';
import useEditorStore from '../../store/editorStore';
import { UploadIcon } from '../icons/SidebarIcons';
import Panel from './Panel';

export default function ScreenshotPanel() {
  const { setScreenshot, showToastMessage, elements, selectedElementId } = useEditorStore();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isDeviceSelected = selectedElement?.type === 'device';

  const handleUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshot(e.target.result);
        if (isDeviceSelected) {
          showToastMessage('Đã cập nhật ảnh cho khung hình');
        } else {
          showToastMessage('Đã tạo khung hình mới với ảnh');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Panel title="Ảnh chụp màn hình" id="screenshotPanel" autoExpand={isDeviceSelected}>
      <div
        className={`upload-zone upload-zone--large ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
      >
        <UploadIcon />
        <span className="upload-text">{isDeviceSelected ? 'Cập nhật ảnh cho thiết bị' : 'Tải ảnh chụp màn hình'}</span>
        <span className="upload-hint">PNG, JPG tối đa 10MB</span>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
      </div>
    </Panel>
  );
}
