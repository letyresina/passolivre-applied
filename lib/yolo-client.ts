/**
 * PassoLivre — inferência YOLOv8 de três classes no navegador.
 * O modelo é o best.pt do repositório auditoria-calcadas-yolov8,
 * exportado para public/models/calcadas.onnx pelo GitHub Actions.
 * Nenhuma detecção é simulada: apenas predições retornadas pelo ONNX.
 */
export type Detection = {
  label: 'Buraco' | 'Desnível' | 'Piso tátil';
  score: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const SIZE = 512;
const LABELS: Detection['label'][] = ['Buraco', 'Desnível', 'Piso tátil'];
const RUNTIME = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
type OnnxTensor = { data: Float32Array | number[]; dims: readonly number[] };
type OnnxSession = {
  inputNames: string[];
  outputNames: string[];
  run: (feeds: Record<string, unknown>) => Promise<Record<string, OnnxTensor>>;
};
type OnnxRuntime = {
  env: { wasm: { wasmPaths: string; numThreads: number } };
  Tensor: new (type: 'float32', data: Float32Array, dims: number[]) => unknown;
  InferenceSession: {
    create: (model: string, opts: { executionProviders: string[] }) => Promise<OnnxSession>;
  };
};
declare global {
  interface Window { ort?: OnnxRuntime }
}
let sessionPromise: Promise<OnnxSession> | undefined;
let scriptPromise: Promise<OnnxRuntime> | undefined;

function loadRuntime(): Promise<OnnxRuntime> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Este recurso precisa de um navegador.'));
  if (window.ort) return Promise.resolve(window.ort);
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = RUNTIME + 'ort.min.js';
      script.async = true;
      script.onload = () => {
        if (!window.ort) { reject(new Error('Biblioteca de visão computacional indisponível.')); return; }
        window.ort.env.wasm.wasmPaths = RUNTIME;
        window.ort.env.wasm.numThreads = 1;
        resolve(window.ort);
      };
      script.onerror = () => reject(new Error('Não foi possível baixar a biblioteca de visão computacional. Verifique a internet.'));
      document.head.appendChild(script);
    }).catch(error => {
      scriptPromise = undefined;
      throw error;
    });
  }
  return scriptPromise;
}

async function getSession(): Promise<{ort: OnnxRuntime; session: OnnxSession}> {
  const ort = await loadRuntime();
  if (!sessionPromise) {
    sessionPromise = (async () => {
      const response = await fetch('/models/calcadas.onnx', { cache: 'force-cache' });
      if (!response.ok) throw new Error('Modelo ainda não publicado. Abra o GitHub Actions e execute "Preparar detector YOLOv8 para web".');
      return ort.InferenceSession.create('/models/calcadas.onnx', { executionProviders: ['wasm'] });
    })().catch(error => { sessionPromise = undefined; throw error; });
  }
  return {ort, session: await sessionPromise};
}

function getImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Não foi possível carregar esta imagem.'));
    img.src = source;
  });
}
function intersection(a: Detection, b: Detection): number {
  const x1 = Math.max(a.x, b.x), y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  const overlap = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a.width * a.height + b.width * b.height - overlap;
  return union > 0 ? overlap / union : 0;
}
function suppress(input: Detection[]): Detection[] {
  const chosen: Detection[] = [];
  for (const candidate of input.sort((a, b) => b.score - a.score)) {
    if (chosen.length >= 30) break;
    if (!chosen.some(d => d.label === candidate.label && intersection(d, candidate) > .45)) {
      chosen.push(candidate);
    }
  }
  return chosen;
}
export async function detectSidewalk(source: string): Promise<Detection[]> {
  const [img, {ort, session}] = await Promise.all([getImage(source), getSession()]);
  const ratio = Math.min(SIZE / img.naturalWidth, SIZE / img.naturalHeight);
  const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
  const offsetX = (SIZE - w) / 2, offsetY = (SIZE - h) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d', {willReadFrequently: true});
  if (!ctx) throw new Error('Seu navegador não suporta o processamento da imagem.');
  ctx.fillStyle = '#727272';
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(img, offsetX, offsetY, w, h);
  const rgba = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const plane = SIZE * SIZE;
  const pixels = new Float32Array(plane * 3);
  for (let i = 0; i < plane; i++) {
    pixels[i] = rgba[i * 4] / 255;
    pixels[i + plane] = rgba[i * 4 + 1] / 255;
    pixels[i + 2 * plane] = rgba[i * 4 + 2] / 255;
  }
  const input = new ort.Tensor('float32', pixels, [1, 3, SIZE, SIZE]);
  const outputs = await session.run({[session.inputNames[0]]: input});
  const out = outputs[session.outputNames[0]];
  if (!out || out.dims.length !== 3) throw new Error('Formato da saída do detector não reconhecido.');
  const dims = out.dims;
  const channelsFirst = dims[1] <= 10;
  const channels = channelsFirst ? dims[1] : dims[2];
  const count = channelsFirst ? dims[2] : dims[1];
  if (channels !== 7) throw new Error('O modelo não corresponde às três classes do PassoLivre.');
  const read = (row: number, channel: number) => Number(out.data[channelsFirst ? channel * count + row : row * channels + channel]);
  const proposals: Detection[] = [];
  for (let i = 0; i < count; i++) {
    let best = 0, id = 0;
    for (let c = 0; c < 3; c++) {
      const score = read(i, c + 4);
      if (score > best) { best = score; id = c; }
    }
    if (best < .25) continue;
    const cx = read(i, 0), cy = read(i, 1);
    const bw = read(i, 2), bh = read(i, 3);
    const left = Math.max(0, (cx - bw / 2 - offsetX) / ratio);
    const top = Math.max(0, (cy - bh / 2 - offsetY) / ratio);
    const right = Math.min(img.naturalWidth, (cx + bw / 2 - offsetX) / ratio);
    const bottom = Math.min(img.naturalHeight, (cy + bh / 2 - offsetY) / ratio);
    if (![left,top,right,bottom].every(Number.isFinite) || right <= left || bottom <= top) continue;
    proposals.push({label: LABELS[id], score: best, x: left, y: top, width: right - left, height: bottom - top});
  }
  return suppress(proposals);
}

export async function drawDetections(source: string, detections: Detection[]): Promise<string> {
  const img = await getImage(source);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return source;
  ctx.drawImage(img, 0, 0);
  const scale = Math.max(1, Math.min(canvas.width, canvas.height) / 512);
  const fontSize = Math.max(13, Math.round(16 * scale));
  ctx.lineWidth = Math.max(2, 3 * scale);
  ctx.font = '600 ' + fontSize + 'px Arial, sans-serif';
  for (const d of detections) {
    const color = d.label === 'Piso tátil' ? '#0F766E' : (d.label === 'Buraco' ? '#E11D48' : '#7C3AED');
    ctx.strokeStyle = color;
    ctx.strokeRect(d.x, d.y, d.width, d.height);
    const caption = d.label + ' ' + Math.round(d.score * 100) + '%';
    const textWidth = ctx.measureText(caption).width;
    const top = Math.max(fontSize + 6, d.y);
    ctx.fillStyle = color;
    ctx.fillRect(d.x, top - fontSize - 7, textWidth + 14, fontSize + 10);
    ctx.fillStyle = '#fff';
    ctx.fillText(caption, d.x + 7, top - 5);
  }
  return canvas.toDataURL('image/jpeg', .88);
}
