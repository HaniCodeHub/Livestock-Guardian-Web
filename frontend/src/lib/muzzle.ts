// Lightweight perceptual hash used to simulate muzzle biometric matching client-side.
// Produces a deterministic 32-char hex fingerprint from an image.
export async function computeMuzzleHash(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 16;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const grays: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    grays.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  const avg = grays.reduce((a, b) => a + b, 0) / grays.length;
  let bits = "";
  for (const g of grays) bits += g > avg ? "1" : "0";
  // pack 256 bits to 64 hex chars, take 32 for compactness
  let hex = "";
  for (let i = 0; i < bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return hex.slice(0, 32);
}

export function hammingSimilarity(a: string, b: string): number {
  if (a.length !== b.length) return 0;
  let same = 0;
  for (let i = 0; i < a.length; i++) {
    const x = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    // bits matching in this nibble
    let diff = 0;
    let v = x;
    while (v) { diff += v & 1; v >>= 1; }
    same += 4 - diff;
  }
  return same / (a.length * 4);
}
