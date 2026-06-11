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
    {h:"What is a web app? Client, server, and where your code lives", body:`<p>When you visit a website, two computers are involved: yours and someone else's. These two sides have names.</p>
<p>The <b>client</b> is the device making the request — your phone, your laptop, your browser. It displays things on screen and sends requests when you click buttons. The client runs HTML, CSS, and JavaScript.</p>
<p>The <b>server</b> is the computer that receives those requests and sends back responses — it's the machine that actually does the work: queries databases, calls APIs, applies business logic. Your Python code runs here, not on the user's device.</p>
<p><b>Mental model:</b> think of a restaurant. The customer (client) sits at a table, looks at the menu, and tells the waiter what they want. The waiter (the HTTP request) carries that order to the kitchen (server). The kitchen (your Python code) prepares the meal and sends it back. The customer never enters the kitchen.</p>
<p>When you deploy to Railway, Railway IS the kitchen. Your Python Flask or FastAPI app runs on Railway's computers 24/7, waiting for requests from anyone in the world who knows your app's URL.</p>
<table>
<tr><th>What happens</th><th>Where it runs</th><th>Who controls it</th></tr>
<tr><td>User taps a button, sees a result</td><td>User's phone/browser (client)</td><td>HTML/CSS/JS you wrote</td></tr>
<tr><td>Button sends request to your app</td><td>The internet (HTTP)</td><td>Automatic</td></tr>
<tr><td>Your Python processes the request, calls Claude</td><td>Railway server (backend)</td><td>Your Python code</td></tr>
<tr><td>Railway sends the response back</td><td>The internet (HTTP)</td><td>Automatic</td></tr>
<tr><td>User sees Claude's answer</td><td>User's phone/browser</td><td>HTML you wrote</td></tr>
</table>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Thinking your Python runs on the user's device. It doesn't. The browser only runs HTML, CSS, and JavaScript. Python lives on the server.</li>
<li>Thinking "deploy" means something complicated. It means: upload your code to a server computer (Railway) and tell it to run.</li>
<li>Confusing the frontend (what the user sees) with the backend (where the logic runs). They communicate by sending messages back and forth — they don't share memory or variables.</li>
</ul>`},
    {h:"Secrets and environment variables — why the key never goes in code", body:`<p>Your Anthropic API key is like a credit card number. Anyone who has it can spend your money. You must keep it secret — and the most dangerous place to put a secret is inside your code.</p>
<p><b>The horror story:</b> a developer pastes their API key directly into their Python file. They push the file to a public GitHub repo. Within minutes — sometimes seconds — automated bots are scanning every new GitHub commit for strings that look like API keys. The bot finds it. The developer wakes up to a $400 bill from a crypto-mining operation that used their key all night.</p>
<p>This happens constantly. GitHub has a built-in secret scanner, but you shouldn't rely on it. The rule is simple: <b>the key never touches the code file.</b></p>
<p>The solution is an <b>environment variable</b> — a value stored in the operating system's memory, separate from your code. Your Python reads it at runtime using <code>os.environ["ANTHROPIC_API_KEY"]</code>. The code file itself never contains the key — so even if you push the file publicly, there's nothing to steal.</p>
<p>Locally: you set the variable with <code>setx</code> (Phase 0). On Railway: you paste the key into Railway's Variables dashboard. In both cases, the key lives in a "separate pocket" that the code can reach into at runtime but that never gets written into a file you might accidentally share.</p>
<p>The <code>.env</code> file is a convenience for local development — a plain text file that holds variables. You must add it to <code>.gitignore</code> so Git never uploads it. Without that line in <code>.gitignore</code>, one <code>git push</code> exposes everything.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Hardcoding the key as a string: <code>api_key = "sk-ant-..."</code>. Never do this.</li>
<li>Creating a <code>.env</code> file but forgetting to add <code>.env</code> to <code>.gitignore</code>. Check with <code>git status</code> before every push — if you see <code>.env</code> in the list, stop.</li>
<li>Sharing a screenshot of their terminal that has the key printed in it. Bots scrape images too.</li>
</ul>`, code:`# READING THE KEY — correct way
import os

api_key = os.environ["ANTHROPIC_API_KEY"]
# If the variable isn't set, this raises KeyError immediately
# That's good — it fails loudly rather than silently sending a bad request

# Or let the anthropic library read it automatically:
import anthropic
client = anthropic.Anthropic()   # reads ANTHROPIC_API_KEY from env by default

# --- .gitignore --- add this line so Git ignores your .env file:
# (this is the content of the .gitignore file, not Python code)
# .env
# __pycache__/
# *.pyc

# --- .env (local dev only, NEVER commit this file) ---
# ANTHROPIC_API_KEY=sk-ant-your-real-key-here`},
    {h:"When someone visits your deployed app — the request trace", body:`<p>You've deployed to Railway and someone types your URL into their browser. What happens in the next 500 milliseconds? Knowing this sequence makes you a far better debugger.</p>
<ol>
  <li><b>DNS lookup:</b> the browser asks the internet "who is <code>yourapp.up.railway.app</code>?" The internet's address book (DNS) replies with Railway's server IP address.</li>
  <li><b>HTTP request arrives at Railway:</b> Railway's load balancer receives the request and routes it to your container — a mini virtual machine running your Python app.</li>
  <li><b>Your container wakes (or is already awake):</b> Railway keeps your app running. If it crashed, Railway tries to restart it. If the restart fails, the next step never happens.</li>
  <li><b>Your Python processes the request:</b> your Flask or FastAPI handler function runs. It might read the request body, validate inputs, build a prompt.</li>
  <li><b>Your Python calls the Claude API:</b> your code sends a request to <code>api.anthropic.com</code>. This is a separate HTTP round-trip from inside Railway's data center to Anthropic's servers.</li>
  <li><b>Claude's response returns to your Python:</b> you extract the text, build your response object.</li>
  <li><b>Railway sends the HTTP response to the browser:</b> the browser renders it. The user sees your answer.</li>
</ol>
<p>Each of those seven steps can fail independently. The table below maps the symptom you see to where to look.</p>
<table>
<tr><th>Symptom</th><th>Likely failed step</th><th>Where to look</th></tr>
<tr><td>502 Bad Gateway</td><td>Step 3 — your app crashed or never started</td><td>Railway dashboard → Deployments → view build/runtime logs. Look for the Python traceback.</td></tr>
<tr><td>Request times out (no response for 30+ seconds)</td><td>Step 4 or 5 — your Python is stuck or Claude is slow</td><td>Add print statements to narrow which line is hanging. Check if Claude API is having an outage at status.anthropic.com.</td></tr>
<tr><td>App loads but Claude answers are wrong/missing</td><td>Step 5 — AuthenticationError logged server-side</td><td>Railway dashboard → your service → Variables tab. Is ANTHROPIC_API_KEY set? Copy-paste it again; watch for extra spaces.</td></tr>
<tr><td>404 Not Found</td><td>Step 4 — your route isn't defined</td><td>Check your Flask/FastAPI route decorators. The URL path must match exactly.</td></tr>
</table>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Checking Railway logs <em>after</em> refreshing the page. Open the logs tab first, then refresh — watch events appear in real time.</li>
<li>Assuming the problem is Claude. Most deployment failures are environment variable issues or Python crashes unrelated to Claude.</li>
<li>Reading the top of the log instead of the bottom. Errors always appear at the end, just like Python tracebacks.</li>
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
