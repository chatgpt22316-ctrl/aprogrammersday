// Content for the celebration page.

// The C program, as syntax-highlighted tokens: [cssClass, text]
export const C_LINES = [
  [["kw", "#include"], ["", " "], ["str", "<stdio.h>"]],
  [["kw", "#define"], ["", " JOY "], ["num", "1"]],
  [["", ""]],
  [["kw", "typedef"], ["", " struct {"]],
  [["kw", "    char"], ["", " *name;"]],
  [["kw", "    char"], ["", " *passion;"]],
  [["kw", "    float"], ["", " impact;"], ["com", "   /* infinite */"]],
  [["", "} "], ["cls", "Teacher"], ["", ";"]],
  [["", ""]],
  [["kw", "int"], ["", " "], ["fn", "main"], ["", "(void) {"]],
  [["", "    "], ["cls", "Teacher"], ["", " sir = {"], ["str", "\"Ashish Kumar Dass\""], ["", ","]],
  [["", "                   "], ["str", "\"coding\""], ["", ", "], ["num", "1.0/0.0"], ["", "};"]],
  [["", "    "], ["fn", "celebrate"], ["", "(sir, "], ["num", "256"], ["", ", JOY);"]],
  [["kw", "    return"], ["", " "], ["num", "0"], ["", ";"]],
  [["", "}"]],
];

export const WISHES = [
  {
    icon: "🧠",
    tone: "w0",
    code: "/* inherited forever */",
    text: (
      <>
        Some teachers give lessons. <b>You gave us a way of thinking</b> — one
        that will keep running in our minds long after the classroom.
      </>
    ),
  },
  {
    icon: "🐛",
    tone: "w1",
    code: "// fear deleted, courage installed",
    text: (
      <>
        You taught us that every error is just a question waiting to be
        understood — <b>in code, and in life</b>.
      </>
    ),
  },
  {
    icon: "💙",
    tone: "w2",
    code: "/* compiled with your blessings */",
    text: (
      <>
        Behind every program we will ever write, there will be a quiet line of{" "}
        <b>your patience</b> hidden inside it.
      </>
    ),
  },
  {
    icon: "🌱",
    tone: "w3",
    code: "// growing since day one",
    text: (
      <>
        You planted curiosity in us, and it <b>compiles into confidence</b>{" "}
        every single day.
      </>
    ),
  },
  {
    icon: "🕯️",
    tone: "w0",
    code: "/* memory: permanent */",
    text: (
      <>
        Long after we forget the syntax, we will remember how you made us feel
        — <b>capable</b>.
      </>
    ),
  },
  {
    icon: "♾️",
    tone: "w1",
    code: "// no overflow, only endless thanks",
    text: (
      <>
        If gratitude had a data type, ours for you would be infinite —{" "}
        <b>gratitude = 1.0/0.0;</b>
      </>
    ),
  },
];

export const FACTS = [
  {
    big: "2⁸",
    tone: "f0",
    text: "The highest power of two under 365 — elegant by design, like your code reviews.",
  },
  {
    big: "1 byte",
    tone: "f1",
    text: "256 distinct values fit in a single byte. Small package, infinite possibility — your favorite lesson.",
  },
  {
    big: "0x100",
    tone: "f2",
    text: "In hex, today is perfectly round. In our hearts, so are you, Sir.",
  },
];
