import { useState, useEffect, useCallback, useRef } from 'react';
import useEditorStore from '../../store/editorStore';

const MenuIcon = ({ type }) => {
  const icons = {
    duplicate: <path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v2M10 2h4l4 4v8a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    paste: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    front: <><path d="M2 2h8v8H2z" opacity="0.3"/><path d="M14 14h8v8h-8z"/><path d="M6 14h8v-4h4V6h-8v4H6z"/></>,
    back: <><path d="M14 14h8v8h-8z" opacity="0.3"/><path d="M2 2h8v8H2z"/><path d="M6 14h8v-4h4V6h-8v4H6z"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    unlock: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>,
    show: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    hide: <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>,
    group: <><rect x="1" y="1" width="10" height="10" rx="2"/><rect x="13" y="13" width="10" height="10" rx="2"/><path d="M11 6h2m-2 12h2M6 11v2m12-2v2"/></>,
    ungroup: <><rect x="1" y="1" width="10" height="10" rx="2"/><rect x="13" y="13" width="10" height="10" rx="2"/></>,
    delete: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14H7L5 6m5 0V4h4v2"/></>,
  };
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
      {icons[type]}
    </svg>
  );
};

export default function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const {
    selectedElementIds, selectedElementId, elements, clipboard,
    duplicateElement, copyElement, pasteElement,
    bringToFront, sendToBack, toggleElementLock,
    toggleElementVisibility, deleteSelectedElements,
    groupElements, ungroupElements, getGroupForElement
  } = useEditorStore();

  const hasSelection = selectedElementIds.length > 0;
  const selectedElement = elements.find(el => el.id === selectedElementId);

  const handleContextMenu = useCallback((e) => {
    const canvas = document.getElementById('canvas');
    if (!canvas || !canvas.contains(e.target)) {
      setVisible(false);
      return;
    }
    e.preventDefault();

    // Boundary detection - flip position if menu would overflow
    const menuW = 220;
    const menuH = 320;
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuW > window.innerWidth) x = window.innerWidth - menuW - 8;
    if (y + menuH > window.innerHeight) y = window.innerHeight - menuH - 8;
    if (x < 0) x = 8;
    if (y < 0) y = 8;

    setPosition({ x, y });
    setVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [handleContextMenu, handleClick]);

  if (!visible) return null;

  const menuItems = [];

  if (hasSelection) {
    menuItems.push(
      { label: 'Nhân đôi', shortcut: 'Ctrl+D', action: duplicateElement, icon: 'duplicate' },
      { label: 'Sao chép', shortcut: 'Ctrl+C', action: copyElement, icon: 'copy' },
    );
  }

  if (clipboard) {
    menuItems.push({ label: 'Dán', shortcut: 'Ctrl+V', action: pasteElement, icon: 'paste' });
  }

  if (hasSelection) {
    menuItems.push(
      { divider: true },
      { label: 'Đưa lên trên cùng', action: () => bringToFront(selectedElementId), icon: 'front' },
      { label: 'Đưa xuống dưới cùng', action: () => sendToBack(selectedElementId), icon: 'back' },
      { divider: true },
      {
        label: selectedElement?.locked ? 'Mở khóa' : 'Khóa',
        action: () => toggleElementLock(selectedElementId),
        icon: selectedElement?.locked ? 'unlock' : 'lock',
      },
      {
        label: selectedElement?.visible === false ? 'Hiện' : 'Ẩn',
        action: () => toggleElementVisibility(selectedElementId),
        icon: selectedElement?.visible === false ? 'show' : 'hide',
      },
    );

    // Group/Ungroup
    const group = selectedElementId ? getGroupForElement(selectedElementId) : null;
    if (selectedElementIds.length >= 2) {
      menuItems.push({ divider: true });
      menuItems.push({ label: 'Nhóm', shortcut: 'Ctrl+G', action: () => groupElements([...selectedElementIds]), icon: 'group' });
    }
    if (group) {
      if (selectedElementIds.length < 2) menuItems.push({ divider: true });
      menuItems.push({ label: 'Bỏ nhóm', shortcut: 'Ctrl+Shift+G', action: () => ungroupElements(group.id), icon: 'ungroup' });
    }

    menuItems.push(
      { divider: true },
      { label: 'Xóa', shortcut: 'Del', action: deleteSelectedElements, danger: true, icon: 'delete' },
    );
  }

  if (menuItems.length === 0) return null;

  return (
    <div className="context-menu" ref={menuRef} style={{ left: position.x, top: position.y }}>
      {menuItems.map((item, i) =>
        item.divider ? (
          <div key={i} className="context-menu__divider" />
        ) : (
          <button
            key={i}
            className={`context-menu__item ${item.danger ? 'context-menu__item--danger' : ''}`}
            onClick={(e) => { e.stopPropagation(); item.action(); setVisible(false); }}
          >
            <span className="context-menu__item-left">
              {item.icon && <MenuIcon type={item.icon} />}
              <span>{item.label}</span>
            </span>
            {item.shortcut && <span className="context-menu__shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}
