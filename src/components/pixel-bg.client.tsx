"use client";
import React, { useEffect, useRef } from "react";

export default function PixelBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // narrow to non-null locals for use inside nested functions
    const canvasEl = canvas as HTMLCanvasElement;
    const ctxEl = ctx as CanvasRenderingContext2D;

    let raf = 0;
    const pixelSize = 4; // smaller visual pixels
    const gap = 3; // space between pixels
    const stride = pixelSize + gap;
    let cols = 0;
    let rows = 0;
    let t = 0; // seconds
    let densityMap: Float32Array | null = null;
    const seedA = Math.random() * 1000;
    const seedB = Math.random() * 1000;

    function resize() {
      const parent = canvasEl.parentElement;
      if (!parent) return;
      const w = Math.max(1, Math.floor(parent.clientWidth));
      const h = Math.max(1, Math.floor(parent.clientHeight));

      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;
      canvasEl.width = Math.floor(w * dpr);
      canvasEl.height = Math.floor(h * dpr);

      // keep drawing coordinates in CSS pixels
      ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(w / stride) + 1;
      rows = Math.ceil(h / stride) + 5; // add extra rows so more pixels appear at the top

      // build a low-frequency density map so some areas have fewer or no pixels
      densityMap = new Float32Array(cols * rows);
      for (let xi = 0; xi < cols; xi++) {
        const nx = xi / Math.max(1, cols - 1);
        for (let yi = 0; yi < rows; yi++) {
          const ny = yi / Math.max(1, rows - 1);

          // layered low-frequency waves produce blobs of density
          let v = 0.0;
          v += 0.55 * (0.5 + 0.5 * Math.sin(nx * 3.2 + ny * 1.6 + seedA));
          v += 0.3 * (0.5 + 0.5 * Math.cos(nx * 1.1 - ny * 2.2 + seedB));
          v += 0.15 * (0.5 + 0.5 * Math.sin((nx + ny) * 4.0 + seedA * 0.3));
          // bias slightly toward the top so there are more pixels near the top
          v += 0.12 * (1 - ny);
          // compress contrast so there are clear empty spots but avoid a single huge hole
          v = Math.pow(Math.max(0, Math.min(1, v / 1.0)), 1.25);
          densityMap[xi + yi * cols] = v;
        }
      }

      // small blur pass to smooth out harsh isolated holes (removes large round empty area)
      const tmp = new Float32Array(cols * rows);
      for (let xi = 0; xi < cols; xi++) {
        for (let yi = 0; yi < rows; yi++) {
          let sum = 0;
          let cnt = 0;
          for (let ox = -1; ox <= 1; ox++) {
            const nx = xi + ox;
            if (nx < 0 || nx >= cols) continue;
            for (let oy = -1; oy <= 1; oy++) {
              const ny = yi + oy;
              if (ny < 0 || ny >= rows) continue;
              sum += densityMap[nx + ny * cols];
              cnt++;
            }
          }
          tmp[xi + yi * cols] = sum / Math.max(1, cnt);
        }
      }
      // copy back and ensure a higher minimum so there are no fully blank islands
      for (let i = 0; i < tmp.length; i++) {
        densityMap[i] = Math.max(0.3, tmp[i]);
      }
    }

    resize();
    let ro: ResizeObserver | null = null;
    const parentEl = canvasEl.parentElement;
    if (parentEl) {
      ro = new ResizeObserver(resize);
      ro.observe(parentEl);
    }

    function frame(now?: number) {
      // now is high-res ms; convert to seconds and update t
      if (now) t = now / 1000;

      const parent = canvasEl.parentElement!;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      ctxEl.clearRect(0, 0, w, h);

      // single traveling wave (right -> left)
      const waveSpeed = 0.35; // how fast the wave travels across the box
      const freq = 1.0; // number of wave cycles across the width (keep ~1 for single wave)

      // draw grid of spaced pixels
      const offsetX = Math.max(0, (w - cols * stride + gap) / 2);
      // shift grid slightly upward so top rows have pixels visible during wave
      const topShift = Math.floor(stride * 1.8);
      const offsetY = Math.max(
        -stride * 3,
        Math.floor((h - rows * stride + gap) / 2) - topShift,
      );

      const baseAlpha = 0.48; // baseline pixel alpha (more transparent overall)
      const highlightStrength = 0.6; // extra alpha where the wave currently is
      const waveAmplitude = 12; // vertical displacement at wave peak (px)

      // smoother color gradient: purple -> deep blue -> cyan across X
      function colorFor(nx: number, ny: number) {
        // return numeric hue for pixel gradient (left ~ 270 (violet), middle ~ 220, right ~190)
        const a = Math.max(0, Math.min(1, nx));
        let hue: number;
        if (a < 0.5) {
          const tt = a / 0.5;
          hue = 270 + (220 - 270) * tt; // 270 -> 220
        } else {
          const tt = (a - 0.5) / 0.5;
          hue = 220 + (190 - 220) * tt; // 220 -> 190
        }
        return hue;
      }

      // draw grid of spaced pixels with vertical displacement per-pixel
      // phaseStart chosen so the wave crest starts at the right side of the box
      const phaseStart = 0.25 - freq; // sin(2π*(freq*1 + phaseStart)) == 1
      for (let xi = 0; xi < cols; xi++) {
        const x = xi * stride + offsetX;
        const nx = xi / Math.max(1, cols - 1);
        for (let yi = 0; yi < rows; yi++) {
          const y0 = yi * stride + offsetY; // base y position
          const ny = yi / Math.max(1, rows - 1);
          // read density (0..1) and ensure non-zero so no empty islands
          const density = densityMap ? densityMap[xi + yi * cols] : 1;

          // single-phase wave based on X only -> traveling right-to-left
          const phase = nx * freq + phaseStart - t * waveSpeed; // negative time makes wave go left
          const wave = Math.sin(phase * Math.PI * 2);
          const waveNorm = (wave + 1) / 2; // 0..1
          const smooth = waveNorm * waveNorm * (3 - 2 * waveNorm);
          // vertical displacement scaled by density so denser areas move more
          const dy = (smooth - 0.5) * 2 * waveAmplitude * density;

          // color fixed per pixel (gradient)
          const hue = colorFor(nx, ny);
          // baseline alpha is lower; add highlight where wave is present
          const alphaBase = baseAlpha * (0.35 + 0.65 * density); // ensure visible even at low density
          const alpha = Math.min(
            1,
            alphaBase + highlightStrength * smooth * density,
          );
          ctxEl.fillStyle = `hsla(${hue.toFixed(1)},86%,50%,${alpha.toFixed(3)})`;
          ctxEl.fillRect(x, y0 + dy, pixelSize, pixelSize);
        }
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={
        "absolute inset-0 z-0 rounded-[3rem] pointer-events-none overflow-hidden " +
        (className || "")
      }
      aria-hidden
    />
  );
}
