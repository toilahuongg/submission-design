import { useState } from 'react';
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

const ChevronIcon = ({ open }) => (
  <svg
    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function SidebarSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="sidebar-section">
      <button
        className={`sidebar-section__header ${open ? 'sidebar-section__header--open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="sidebar-section__body">{children}</div>}
    </div>
  );
}

export default function PropertiesSidebar() {
  return (
    <aside className="sidebar sidebar--right">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Thuộc tính</h2>
      </div>
      <div className="sidebar__content">
        <SidebarSection title="Canvas" defaultOpen>
          <BackgroundPanel />
          <DevicePanel />
          <ScreenshotPanel />
        </SidebarSection>
        <SidebarSection title="Phần tử">
          <TextPanel />
          <ShapesPanel />
          <ImagesPanel />
          <IconsPanel />
          <AnnotationsPanel />
        </SidebarSection>
        <SidebarSection title="Sắp xếp" defaultOpen>
          <AlignDistributePanel />
          <LayersPanel />
        </SidebarSection>
      </div>
    </aside>
  );
}
