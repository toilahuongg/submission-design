import useEditorStore from '../../store/editorStore';
import { RectIcon, UploadIcon, LayersIcon, LockIcon, UnlockIcon, EyeIcon, EyeOffIcon } from '../icons/SidebarIcons';
import Panel from './Panel';

export default function LayersPanel() {
  const {
    elements, selectedElementIds, selectElement, toggleSelectElement, deleteElement,
    bringToFront, sendToBack, moveLayerUp, moveLayerDown,
    toggleElementLock, toggleElementVisibility,
    groups, groupElements, ungroupElements
  } = useEditorStore();

  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (element) => {
    switch (element.type) {
      case 'text': return 'T';
      case 'shape': return <RectIcon />;
      case 'image': return <UploadIcon />;
      case 'annotation': return <LayersIcon />;
      case 'icon': return '\u2605';
      case 'device': return '\u25A1';
      default: return '?';
    }
  };

  const getElementLabel = (element) => {
    switch (element.type) {
      case 'text': return element.content?.substring(0, 15) || 'Văn bản';
      case 'shape': return element.shapeType === 'rectangle' ? 'Hình CN' :
        element.shapeType === 'circle' ? 'Hình tròn' :
          element.shapeType === 'arrow' ? 'Mũi tên' : 'Badge';
      case 'image': return 'Hình ảnh';
      case 'annotation': return element.annotationType === 'callout' ? 'Callout' :
        element.annotationType === 'numbered-circle' ? `Số ${element.number}` : 'Highlight';
      case 'icon': return element.name || 'Biểu tượng';
      case 'device': return element.deviceType || 'Thiết bị';
      default: return 'Element';
    }
  };

  const handleLayerClick = (e, elementId) => {
    if (e.shiftKey || e.ctrlKey || e.metaKey) {
      toggleSelectElement(elementId);
    } else {
      selectElement(elementId);
    }
  };

  // Build a map of elementId -> group for rendering
  const elementGroupMap = {};
  groups.forEach(group => {
    group.elementIds.forEach(eid => {
      elementGroupMap[eid] = group;
    });
  });

  // Get unique groups in order of first appearance in sorted elements
  const renderedGroups = new Set();

  if (elements.length === 0) {
    return (
      <Panel title="Lớp" id="layersPanel" defaultOpen={false}>
        <div className="empty-state">
          <LayersIcon />
          <span>Chưa có phần tử nào</span>
        </div>
      </Panel>
    );
  }

  const firstSelectedId = selectedElementIds[0] || null;
  const firstSelectedGroup = firstSelectedId ? (elementGroupMap[firstSelectedId] || null) : null;

  return (
    <Panel title="Lớp" id="layersPanel" defaultOpen={false}>
      <div className="layers-list">
        {sortedElements.map((element) => {
          const group = elementGroupMap[element.id];
          const isGrouped = !!group;
          let groupHeader = null;

          if (isGrouped && !renderedGroups.has(group.id)) {
            renderedGroups.add(group.id);
            groupHeader = (
              <div key={`gh-${group.id}`} className="layer-group-header">
                <span>{group.name}</span>
                <button
                  className="layer-btn"
                  onClick={() => ungroupElements(group.id)}
                  title="Bỏ nhóm"
                >
                  ×
                </button>
              </div>
            );
          }

          return [
            groupHeader,
            <div
              key={element.id}
              className={`layer-item ${selectedElementIds.includes(element.id) ? 'active' : ''} ${element.visible === false ? 'layer-item--hidden' : ''} ${isGrouped ? 'layer-item--grouped' : ''}`}
              onClick={(e) => handleLayerClick(e, element.id)}
            >
              <div className="layer-item__icon">
                {getElementIcon(element)}
              </div>
              <span className="layer-item__name">{getElementLabel(element)}</span>
              <div className="layer-item__actions">
                {toggleElementVisibility && (
                  <button
                    className="layer-btn"
                    onClick={(e) => { e.stopPropagation(); toggleElementVisibility(element.id); }}
                    title={element.visible === false ? 'Hiện' : 'Ẩn'}
                  >
                    {element.visible === false ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                )}
                {toggleElementLock && (
                  <button
                    className="layer-btn"
                    onClick={(e) => { e.stopPropagation(); toggleElementLock(element.id); }}
                    title={element.locked ? 'Mở khóa' : 'Khóa'}
                  >
                    {element.locked ? <LockIcon /> : <UnlockIcon />}
                  </button>
                )}
                <button
                  className="layer-btn"
                  onClick={(e) => { e.stopPropagation(); moveLayerUp(element.id); }}
                  title="Lên trên"
                >
                  ↑
                </button>
                <button
                  className="layer-btn"
                  onClick={(e) => { e.stopPropagation(); moveLayerDown(element.id); }}
                  title="Xuống dưới"
                >
                  ↓
                </button>
                <button
                  className="layer-btn layer-btn--delete"
                  onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                  title="Xóa"
                >
                  ×
                </button>
              </div>
            </div>
          ];
        })}
      </div>

      {selectedElementIds.length > 0 && (
        <div className="layer-actions">
          <button className="btn btn--block btn--secondary" onClick={() => bringToFront(firstSelectedId)}>
            Đưa lên trên cùng
          </button>
          <button className="btn btn--block btn--secondary" onClick={() => sendToBack(firstSelectedId)}>
            Đưa xuống dưới cùng
          </button>
          {selectedElementIds.length >= 2 && (
            <button className="btn btn--block btn--primary" onClick={() => groupElements([...selectedElementIds])}>
              Nhóm
            </button>
          )}
          {firstSelectedGroup && (
            <button className="btn btn--block btn--secondary" onClick={() => ungroupElements(firstSelectedGroup.id)}>
              Bỏ nhóm
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}
