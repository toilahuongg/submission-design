import { useEffect, useRef } from 'react';
import useEditorStore from './store/editorStore';
import Header from './components/Header';

import PropertiesSidebar from './components/PropertiesSidebar';
import Canvas from './components/Canvas';
import ExportModal from './components/ExportModal';
import Toast from './components/Toast';

function App() {
  const initRef = useRef(false);
  const showPropertiesSidebar = useEditorStore((state) => state.showPropertiesSidebar);

  // Init: load auto-save and save initial state (runs once)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const { loadAutoSave, saveState } = useEditorStore.getState();
    const loaded = loadAutoSave();
    if (!loaded) {
      saveState();
    } else {
      saveState();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;
      const state = useEditorStore.getState();

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

      // Copy/Paste: skip when in input fields to allow native behavior
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (!isInInput && state.selectedElementId) {
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

      // Group selected elements (Ctrl+G)
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        if (!isInInput) {
          e.preventDefault();
          if (state.elements.length >= 2) {
            state.groupElements(state.elements.map(el => el.id));
          }
        }
        return;
      }

      // Delete selected element (not when editing text)
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElementId && !isInInput) {
        state.deleteElement(state.selectedElementId);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="workspace">
        {/* <TemplateSidebar /> - Removed */}
        <Canvas />
        {showPropertiesSidebar && <PropertiesSidebar />}
      </div>
      <ExportModal />
      <Toast />
    </div>
  );
}

export default App;
