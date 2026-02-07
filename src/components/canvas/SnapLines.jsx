export default function SnapLines({ lines, measurements }) {
  return (
    <>
      {lines?.map((line, i) => {
        const isV = line.orientation === 'vertical';
        const bounded = line.from != null;
        const style = isV
          ? { left: line.position, top: bounded ? line.from : 0, width: 1, height: bounded ? (line.to - line.from) : '100%' }
          : { top: line.position, left: bounded ? line.from : 0, height: 1, width: bounded ? (line.to - line.from) : '100%' };

        return <div key={`s-${i}`} className="snap-line" style={style} />;
      })}

      {measurements?.map((m, i) => {
        const len = m.end - m.start;
        if (len <= 0) return null;

        const isH = m.orientation === 'horizontal';
        const eqClass = m.equal ? ' distance-measurement--equal' : '';
        const style = isH
          ? { left: m.start, top: m.offset, width: len, height: 0 }
          : { left: m.offset, top: m.start, width: 0, height: len };

        return (
          <div key={`m-${i}`} className={`distance-measurement ${isH ? 'distance-measurement--h' : 'distance-measurement--v'}${eqClass}`} style={style}>
            <div className="distance-line" />
            <div className="distance-cap distance-cap--start" />
            <div className="distance-cap distance-cap--end" />
            <div className="distance-label">{m.value}</div>
          </div>
        );
      })}
    </>
  );
}
