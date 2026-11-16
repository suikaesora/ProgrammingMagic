// 認定部：認定証（1枚の画像）＋ハッピーな演出＋スクショのすすめ
import { config } from '../../content/config.js';
import { store } from '../core/storage.js';
import { allCleared } from '../core/progress.js';
import { simpleHeader } from '../ui/header.js';
import { confetti } from '../ui/confetti.js';
import { go } from '../router.js';

export function mount(root) {
  if (!allCleared()) {
    go('#/home');
    return;
  }
  const first = !store.get().certSeen;
  store.update((s) => { s.certSeen = true; });
  const avatar = config.avatars.find((a) => a.id === store.get().avatar) || config.avatars[0];
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  root.appendChild(simpleHeader('認定'));
  const main = document.createElement('main');
  main.className = 'cert';
  main.innerHTML = `
    <p class="cert-lead">${first ? '全ての修行を終えたあなたに……' : 'あなたの認定証'}</p>
    <h1 class="cert-title">おめでとう！</h1>
    <div class="cert-stage">
      <img class="cert-side cert-master" src="${config.master.image}" alt="">
      <figure class="cert-frame">
        <img class="cert-img" src="${config.certificateImage}" alt="認定証">
      </figure>
      <img class="cert-side cert-avatar" src="${avatar.image}" alt="">
    </div>
    <div class="cert-shot card">
      <strong>📸 スクリーンショットを撮って記念に残そう！</strong>
      <span class="muted">${isMac
        ? '<kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>4</kbd> で範囲を選んで撮影'
        : '<kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> で範囲を選んで撮影'}</span>
    </div>
    <div class="cert-actions">
      <button type="button" class="btn" data-act="again">🎉 もう一度お祝い</button>
      <a class="btn" href="#/epilogue">📖 物語をもう一度</a>
      <a class="btn" href="#/deco">🎀 装飾部屋へ</a>
      <a class="btn btn-primary" href="#/home">修行選択へ</a>
    </div>`;
  root.appendChild(main);

  let stop = confetti({ count: first ? 260 : 160, duration: first ? 6500 : 4500 });
  main.querySelector('[data-act="again"]').addEventListener('click', () => {
    stop();
    stop = confetti({ count: 200, duration: 5000 });
    main.querySelectorAll('.cert-side').forEach((el) => {
      el.classList.remove('is-jump');
      void el.offsetWidth;
      el.classList.add('is-jump');
    });
  });

  return () => stop();
}
