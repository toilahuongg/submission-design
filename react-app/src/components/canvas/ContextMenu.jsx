import { useState, useEffect, useCallback } from 'react';
import useEditorStore from '../../store/editorStore';

export default function ContextMenu() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    setPosition({ x: e.clientX, y: e.clientY });
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
      { label: 'Nhân đôi', shortcut: 'Ctrl+D', action: duplicateElement },
      { label: 'Sao chép', shortcut: 'Ctrl+C', action: copyElement },
    );
  }

  if (clipboard) {
    menuItems.push({ label: 'Dán', shortcut: 'Ctrl+V', action: pasteElement });
  }

  if (hasSelection) {
    menuItems.push(
      { divider: true },
      { label: 'Đưa lên trên cùng', action: () => bringToFront(selectedElementId) },
      { label: 'Đưa xuống dưới cùng', action: () => sendToBack(selectedElementId) },
      { divider: true },
      {
        label: selectedElement?.locked ? 'Mở khóa' : 'Khóa',
        action: () => toggleElementLock(selectedElementId)
      },
      {
        label: selectedElement?.visible === false ? 'Hiện' : 'Ẩn',
        action: () => toggleElementVisibility(selectedElementId)
      },
    );

    // Group/Ungroup
    const group = selectedElementId ? getGroupForElement(selectedElementId) : null;
    if (selectedElementIds.length >= 2) {
      menuItems.push({ divider: true });
      menuItems.push({ label: 'Nhóm', shortcut: 'Ctrl+G', action: () => groupElements([...selectedElementIds]) });
    }
    if (group) {
      if (selectedElementIds.length < 2) menuItems.push({ divider: true });
      menuItems.push({ label: 'Bỏ nhóm', shortcut: 'Ctrl+Shift+G', action: () => ungroupElements(group.id) });
    }

    menuItems.push(
      { divider: true },
      { label: 'Xóa', shortcut: 'Del', action: deleteSelectedElements, danger: true },
    );
  }

  if (menuItems.length === 0) return null;

  return (
    <div className="context-menu" style={{ left: position.x, top: position.y }}>
      {menuItems.map((item, i) =>
        item.divider ? (
          <div key={i} className="context-menu__divider" />
        ) : (
          <button
            key={i}
            className={`context-menu__item ${item.danger ? 'context-menu__item--danger' : ''}`}
            onClick={(e) => { e.stopPropagation(); item.action(); setVisible(false); }}
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="context-menu__shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}
