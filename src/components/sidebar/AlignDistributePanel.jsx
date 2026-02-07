import useEditorStore from '../../store/editorStore';
import Panel from './Panel';

export default function AlignDistributePanel() {
  const { elements, alignElements, distributeElements } = useEditorStore();

  if (elements.length < 2) return null;

  return (
    <Panel title="Căn chỉnh & Phân bố" id="alignPanel" defaultOpen={false}>
      <div className="form-group">
        <label className="form-label">Căn chỉnh</label>
        <div className="align-buttons">
          <button className="align-btn" onClick={() => alignElements('left')} title="Căn trái">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="2" x2="4" y2="22" /><rect x="8" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('center')} title="Căn giữa ngang">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><rect x="4" y="6" width="16" height="4" rx="1" /><rect x="6" y="14" width="12" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('right')} title="Căn phải">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="20" y1="2" x2="20" y2="22" /><rect x="4" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('top')} title="Căn trên">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="4" x2="22" y2="4" /><rect x="6" y="8" width="4" height="12" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('middle')} title="Căn giữa dọc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="12" x2="22" y2="12" /><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="6" width="4" height="12" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('bottom')} title="Căn dưới">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="20" x2="22" y2="20" /><rect x="6" y="4" width="4" height="12" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" /></svg>
          </button>
        </div>
      </div>
      {elements.length >= 3 && (
        <div className="form-group">
          <label className="form-label">Phân bố đều</label>
          <div className="align-buttons">
            <button className="align-btn align-btn--wide" onClick={() => distributeElements('horizontal')} title="Phân bố ngang">Ngang</button>
            <button className="align-btn align-btn--wide" onClick={() => distributeElements('vertical')} title="Phân bố dọc">Dọc</button>
          </div>
        </div>
      )}
    </Panel>
  );
}
