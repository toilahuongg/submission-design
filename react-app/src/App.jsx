import { useEffect, useRef } from 'react';
import useEditorStore from './store/editorStore';
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import Header from './components/Header';
import ToolbarSidebar from './components/ToolbarSidebar';
import ToolPanel from './components/ToolPanel';
import PropertiesSidebar from './components/PropertiesSidebar';
import Canvas from './components/Canvas';
import ExportModal from './components/ExportModal';
import Toast from './components/Toast';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import ContextMenu from './components/canvas/ContextMenu';

function App() {
  const initRef = useRef(false);
  const showPropertiesSidebar = useEditorStore((state) => state.showPropertiesSidebar);

  // Init: load auto-save and save initial state (runs once)
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const { loadAutoSave, saveState } = useEditorStore.getState();
    loadAutoSave();
    saveState();
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const { historyIndex } = useEditorStore.getState();
      if (historyIndex > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="workspace">
        <ToolbarSidebar />
        <ToolPanel />
        <Canvas />
        {showPropertiesSidebar && <PropertiesSidebar />}
      </div>
      <ExportModal />
      <Toast />
      <KeyboardShortcutsModal />
      <ContextMenu />
    </div>
  );
}

export default App;
