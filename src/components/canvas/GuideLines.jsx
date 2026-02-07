import useEditorStore from '../../store/editorStore';

export default function GuideLines({ guides }) {
  const { removeGuide } = useEditorStore();
  return guides.map((guide) => (
    <div
      key={guide.id}
      className={`guide-line guide-line--${guide.orientation}`}
      style={guide.orientation === 'vertical'
        ? { left: guide.position, top: 0, width: 1, height: '100%' }
        : { top: guide.position, left: 0, height: 1, width: '100%' }
      }
      onDoubleClick={() => removeGuide(guide.id)}
      title="Double-click để xóa guide"
    />
  ));
}
