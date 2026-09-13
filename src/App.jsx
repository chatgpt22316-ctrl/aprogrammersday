import { Fragment, useEffect, useState } from "react";
import Celebration from "./Celebration.jsx";
import CodeCard from "./CodeCard.jsx";
import { FACTS, WISHES } from "./content.jsx";

const reduceMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const instant =
  window.__STILL__ === true ||
  reduceMotion ||
  new URLSearchParams(window.location.search).has("still");

const DOODLE_COLORS = ["c0", "c1", "c2", "c3"];

/** Static multicolor text (top-bar wordmark). */
function ColorText({ text }) {
  let k = 0;
  return (
    <>
      {[...text].map((ch, i) =>
        ch === " " ? (
          " "
        ) : (
          <span key={i} className={DOODLE_COLORS[k++ % 4]}>
            {ch}
          </span>
        )
      )}
    </>
  );
}

/** Doodle headline: letters pop in one-by-one, grouped by word so
 *  lines never break mid-word on phones. */
function DoodleTitle({ text }) {
  let k = 0;
  return (
    <h1 className="doodle">
      {text.split(" ").map((word, w, arr) => (
        <Fragment key={w}>
          <span className="word">
            {[...word].map((ch, j) => {
              const d = k++;
              return (
                <span
                  key={j}
                  className={"ltr " + DOODLE_COLORS[d % 4]}
                  style={{ animationDelay: d * 55 + "ms" }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {w < arr.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h1>
  );
}

export default function App() {
  const [fire, setFire] = useState(0);
  const [open, setOpen] = useState(instant);

  useEffect(() => {
    if (instant) {
      // static/QA mode: everything visible, small burst for previews
      if (!reduceMotion) {
        const t = setTimeout(() => setFire(1), 120);
        return () => clearTimeout(t);
      }
      return;
    }
    document.body.classList.add("anim");
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    // The celebration runs automatically — no click needed.
    const t = setTimeout(() => {
      setOpen(true);
      setFire(1);
    }, 900);
    return () => {
      clearTimeout(t);
      io.disconnect();
      document.body.classList.remove("anim");
    };
  }, []);

  const replay = () => {
    setOpen(false);              // close the card so the slide-in can replay
    setFire((f) => f + 1);      // trigger confetti
    setTimeout(() => setOpen(true), 80); // reopen → CSS transition plays again
  };

  return (
    <>
      <Celebration fire={fire} />

      <div className="topbar">
        <div className="wordmark">
          <ColorText text="Programmer’s Day" />
        </div>
        <span className="chip">🎉 Day 256 · Sep 13, 2026</span>
      </div>

      {/* ===================== HERO ===================== */}
      <header className="hero">
        <div className="shapes" aria-hidden="true">
          <span className="shp ring1"></span>
          <span className="shp ring2"></span>
          <span className="shp plus1"></span>
          <span className="shp plus2"></span>
          <span className="shp dots"></span>
        </div>

        <DoodleTitle text="Happy Programmer’s Day!" />
        <p className="sub">
          Today the calendar reads <b>256</b> — the number of values in a byte
          — and the world celebrates the people who turn coffee into code. We
          celebrate <b>you</b>, Sir.
        </p>

        <div className="photo-ring">
          <div className="photo-inner">
            <div className="avatar-fallback" aria-hidden="true">
              <div className="brackets">&lt;/&gt;</div>
              <div className="initials">AD</div>
            </div>
            <img
              src="teacher.jpg"
              alt="Portrait of Ashish Kumar Dass"
              onError={(e) => e.currentTarget.remove()}
            />
          </div>
        </div>
        <div className="name">Ashish Kumar Dass</div>
        <p className="role">Mentor · Passionate Coder · Inspiration</p>

        <div className="cta-row">
          <button className="cta" onClick={replay}>
            🎉 Celebrate again
          </button>
          <span className="hint">// auto-runs · tap to relive</span>
        </div>

        <div className={"surprise" + (open ? " open" : "")}>
          <div className="card">
            <b>✅ Celebration deployed successfully!</b>
            <br />
            Dear Sir, may your ideas always compile, your curiosity never hit a{" "}
            <span style={{ fontFamily: "var(--mono)" }}>404</span>, and your life
            be full of perfectly merged moments. Thank you for teaching us to
            love every line we write. 💙
          </div>
        </div>
      </header>

      {/* ===================== C PROGRAM ===================== */}
      <section>
        <div className="wrap center reveal">
          <p className="kicker k-blue">Written in C · compiled with love</p>
          <h2>A program that describes you, Sir</h2>
          <p className="lead">
            Watch it write itself — because the best teachers make even code
            feel alive.
          </p>
          <CodeCard instant={instant} />
        </div>
      </section>

      {/* ===================== WHY 256 ===================== */}
      <section
        style={{
          background: "var(--soft)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap reveal">
          <p className="kicker k-red">Why today?</p>
          <h2>
            September 13 = the 256<sup>th</sup> day of the year
          </h2>
          <p className="lead">
            Programmer’s Day falls on day 256 (0x100) — a number every
            programmer holds dear. Fitting, because some teachers are just as
            fundamental to us.
          </p>
          <div className="fact-grid">
            {FACTS.map((f, i) => (
              <div className={"fact " + f.tone} key={i}>
                <div className="big">{f.big}</div>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WISHES ===================== */}
      <section>
        <div className="wrap reveal">
          <p className="kicker k-green">Straight from the heart</p>
          <h2>Wishes for you, Sir 💌</h2>
          <p className="lead">
            Some feelings don’t fit into comments — but we tried anyway.
          </p>
          <div className="wish-grid">
            {WISHES.map((w, i) => (
              <div className={"wish " + w.tone} key={i}>
                <div className="wi">{w.icon}</div>
                <p>{w.text}</p>
                <code>{w.code}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== NOTE ===================== */}
      <section
        style={{ background: "var(--soft)", borderTop: "1px solid var(--line)" }}
      >
        <div className="wrap center reveal">
          <p className="kicker k-blue">A letter for you</p>
          <h2>A note for you, Sir</h2>
          <div style={{ height: 22 }}></div>
          <div className="note-card">
            <div className="note-strip">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="note-body">
              <p>Dear Ashish Sir,</p>
              <p>
                You never just taught us programming — you taught us how to
                think, how to be patient with hard problems, and how to be
                gentle with ourselves when we fail. Every bug you helped us
                chase quietly taught us resilience; every “try once more”
                turned our confusion into confidence.
              </p>
              <p>
                Teachers like you are rare — the kind whose lessons outlive the
                classroom and keep running silently in everything we build.
              </p>
              <p>
                On this Programmer’s Day, we celebrate not just a passionate
                coder, but the person who made us fall in love with learning
                itself.
              </p>
              <p className="sign">
                With gratitude and semicolons,
                <br />
                <span className="sig-name">— Sachin, your student</span> 🙏
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        day_256_of_2026 · gcc -o happiness best_teacher.c · 0 errors, 0
        warnings ❤️
      </footer>
    </>
  );
}
