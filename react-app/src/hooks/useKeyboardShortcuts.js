import { useEffect } from 'react';
import useEditorStore from '../store/editorStore';

export default function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
      const state = useEditorStore.getState();
      const hasSelection = state.selectedElementIds.length > 0;

      // Undo/Redo work everywhere
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (!isInInput) {
          e.preventDefault();
          if (e.shiftKey) {
            state.redo();
          } else {
            state.undo();
          }
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        if (!isInInput) {
          e.preventDefault();
          state.redo();
        }
        return;
      }

      // Select all (Ctrl+A)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        if (!isInInput) {
          e.preventDefault();
          state.selectAllElements();
        }
        return;
      }

      // Copy/Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (!isInInput && hasSelection) {
          e.preventDefault();
          state.copyElement();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (!isInInput && state.clipboard) {
          e.preventDefault();
          state.pasteElement();
        }
        return;
      }

      // Duplicate (Ctrl+D)
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        if (!isInInput && hasSelection) {
          e.preventDefault();
          state.duplicateElement();
        }
        return;
      }

      // Save project (Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        state.saveProject();
        return;
      }

      // Toggle rulers (Ctrl+R)
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        if (!isInInput) {
          e.preventDefault();
          state.setShowRulers(!state.showRulers);
        }
        return;
      }

      // Ungroup (Ctrl+Shift+G) - must check before Ctrl+G
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G') {
        if (!isInInput && hasSelection) {
          e.preventDefault();
          const group = state.getGroupForElement(state.selectedElementIds[0]);
          if (group) {
            state.ungroupElements(group.id);
          }
        }
        return;
      }

      // Group selected elements (Ctrl+G)
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        if (!isInInput && state.selectedElementIds.length >= 2) {
          e.preventDefault();
          state.groupElements([...state.selectedElementIds]);
        }
        return;
      }

      // Keyboard shortcuts modal (Ctrl+/)
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        state.setShowShortcutsModal(!state.showShortcutsModal);
        return;
      }

      // Arrow key nudge
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && hasSelection && !isInInput) {
        e.preventDefault();
        const amount = e.shiftKey ? 10 : 1;
        const direction = {
          ArrowLeft: 'left',
          ArrowRight: 'right',
          ArrowUp: 'up',
          ArrowDown: 'down'
        }[e.key];
        state.nudgeElement(direction, amount);
        return;
      }

      // Delete selected elements (not when editing text)
      if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection && !isInInput) {
        state.deleteSelectedElements();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
