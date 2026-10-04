// Tiny synthesized sound effects: no audio files to license or download.
let ctx: AudioContext | null = null;

// Must be called from a user tap (browsers block audio until then).
export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  void ctx.resume();
}

export function playPop() {
  if (!ctx) return;
  const len = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1200 + Math.random() * 800;
  const gain = ctx.createGain();
  gain.gain.value = 0.9;
  src.connect(filter).connect(gain).connect(ctx.destination);
  src.start();
}

export function playChime() {
  if (!ctx) return;
  const notes = [784, 988, 1175, 1568];
  notes.forEach((freq, i) => {
    const t = ctx!.currentTime + i * 0.11;
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(t);
    osc.stop(t + 1);
  });
}
