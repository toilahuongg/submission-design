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

export default function PropertiesSidebar() {
  return (
    <aside className="sidebar sidebar--right">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Thuộc tính</h2>
      </div>
      <div className="sidebar__content">
        <BackgroundPanel />
        <DevicePanel />
        <ScreenshotPanel />
        <TextPanel />
        <ShapesPanel />
        <ImagesPanel />
        <IconsPanel />
        <AnnotationsPanel />
        <AlignDistributePanel />
        <LayersPanel />
      </div>
    </aside>
  );
}
