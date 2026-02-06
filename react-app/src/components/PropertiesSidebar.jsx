import useEditorStore from '../store/editorStore';
import {
  BackgroundPanel,
  DevicePanel,
  ScreenshotPanel,
  TextPanel,
  ShapesPanel,
  ImagesPanel,
  IconsPanel,
  AnnotationsPanel,
  AlignDistributePanel,
  LayersPanel,
} from './sidebar';

const CONTEXT_TITLES = {
  text: 'Văn bản',
  shape: 'Hình dạng',
  device: 'Thiết bị',
  image: 'Hình ảnh',
  icon: 'Biểu tượng',
  annotation: 'Chú thích',
  multi: 'Nhiều phần tử',
  canvas: 'Canvas',
};

export default function PropertiesSidebar() {
  const elements = useEditorStore((s) => s.elements);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectedElementIds = useEditorStore((s) => s.selectedElementIds);

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const isMultiSelect = selectedElementIds.length > 1;
  const elementType = selectedElement?.type || null;

  let contextTitle = CONTEXT_TITLES.canvas;
  if (isMultiSelect) {
    contextTitle = CONTEXT_TITLES.multi;
  } else if (elementType) {
    contextTitle = CONTEXT_TITLES[elementType] || CONTEXT_TITLES.canvas;
  }

  return (
    <aside className="sidebar sidebar--right">
      <div className="sidebar__header">
        <h2 className="sidebar__title">{contextTitle}</h2>
      </div>
      <div className="sidebar__content">
        {isMultiSelect ? (
          <AlignDistributePanel />
        ) : elementType === 'text' ? (
          <TextPanel />
        ) : elementType === 'shape' ? (
          <ShapesPanel />
        ) : elementType === 'device' ? (
          <>
            <DevicePanel />
            <ScreenshotPanel />
          </>
        ) : elementType === 'image' ? (
          <ImagesPanel />
        ) : elementType === 'icon' ? (
          <IconsPanel />
        ) : elementType === 'annotation' ? (
          <AnnotationsPanel />
        ) : (
          <>
            <BackgroundPanel />
            <p className="sidebar__hint">Chọn một phần tử trên canvas để chỉnh sửa thuộc tính.</p>
          </>
        )}
        <LayersPanel />
      </div>
    </aside>
  );
}
