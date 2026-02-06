import useEditorStore from '../store/editorStore';

export default function Toast() {
  const { toast } = useEditorStore();

  return (
    <div className={`toast ${toast ? 'show' : ''}`}>
      <span className="toast__message">{toast}</span>
    </div>
  );
}
