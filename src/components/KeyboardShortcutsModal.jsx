import useEditorStore from '../store/editorStore';

const shortcuts = [
  { category: 'Chung', items: [
    { keys: 'Ctrl + Z', description: 'Hoàn tác' },
    { keys: 'Ctrl + Y', description: 'Làm lại' },
    { keys: 'Ctrl + Shift + Z', description: 'Làm lại' },
    { keys: 'Ctrl + S', description: 'Lưu dự án' },
    { keys: 'Ctrl + R', description: 'Hiện/ẩn rulers' },
    { keys: 'Ctrl + /', description: 'Hiện/ẩn phím tắt' },
  ]},
  { category: 'Phần tử', items: [
    { keys: 'Ctrl + C', description: 'Sao chép' },
    { keys: 'Ctrl + V', description: 'Dán' },
    { keys: 'Ctrl + D', description: 'Nhân đôi' },
    { keys: 'Delete', description: 'Xóa phần tử' },
    { keys: 'Ctrl + G', description: 'Nhóm phần tử' },
  ]},
  { category: 'Di chuyển', items: [
    { keys: '\u2190 \u2191 \u2192 \u2193', description: 'Dịch chuyển 1px' },
    { keys: 'Shift + Arrow', description: 'Dịch chuyển 10px' },
  ]},
];

export default function KeyboardShortcutsModal() {
  const { showShortcutsModal, setShowShortcutsModal } = useEditorStore();

  if (!showShortcutsModal) return null;

  return (
    <div className="modal-overlay" onClick={() => setShowShortcutsModal(false)}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-modal__header">
          <h2>Phím tắt</h2>
          <button className="btn btn--ghost btn--sm" onClick={() => setShowShortcutsModal(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="shortcuts-modal__body">
          {shortcuts.map((section) => (
            <div key={section.category} className="shortcuts-section">
              <h3 className="shortcuts-section__title">{section.category}</h3>
              {section.items.map((item, i) => (
                <div key={i} className="shortcut-item">
                  <span className="shortcut-item__desc">{item.description}</span>
                  <kbd className="shortcut-item__keys">{item.keys}</kbd>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
