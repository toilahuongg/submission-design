import { useRef, useCallback } from 'react';
import useEditorStore from '../store/editorStore';

const typeConfig = {
  info: {
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 9v4M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  success: {
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 10l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  warning: {
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L18.66 17H1.34L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 8v4M10 14v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  error: {
    bg: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

export default function Toast() {
  const { toast, hideToast } = useEditorStore();
  const toastRef = useRef(null);

  const handleHide = useCallback(() => {
    const el = toastRef.current;
    if (!el) { hideToast(); return; }
    el.classList.add('hiding');
    el.classList.remove('show');
    el.addEventListener('transitionend', () => hideToast(), { once: true });
    // Fallback in case transitionend doesn't fire
    setTimeout(() => hideToast(), 350);
  }, [hideToast]);

  if (!toast) return null;

  const message = typeof toast === 'string' ? toast : toast.message;
  const type = (typeof toast === 'object' && toast.type) || 'info';
  const config = typeConfig[type] || typeConfig.info;

  return (
    <div ref={toastRef} className={`toast show toast--${type}`}>
      <div className="toast__glow" style={{ background: config.bg }} />
      <div className="toast__content">
        <span className="toast__icon">{config.icon}</span>
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={handleHide} aria-label="Dismiss">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="toast__progress" style={{ background: config.bg }} />
    </div>
  );
}
