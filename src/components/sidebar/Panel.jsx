import { useState, useCallback } from 'react';
import { ChevronIcon } from '../icons/SidebarIcons';

export default function Panel({ title, id, children, defaultOpen = true, autoExpand = false }) {
  const [manualCollapsed, setManualCollapsed] = useState(defaultOpen ? null : true);

  // autoExpand overrides collapsed state; manual toggle takes priority once set
  const collapsed = autoExpand ? false : (manualCollapsed ?? !defaultOpen);

  const toggle = useCallback(() => {
    setManualCollapsed((prev) => {
      const current = autoExpand ? false : (prev ?? !defaultOpen);
      return !current;
    });
  }, [autoExpand, defaultOpen]);

  return (
    <section className="panel">
      <div className="panel__header" onClick={toggle}>
        <h3 className="panel__title">{title}</h3>
        <ChevronIcon collapsed={collapsed} />
      </div>
      <div className={`panel__body ${collapsed ? 'collapsed' : ''}`} id={id}>
        {children}
      </div>
    </section>
  );
}
