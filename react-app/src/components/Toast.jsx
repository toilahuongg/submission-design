import useEditorStore from '../store/editorStore';

const typeConfig = {
  info: { color: '#5C6AC4', icon: '\u2139' },
  success: { color: '#008060', icon: '\u2713' },
  warning: { color: '#F49342', icon: '\u26A0' },
  error: { color: '#BF0711', icon: '\u2717' },
};

export default function Toast() {
  const { toast } = useEditorStore();

  if (!toast) return <div className="toast"><span className="toast__message"></span></div>;

  const message = typeof toast === 'string' ? toast : toast.message;
  const type = (typeof toast === 'object' && toast.type) || 'info';
  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={`toast show toast--${type}`} style={{ borderLeftColor: config.color }}>
      <span className="toast__icon" style={{ color: config.color }}>{config.icon}</span>
      <span className="toast__message">{message}</span>
    </div>
  );
}
