export default function SnapLines({ lines }) {
  if (!lines || lines.length === 0) return null;
  return lines.map((line, i) => (
    <div
      key={i}
      className="snap-line"
      style={line.orientation === 'vertical'
        ? { left: line.position, top: 0, width: 1, height: '100%' }
        : { top: line.position, left: 0, height: 1, width: '100%' }
      }
    />
  ));
}
