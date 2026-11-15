// 画面内のダイアログ（ブラウザ標準の confirm は使わない）
import { escapeHtml } from '../core/format.js';

export function confirmModal(message, { ok = 'OK', cancel = 'やめる', danger = false } = {}) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-backdrop';
    wrap.innerHTML = `
      <div class="modal card" role="dialog" aria-modal="true">
        <p class="modal-msg">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <div class="modal-actions">
          <button type="button" class="btn" data-v="0">${escapeHtml(cancel)}</button>
          <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-v="1">${escapeHtml(ok)}</button>
        </div>
      </div>`;
    const close = (v) => {
      wrap.remove();
      document.removeEventListener('keydown', onKey);
      resolve(v);
    };
    const onKey = (e) => { if (e.key === 'Escape') close(false); };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) close(false);
      const b = e.target.closest('[data-v]');
      if (b) close(b.dataset.v === '1');
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    wrap.querySelector('[data-v="1"]').focus();
  });
}
