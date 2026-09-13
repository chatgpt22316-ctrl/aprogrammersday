import { useEffect, useState } from "react";
import { C_LINES } from "./content.jsx";

/** Types the C program token-by-token, like a living editor. */
export default function CodeCard({ instant }) {
  const [pos, setPos] = useState({ li: 0, ti: 0, ch: 0 });
  const [done, setDone] = useState(!!instant);

  useEffect(() => {
    if (instant) {
      setDone(true);
      return;
    }
    let li = 0;
    let ti = 0;
    let ch = 0;
    let alive = true;
    let timer;
    const step = () => {
      if (!alive) return;
      // Advance position
      const tokens = C_LINES[li];
      if (!tokens || !tokens.length || ti >= tokens.length) {
        li++;
        ti = 0;
        ch = 0;
      } else {
        ch++;
        if (ch >= tokens[ti][1].length) {
          ti++;
          ch = 0;
        }
      }
      // Guard: stop before accessing out-of-bounds line
      if (li >= C_LINES.length) {
        setDone(true);
        return;
      }
      setPos({ li, ti, ch });
      timer = setTimeout(step, 12 + Math.random() * 14);
    };
    timer = setTimeout(step, 350);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [instant]);

  const rows = [];
  const upto = done ? C_LINES.length : Math.min(pos.li + 1, C_LINES.length);
  for (let i = 0; i < upto; i++) {
    const tokens = C_LINES[i];
    if (done || i < pos.li) {
      rows.push(tokens);
    } else {
      const part = [];
      for (let t = 0; t < tokens.length; t++) {
        if (t < pos.ti) part.push(tokens[t]);
        else if (t === pos.ti) {
          part.push([tokens[t][0], tokens[t][1].slice(0, pos.ch)]);
          break;
        }
      }
      rows.push(part);
    }
  }

  const lastRow = rows.length - 1;

  return (
    <div className="codecard">
      <div className="codebar">
        <span className="dot r"></span>
        <span className="dot y"></span>
        <span className="dot g"></span>
        <span className="tab">best_teacher.c</span>
      </div>
      <div className="codebody">
        {rows.map((tokens, i) => (
          <span className="ln" key={i}>
            {tokens.every((t) => t[1] === "")
              ? "\u00A0"
              : tokens.map((t, j) =>
                  t[1] === "" ? null : (
                    <span key={j} className={t[0] || undefined}>
                      {t[1]}
                    </span>
                  )
                )}
            {!done && i === lastRow ? <span className="cursor"></span> : null}
          </span>
        ))}
        {done ? (
          <span className="ln">
            <span className="cursor"></span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
