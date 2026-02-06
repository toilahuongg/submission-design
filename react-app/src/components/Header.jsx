import { useRef } from 'react';
import useEditorStore from '../store/editorStore';

const UndoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h8a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H8"/>
    <polyline points="7 6 3 10 7 14"/>
  </svg>
);

const RedoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10h-8a5 5 0 0 0-5 5v0a5 5 0 0 0 5 5h3"/>
    <polyline points="17 6 21 10 17 14"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="2" y="2" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 14h12M14 8v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const RulerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 6H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
    <path d="M6 6v6M10 6v3M14 6v6M18 6v3"/>
  </svg>
);

const PanelRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
  </svg>
);

const KeyboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>
  </svg>
);

export default function Header() {
  const {
    undo, redo, canUndo, canRedo, setShowExportModal,
    saveProject, loadProject,
    showRulers, setShowRulers,
    showPropertiesSidebar, togglePropertiesSidebar,
    enableAutoSave,
    setShowShortcutsModal
  } = useEditorStore();

  const fileInputRef = useRef(null);

  const handleLoadProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      loadProject(ev.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="header">
      <div className="header__brand">
        <div className="header__logo">
          <LogoIcon />
        </div>
        <span className="header__title">Screenshot Editor</span>
        <span className="header__badge">1600×900</span>
        {enableAutoSave && (
          <span className="autosave-indicator" title="Auto-save bật">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#008060"/></svg>
          </span>
        )}
      </div>
      <div className="header__actions">
        <button
          className={`btn btn--ghost ${showPropertiesSidebar ? 'btn--active' : ''}`}
          onClick={togglePropertiesSidebar}
          title="Hiển thị/Ẩn bảng thuộc tính"
        >
          <PanelRightIcon />
        </button>
        <button
          className={`btn btn--ghost ${showRulers ? 'btn--active' : ''}`}
          onClick={() => setShowRulers(!showRulers)}
          title="Hiển thị rulers"
        >
          <RulerIcon />
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => setShowShortcutsModal(true)}
          title="Phím tắt (Ctrl+/)"
        >
          <KeyboardIcon />
        </button>
        <div className="header__divider"></div>
        <button
          className="btn btn--ghost"
          onClick={saveProject}
          title="Lưu dự án"
        >
          <SaveIcon />
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => fileInputRef.current?.click()}
          title="Tải dự án"
        >
          <FolderIcon />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          hidden
          onChange={handleLoadProject}
        />
        <div className="header__divider"></div>
        <button
          className="btn btn--ghost"
          onClick={undo}
          disabled={!canUndo()}
          title="Hoàn tác (Ctrl+Z)"
        >
          <UndoIcon />
        </button>
        <button
          className="btn btn--ghost"
          onClick={redo}
          disabled={!canRedo()}
          title="Làm lại (Ctrl+Y)"
        >
          <RedoIcon />
        </button>
        <div className="header__divider"></div>
        <button className="btn btn--primary" onClick={() => setShowExportModal(true)}>
          <DownloadIcon />
          Xuất ảnh
        </button>
      </div>
    </header>
  );
}
