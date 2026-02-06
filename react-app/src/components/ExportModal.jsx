import { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import useEditorStore from '../store/editorStore';

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

export default function ExportModal() {
  const { showExportModal, setShowExportModal, showToastMessage } = useEditorStore();
  const [filename, setFilename] = useState('shopify-screenshot');
  const [format, setFormat] = useState('png');
  const [preview, setPreview] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const generatePreview = useCallback(async () => {
    setPreview(null);
    try {
      const canvas = document.getElementById('canvas');
      if (!canvas) return;

      const originalTransform = canvas.style.transform;
      canvas.style.transform = 'scale(1)';

      const result = await html2canvas(canvas, {
        width: 1600,
        height: 900,
        scale: 0.5,
        useCORS: true,
        backgroundColor: null
      });

      canvas.style.transform = originalTransform;
      setPreview(result.toDataURL('image/png'));
    } catch (error) {
      console.error('Preview error:', error);
    }
  }, []);

  useEffect(() => {
    if (showExportModal) {
      generatePreview();
    }
  }, [showExportModal, generatePreview]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const canvas = document.getElementById('canvas');
      if (!canvas) return;

      const originalTransform = canvas.style.transform;
      canvas.style.transform = 'scale(1)';

      const result = await html2canvas(canvas, {
        width: 1600,
        height: 900,
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });

      canvas.style.transform = originalTransform;

      if (format === 'pdf') {
        // Dynamic import jspdf
        const { default: jsPDF } = await import('jspdf');
        const imgData = result.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1600, 900]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, 1600, 900);
        pdf.save(`${filename}.pdf`);
      } else {
        const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpg' ? 0.95 : undefined;
        const dataUrl = result.toDataURL(mimeType, quality);

        const link = document.createElement('a');
        link.download = `${filename}.${format}`;
        link.href = dataUrl;
        link.click();
      }

      setShowExportModal(false);
      showToastMessage('Đã xuất ảnh thành công!');
    } catch (error) {
      console.error('Export error:', error);
      showToastMessage('Lỗi khi xuất ảnh');
    } finally {
      setIsExporting(false);
    }
  };

  if (!showExportModal) return null;

  return (
    <div className={`modal ${showExportModal ? 'show' : ''}`}>
      <div className="modal__backdrop" onClick={() => setShowExportModal(false)}></div>
      <div className="modal__content">
        <div className="modal__header">
          <h3>Xuất ảnh</h3>
          <button className="modal__close" onClick={() => setShowExportModal(false)}>&times;</button>
        </div>
        <div className="modal__body">
          <div className="export-preview">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              'Đang tạo preview...'
            )}
          </div>
          <div className="export-options">
            <div className="form-group">
              <label className="form-label">Tên file</label>
              <input
                type="text"
                className="form-input"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Định dạng</label>
              <div className="btn-group">
                <button
                  className={`btn-group__item ${format === 'png' ? 'active' : ''}`}
                  onClick={() => setFormat('png')}
                >
                  PNG
                </button>
                <button
                  className={`btn-group__item ${format === 'jpg' ? 'active' : ''}`}
                  onClick={() => setFormat('jpg')}
                >
                  JPG
                </button>
                <button
                  className={`btn-group__item ${format === 'pdf' ? 'active' : ''}`}
                  onClick={() => setFormat('pdf')}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={() => setShowExportModal(false)}>
            Hủy
          </button>
          <button className="btn btn--primary" onClick={handleExport} disabled={isExporting}>
            <DownloadIcon />
            {isExporting ? 'Đang xuất...' : 'Tải xuống'}
          </button>
        </div>
      </div>
    </div>
  );
}
