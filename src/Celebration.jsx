import { useEffect, useRef } from "react";

const COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#9334E6", "#12B5CB"];
const FLOWERS = ["🌸", "🌼", "🌺", "💐", "🌹"];
const MAX_PARTICLES = 220; // hard cap keeps phones smooth

/**
 * Lightweight celebration engine: confetti + glossy balls + flower rain.
 * Optimizations:
 *  - flower emojis are pre-rendered to cached bitmap sprites once
 *    (fillText per frame is expensive; drawImage is cheap)
 *  - fixed particle cap, oldest particles are recycled
 *  - canvas runs at CSS-pixel resolution (no costly HiDPI scaling)
 *  - rAF loop fully stops when no particles remain
 *  - animation pauses when the tab is hidden
 */
export default function Celebration({ fire }) {
  const canvasRef = useRef(null);
  const celebrateRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const sprites = FLOWERS.map((f) => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const g = c.getContext("2d");
      g.font = "52px serif";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(f, 32, 36);
      return c;
    });

    let parts = [];
    let raf = 0;
    let running = false;
    // Use an object so the celebrateRef closure always sees the latest interval ID
    const rain = { timer: 0 };
    const timers = new Set();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts = parts.filter((p) => p.life > 0 && p.y < canvas.height + 50);
      for (const p of parts) {
        if (p.kind === "flower") {
          p.vy = Math.min(p.vy + 0.03, 2.2);
          p.x += p.vx + Math.sin(p.life * 0.06) * 0.9;
          p.y += p.vy;
          p.r += p.vr;
          p.life--;
        } else {
          p.vy += 0.15;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.99;
          p.r += p.vr;
          p.life--;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = Math.min(1, p.life / 60);
        if (p.kind === "rect") {
          ctx.fillStyle = p.c;
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62);
        } else if (p.kind === "ball") {
          ctx.beginPath();
          ctx.arc(0, 0, p.s * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = p.c;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-p.s * 0.22, -p.s * 0.22, p.s * 0.24, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,.65)";
          ctx.fill();
        } else {
          ctx.drawImage(p.sprite, -p.s, -p.s, p.s * 2, p.s * 2);
        }
        ctx.restore();
      }
      if (parts.length) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    const kick = () => {
      if (!running && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const push = (p) => {
      parts.push(p);
      if (parts.length > MAX_PARTICLES) {
        parts.splice(0, parts.length - MAX_PARTICLES);
      }
    };

    const burst = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 8;
        const roll = Math.random();
        const kind = roll < 0.45 ? "rect" : roll < 0.75 ? "ball" : "flower";
        const p = {
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 4,
          kind,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          life: 130 + Math.random() * 70,
        };
        if (kind === "rect") {
          p.s = 4 + Math.random() * 6;
        } else if (kind === "ball") {
          p.s = 5 + Math.random() * 5;
        } else {
          p.s = 9 + Math.random() * 7;
          p.sprite = sprites[(Math.random() * sprites.length) | 0];
          p.vy = Math.abs(p.vy) * 0.35;
          p.vx *= 0.4;
        }
        push(p);
      }
      kick();
    };

    const later = (fn, ms) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    celebrateRef.current = () => {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      burst(w * 0.5, h * 0.3, 110);
      later(() => burst(w * 0.2, h * 0.26, 70), 220);
      later(() => burst(w * 0.8, h * 0.26, 70), 400);
      // gentle flower rain for ~3s
      let drops = 0;
      clearInterval(rain.timer);
      rain.timer = setInterval(() => {
        if (++drops > 34) {
          clearInterval(rain.timer);
          return;
        }
        push({
          x: Math.random() * w,
          y: -30,
          vx: 0,
          vy: 1 + Math.random() * 1.2,
          kind: "flower",
          c: "",
          r: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.15,
          s: 10 + Math.random() * 8,
          sprite: sprites[(Math.random() * sprites.length) | 0],
          life: 260 + Math.random() * 120,
        });
        kick();
      }, 90);
    };

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      } else if (parts.length) {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(rain.timer);
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (fire > 0) celebrateRef.current();
  }, [fire]);

  return <canvas id="confetti" ref={canvasRef} aria-hidden="true" />;
}
