import { useState } from 'react';
import useEditorStore from '../../store/editorStore';

const AXES = [
  { key: 'rotateZ', label: 'Z', title: 'Xoay quanh trục Z (mặt phẳng)' },
  { key: 'rotateX', label: 'X', title: 'Xoay quanh trục X (lật dọc)' },
  { key: 'rotateY', label: 'Y', title: 'Xoay quanh trục Y (lật ngang)' },
];

export default function RotationControls({ elementId, rotation = 0, rotateX = 0, rotateY = 0, rotateZ }) {
  const { updateElement, updateElementWithHistory } = useEditorStore();
  const [activeAxis, setActiveAxis] = useState('rotateZ');

  // For backwards compatibility: use rotateZ if set, otherwise fall back to rotation
  const zValue = rotateZ !== undefined ? rotateZ : rotation;

  const values = {
    rotateZ: zValue,
    rotateX: rotateX,
    rotateY: rotateY,
  };

  const currentValue = values[activeAxis];

  const handleChange = (value) => {
    const updates = { [activeAxis]: value };
    // Also update legacy rotation field when changing Z
    if (activeAxis === 'rotateZ') {
      updates.rotation = value;
    }
    updateElement(elementId, updates);
  };

  const handleChangeEnd = (value) => {
    const updates = { [activeAxis]: value };
    if (activeAxis === 'rotateZ') {
      updates.rotation = value;
    }
    updateElementWithHistory(elementId, updates);
  };

  return (
    <div className="form-group">
      <label className="form-label">Xoay 3D</label>

      <div className="rotation-axis-tabs">
        {AXES.map((axis) => (
          <button
            key={axis.key}
            className={`rotation-axis-tab ${activeAxis === axis.key ? 'active' : ''}`}
            onClick={() => setActiveAxis(axis.key)}
            title={axis.title}
          >
            {axis.label}
          </button>
        ))}
      </div>

      <div className="rotation-slider-row">
        <input
          type="range"
          min="-180"
          max="180"
          value={currentValue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          onMouseUp={() => handleChangeEnd(currentValue)}
        />
        <span className="range-value">{currentValue}°</span>
      </div>

      <div className="rotation-quick-buttons">
        {[-90, 0, 90, 180].map((deg) => (
          <button
            key={deg}
            className={`rotation-quick-btn ${currentValue === deg ? 'active' : ''}`}
            onClick={() => handleChangeEnd(deg)}
          >
            {deg}°
          </button>
        ))}
      </div>
    </div>
  );
}
