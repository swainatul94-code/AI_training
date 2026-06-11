// c03-first-app — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 3 },
{ id:15, title:"Phase 0.75 — Ship your first AI app (30 min win)", est:"30-60 min",
  intro:"You did Phase 0 (env) and Phase 0.5 (Python basics). Before the math wall, ship something that uses Claude. Win early, get hooked.",
  lessons:[
    {h:"Why this phase exists", body:`<p>Most beginners quit between Phase 0.5 (Python) and Phase 1 (Math). 25-40 hours of math with no working product is a motivation cliff.</p>
    <p>This 30-min phase puts a working Claude-powered app in your GitHub. You'll feel real progress before the abstract part.</p>
    <p><b>Hard rule:</b> ship publicly today. Don't perfect it.</p>`},
    {h:"Build: AI Joke Generator (30 min)", body:`<p>A CLI tool that asks Claude for a joke on any topic, in any style.</p>
    <h4>Step 1 — Create file</h4>
    <p>In your <code>AI_training</code> folder, create <code>joker.py</code>:</p>`, code:`import anthropic, sys

client = anthropic.Anthropic()

def joke(topic: str, style: str = "dad joke") -> str:
    resp = client.messages.create(
        model="claude-haiku-4-5-20251001",  # cheap, fast for jokes
        max_tokens=200,
        system="You are a professional comedian. Reply with ONLY the joke. No setup like 'here's a joke'.",
        messages=[{"role": "user", "content": f"Tell me one {style} about {topic}."}],
    )
    return resp.content[0].text

if __name__ == "__main__":
    topic = " ".join(sys.argv[1:]) or "Python programming"
    print(joke(topic))`},
    {h:"Step 2 — Run it", body:`<p>From PowerShell in your repo folder:</p>`, code:`python joker.py
python joker.py cats
python joker.py "rubber duck debugging"

# Customize style:
# Edit joker.py to accept style arg, then:
# python joker.py "machine learning" knock-knock`},
    {h:"Step 3 — Push to GitHub", code:`git add joker.py
git commit -m "feat: AI joke generator (Phase 0.75)"
git push`},
    {h:"Step 4 — Brag (the real point)", body:`<p>Post the funniest output to X/LinkedIn/Discord with one line: <i>"My first AI app — built today."</i></p>
    <p>Tag the repo URL. This is your portfolio's first entry. Real proof you can ship.</p>
    <p><b>Reactions you'll get:</b> people will assume you've been at this longer than 2 days. Use that energy to tackle Phase 1 math tomorrow.</p>`},
    {h:"Stretch (optional 30 min more)", body:`<ul>
      <li>Wrap in FastAPI, deploy to Railway → public URL anyone can hit (see Phase 9 lesson on Railway deploys)</li>
      <li>Add <code>--style</code> CLI flag (knock-knock, observational, dark, wholesome)</li>
      <li>Save every joke to <code>jokes.txt</code> so you can build a dataset later</li>
      <li>Add a Discord webhook to post jokes to a channel daily</li>
    </ul>`},
  ],
  quiz:[
    {type:"mcq", q:"Why use Haiku here instead of Opus?", options:[
      "Opus doesn't tell jokes",
      "Haiku is ~15× cheaper and quality is fine for short creative output. Match model tier to task difficulty.",
      "Opus requires more API key permissions",
      "It's random"
    ], answer:1, explain:"Always pick the cheapest model that meets quality bar. Jokes are easy; Haiku nails them. Reserve Opus for hard reasoning."},
    {type:"mcq", q:"What does <code>system=</code> do in messages.create?", options:[
      "Logs to stdout",
      "Sets the model's role/persona for the conversation (the 'who you are' prompt)",
      "Sets the OS",
      "Required by Anthropic API"
    ], answer:1, explain:"System prompt steers behavior across all turns. Put role + constraints + format there. Keep user messages as the actual task."},
    {type:"short", q:"You ran your joker.py and got a 'AuthenticationError'. What's the most likely fix?", model:"API key not set in env vars. Check: echo $env:ANTHROPIC_API_KEY (PowerShell). If empty, you forgot setx + reopen shell from Phase 0. Re-run setx, close + reopen terminal, then retry.", rubric:["env var missing","setx + reopen","Phase 0 step"]},
  ],
  project:{title:"Phase 0.75 deliverable", steps:[
    "joker.py works locally, prints a joke",
    "Pushed to AI_training repo with descriptive commit",
    "Posted ONE output publicly (X, LinkedIn, Discord, or even just to a friend)",
    "(Stretch) wrapped in FastAPI and deployed to Railway"
  ]}
}
));
