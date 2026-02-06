import useEditorStore from '../../store/editorStore';

const RULER_HORIZONTAL_HEIGHT = 24;
const RULER_VERTICAL_WIDTH = 30;

export default function Rulers({ zoom }) {
  const canvasWidth = 1600;
  const canvasHeight = 900;

  const renderTicks = (length, orientation) => {
    const ticks = [];
    const step = 50;
    const size = orientation === 'horizontal' ? RULER_HORIZONTAL_HEIGHT : RULER_VERTICAL_WIDTH;
    for (let i = 0; i <= length; i += step) {
      const isMajor = i % 100 === 0;
      ticks.push(
        <div
          key={i}
          className={`ruler-tick ${isMajor ? 'ruler-tick--major' : ''}`}
          style={orientation === 'horizontal'
            ? { left: i * zoom, height: isMajor ? size : size / 2 }
            : { top: i * zoom, width: isMajor ? size : size / 2 }
          }
        >
          {isMajor && <span className="ruler-label">{i}</span>}
        </div>
      );
    }
    return ticks;
  };

  const { addGuide } = useEditorStore();

  return (
    <>
      <div
        className="ruler ruler--horizontal"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / zoom;
          addGuide('vertical', Math.round(pos));
        }}
      >
        {renderTicks(canvasWidth, 'horizontal')}
      </div>
      <div
        className="ruler ruler--vertical"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientY - rect.top) / zoom;
          addGuide('horizontal', Math.round(pos));
        }}
      >
        {renderTicks(canvasHeight, 'vertical')}
      </div>
      <div className="ruler-corner" />
    </>
  );
}
