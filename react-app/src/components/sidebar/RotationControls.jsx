import useEditorStore from '../../store/editorStore';

export default function RotationControls({ elementId, rotation = 0 }) {
  const { updateElement, updateElementWithHistory } = useEditorStore();
  return (
    <div className="form-group">
      <label className="form-label">Xoay</label>
      <input
        type="range"
        min="0"
        max="360"
        value={rotation}
        onChange={(e) => updateElement(elementId, { rotation: parseInt(e.target.value) })}
        onMouseUp={() => updateElementWithHistory(elementId, { rotation })}
      />
      <span className="range-value">{rotation}°</span>
      <div className="rotation-quick-buttons">
        {[0, 90, 180, 270].map((deg) => (
          <button
            key={deg}
            className={`rotation-quick-btn ${rotation === deg ? 'active' : ''}`}
            onClick={() => updateElementWithHistory(elementId, { rotation: deg })}
          >
            {deg}°
          </button>
        ))}
      </div>
    </div>
  );
}
