// 画面間のゆるいイベント連絡（練習部の手順進行などで使う）
const target = new EventTarget();

export const bus = {
  emit(name, detail) { target.dispatchEvent(new CustomEvent(name, { detail })); },
  on(name, fn) {
    const h = (e) => fn(e.detail);
    target.addEventListener(name, h);
    return () => target.removeEventListener(name, h);
  },
};
