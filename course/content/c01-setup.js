// c01-setup — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 1 },
{ id:0, title:"Phase 0 — Setup", est:"1-2 hrs",
  intro:"Bad env kills learning. By end: Python, Claude API key, GitHub repo, working <code>test_claude.py</code>. Don't skip the explanations — they teach concepts you'll be quizzed on.",
  lessons:[
    {h:"What IS artificial intelligence, actually?", body:`<p>Before installing anything, get the map straight. These four terms nest inside each other like Russian dolls:</p>
<table>
<tr><th>Term</th><th>What it means</th><th>Example</th></tr>
<tr><td><b>AI</b></td><td>Any program that does something we'd call "smart"</td><td>Chess engine, spam filter, ChatGPT</td></tr>
<tr><td><b>Machine Learning</b></td><td>AI that learns rules from examples instead of being hand-coded</td><td>Spam filter trained on 10,000 emails</td></tr>
<tr><td><b>Deep Learning</b></td><td>ML using neural networks with many layers</td><td>Image recognition, speech-to-text</td></tr>
<tr><td><b>LLM</b></td><td>Deep learning model trained on text to predict the next token</td><td>Claude, GPT</td></tr>
</table>
<p><b>Mental model:</b> AI is the building, ML is a floor in it, deep learning is a room on that floor, and LLMs are one (very loud) machine in that room. This course walks you from the front door to that machine.</p>
<p><b>The single most important sentence in this course:</b> an LLM is a program that, given some text, predicts which token (word-piece) most likely comes next — and everything it appears to "know" or "reason" emerges from doing that prediction extremely well.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Thinking "AI" means one technology. It's an umbrella over very different tools.</li>
<li>Thinking LLMs look things up in a database. They don't — they generate from learned patterns (which is also why they can confidently make things up).</li>
<li>Thinking you must master ALL of AI. You're following one path: the LLM path.</li>
</ul>`},
    {h:"What you're installing and why (read first)", body:`<p>Five tools. Each has a job:</p>
    <table>
      <tr><th>Tool</th><th>What it does</th><th>Why you need it</th></tr>
      <tr><td><b>Python</b></td><td>Programming language interpreter</td><td>Every ML library is Python. Without it, no ML.</td></tr>
      <tr><td><b>uv</b></td><td>Package manager (downloads libraries)</td><td>Faster + cleaner than pip. Installs things like <code>anthropic</code>, <code>numpy</code>.</td></tr>
      <tr><td><b>Git</b></td><td>Version control — tracks every change to your code</td><td>Industry standard. Lets you push code to GitHub for backup + portfolio.</td></tr>
      <tr><td><b>VS Code</b></td><td>Text editor for code</td><td>Where you write Python files. Free, popular.</td></tr>
      <tr><td><b>Anthropic API key</b></td><td>Password that lets your code call Claude</td><td>Required to use Claude's API. Costs pennies per request.</td></tr>
    </table>
    <p><b>Mental model:</b> Python is the engine. uv buys parts (libraries). Git photographs your work. VS Code is the workbench. The API key opens the door to Claude.</p>`},
    {h:"Install Python (Windows)", body:`<p><b>What is Python?</b> A programming language. You write <code>.py</code> files and Python runs them. It comes with a command called <code>python</code> that you call from PowerShell.</p>
    <p><b>Steps:</b></p>
    <ol>
      <li>Go to <a href="https://python.org/downloads" target="_blank">python.org/downloads</a></li>
      <li>Download installer (latest 3.11 or newer)</li>
      <li>Run installer. <b>CRITICAL: check the box "Add Python to PATH"</b> at bottom of first screen. Without this, PowerShell won't find Python.</li>
      <li>Click "Install Now"</li>
      <li>Open PowerShell (Windows key → type "powershell" → Enter)</li>
      <li>Run the command below to verify it worked</li>
    </ol>
    <p><b>PATH = a list of folders Windows searches when you type a command.</b> Adding Python to PATH means typing <code>python</code> anywhere works.</p>`, code:`python --version
# Should print: Python 3.11.x (or higher)
# If you see "not recognized" → PATH wasn't checked. Reinstall.`},
    {h:"Install uv (fast Python package manager)", body:`<p><b>What is a package manager?</b> Software that downloads + installs libraries (other people's reusable code). Python ships with <code>pip</code>; <code>uv</code> is a faster modern replacement made by Astral.</p>
    <p><b>Why we use it:</b> ML projects pull in 20-50 libraries (numpy, torch, anthropic, ...). uv installs them in seconds instead of minutes. Also handles virtual environments cleanly.</p>
    <p><b>Virtual environment</b> = isolated Python "workspace" so libraries for one project don't conflict with another. Like separate desks.</p>`, code:`pip install uv
uv --version
# Should print: uv 0.x.x`},
    {h:"Install Git", body:`<p><b>What is Git?</b> Software that tracks every change you make to your code. Lets you:</p>
    <ul>
      <li>Undo any change (like Ctrl+Z but forever)</li>
      <li>Sync your code to GitHub (cloud backup + share)</li>
      <li>Collaborate without overwriting each other's work</li>
    </ul>
    <p><b>How it works (mental model):</b> You write code → run <code>git add</code> (stage changes) → <code>git commit -m "msg"</code> (save snapshot with message) → <code>git push</code> (upload snapshots to GitHub).</p>
    <p>Download installer at <a href="https://git-scm.com" target="_blank">git-scm.com</a>. Accept defaults. Verify:</p>`, code:`git --version
# Should print: git version 2.x.x`},
    {h:"Install VS Code (your editor)", body:`<p><b>What it is:</b> a free text editor optimized for code. Color-codes syntax, suggests completions, runs your code with one click.</p>
    <ol>
      <li>Download at <a href="https://code.visualstudio.com" target="_blank">code.visualstudio.com</a></li>
      <li>Install with defaults</li>
      <li>Open it, click Extensions icon (left sidebar, looks like 4 squares)</li>
      <li>Search "Python" → install the official Microsoft one</li>
      <li>Search "Jupyter" → install</li>
    </ol>
    <p>When you open a <code>.py</code> file, VS Code auto-detects Python and offers to run it (▶ button top-right).</p>`},
    {h:"Get an Anthropic API key", body:`<p><b>What is an API key?</b> A long secret string (like a password) that proves your code is authorized to call Claude. Anthropic uses it to know who to bill.</p>
    <p><b>Cost:</b> tiny. A test call is ~$0.001. $5 lasts weeks of learning. Set a spend limit in console to avoid runaway bills.</p>
    <ol>
      <li>Go to <a href="https://console.anthropic.com" target="_blank">console.anthropic.com</a>, sign up (Google login OK)</li>
      <li>Billing → add $5-10 credit (credit card)</li>
      <li>Settings → Limits → set monthly cap (e.g. $20)</li>
      <li>API Keys → "Create Key" → copy the string (starts with <code>sk-ant-...</code>) — <b>save it now, you can't view it again later</b></li>
    </ol>
    <p><b>Why we use <code>setx</code> instead of <code>$env:VAR = "..."</code>:</b></p>
    <ul>
      <li><code>$env:ANTHROPIC_API_KEY = "..."</code> sets the variable <b>only in the current PowerShell window</b>. Close window → gone.</li>
      <li><code>setx ANTHROPIC_API_KEY "..."</code> writes it to <b>Windows registry</b> (HKCU\\Environment) → every future PowerShell inherits it.</li>
      <li>After <code>setx</code>, you MUST close + reopen PowerShell. The current window doesn't see the change.</li>
    </ul>
    <p>This is why the course quiz asks about setx. It's a real footgun.</p>`, code:`setx ANTHROPIC_API_KEY "sk-ant-..."
# CLOSE this PowerShell window
# Open a NEW PowerShell window
echo $env:ANTHROPIC_API_KEY
# Should print your key. If empty → you forgot to close+reopen.`},
    {h:"Your first Claude API call (explained line by line)", body:`<p>Open VS Code → File → New File → save as <code>test_claude.py</code> in any folder. Paste the code below.</p>
    <p><b>What each line does:</b></p>
    <ul>
      <li><code>import anthropic</code> — load the Anthropic library (we install it next step)</li>
      <li><code>client = anthropic.Anthropic()</code> — create a client object. It auto-reads your API key from <code>ANTHROPIC_API_KEY</code> env var.</li>
      <li><code>messages.create(...)</code> — send a request to Claude</li>
      <li><code>model="claude-opus-4-7"</code> — which Claude version (verify current ID at docs.anthropic.com/models)</li>
      <li><code>max_tokens=100</code> — cap on response length (1 token ≈ 0.75 words). Cost cap.</li>
      <li><code>messages=[...]</code> — conversation history. List of dicts with <code>role</code> (user or assistant) and <code>content</code> (text)</li>
      <li><code>msg.content[0].text</code> — extract the response text from Claude's structured reply</li>
    </ul>`, code:`# test_claude.py
import anthropic

client = anthropic.Anthropic()

msg = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=100,
    messages=[
        {"role": "user", "content": "In 5 words: what is an LLM?"}
    ],
)

print(msg.content[0].text)
print(f"Used {msg.usage.input_tokens} input + {msg.usage.output_tokens} output tokens")`},
    {h:"Install the library and run it", body:`<p>Open PowerShell in the folder where you saved <code>test_claude.py</code> (in VS Code, View → Terminal opens one there). Run these two commands.</p>
    <ul>
      <li>First command: downloads + installs the <code>anthropic</code> library so Python can import it.</li>
      <li>Second command: runs your script.</li>
    </ul>
    <p>If you see "AuthenticationError" → your API key isn't set. Run <code>echo $env:ANTHROPIC_API_KEY</code> — if empty, fix with <code>setx</code> + reopen shell.</p>`, code:`uv pip install anthropic
python test_claude.py
# Should print 5-word answer like "Predicts next token from context."
# Plus token counts.`},
    {h:"Create your GitHub repo + push code", body:`<p><b>What is GitHub?</b> Free cloud service that stores Git repos. Your code lives in folders called <b>repositories (repos)</b>.</p>
    <p><b>Why we push code to GitHub:</b></p>
    <ul>
      <li>Backup — your laptop could die tomorrow</li>
      <li>Portfolio — recruiters click these links</li>
      <li>Sharing — show others your work</li>
      <li>Activity graph — green squares = "this person codes"</li>
    </ul>
    <p><b>Steps:</b></p>
    <ol>
      <li>Sign up at <a href="https://github.com" target="_blank">github.com</a> if you haven't</li>
      <li>Top-right "+" → New repository</li>
      <li>Name it <code>AI_training</code>, leave it Public, DO NOT add README (we'll push our own)</li>
      <li>Click Create</li>
      <li>Now copy GitHub's URL — looks like <code>https://github.com/YOURNAME/AI_training.git</code></li>
      <li>In PowerShell, run the commands below (replace USER with your username)</li>
    </ol>
    <p><b>What each git command does:</b></p>
    <ul>
      <li><code>git init</code> — turn this folder into a Git repo (creates hidden <code>.git/</code>)</li>
      <li><code>git branch -M main</code> — rename default branch to "main"</li>
      <li><code>git add .</code> — stage all files in folder for commit</li>
      <li><code>git commit -m "init"</code> — save snapshot with message "init"</li>
      <li><code>git remote add origin URL</code> — link local repo to GitHub URL</li>
      <li><code>git push -u origin main</code> — upload your snapshots</li>
    </ul>`, code:`mkdir AI_training
cd AI_training
git init
git branch -M main
echo "# AI Training" > README.md
git add .
git commit -m "init: zero-to-hero AI track"
git remote add origin https://github.com/USER/AI_training.git
git push -u origin main
# First push will prompt for GitHub login (browser opens)`},
    {h:"Optional but recommended: where to find current Claude model IDs", body:`<p>Model IDs change every release. Course examples use <code>claude-opus-4-7</code>, <code>claude-sonnet-4-6</code>, <code>claude-haiku-4-5-20251001</code> (2026 era).</p>
    <p><b>Always verify at:</b> <a href="https://docs.anthropic.com/en/docs/about-claude/models" target="_blank">docs.anthropic.com/en/docs/about-claude/models</a></p>
    <p>If a code example fails with "model_not_found", check that page for the current ID and replace.</p>`},
    {h:"How a computer 'learns' — the 60-second version", body:`<p>Forget sci-fi. Learning, in machine learning, is a very mechanical loop of three steps: <b>guess, measure the error, nudge the dials</b>. Repeat millions of times.</p>
<p>A model is a machine with millions of <b>parameters</b> (think: dials). Each parameter is just a number. Before training, those numbers are random garbage. Training turns them into something useful.</p>
<p><b>Mental model:</b> imagine a single-dial machine that predicts house prices. The dial multiplies the house's size in square meters to produce a price guess. You start the dial at some random value and improve it by measuring how wrong it is on real sales data. That "how wrong" measurement is called the <b>loss</b> (or error). Each time you measure the loss, you nudge every dial a tiny bit in the direction that would have made the loss smaller. Do this enough times and the dials settle at values that make good predictions.</p>
<p><b>Worked example:</b> one dial, one house.</p>
<ul>
  <li>House size: 100 m²</li>
  <li>Actual sale price: 150,000</li>
  <li>Dial starts at: 1,000</li>
  <li>Guess: 1,000 × 100 = 100,000</li>
  <li>Error (loss): 150,000 − 100,000 = 50,000 — too low</li>
  <li>Nudge dial up to 1,200</li>
  <li>New guess: 1,200 × 100 = 120,000</li>
  <li>New error: 150,000 − 120,000 = 30,000 — smaller!</li>
  <li>Keep nudging… eventually dial ≈ 1,500 → guess = 150,000 → error ≈ 0</li>
</ul>
<p>That loop — guess, measure loss, nudge — run a million times across millions of dials and millions of examples, IS training. A real LLM does the same thing, just with billions of dials and the task being "predict the next word in a sentence" instead of house prices.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Thinking the machine <em>understands</em> anything. It doesn't. It finds dial settings that minimize error on training data. "Understanding" is a metaphor.</li>
<li>Thinking more data always fixes everything. Data quality matters as much as quantity. Garbage in, garbage out.</li>
<li>Thinking training is something you do often. You train once (or fine-tune occasionally). Inference (using the trained model) is the everyday action.</li>
</ul>`},
    {h:"What happens when you call the Claude API (the full journey)", body:`<p>Every time your code calls Claude, a specific sequence of events happens. Knowing this sequence means you can diagnose problems at each step instead of guessing.</p>
<p>Here is the journey of one request, start to finish:</p>
<ol>
  <li><b>Your Python builds a JSON object</b> — model name, max_tokens, messages list. This is your request payload.</li>
  <li><b>HTTPS POST to api.anthropic.com</b> — the JSON travels over the internet, encrypted.</li>
  <li><b>Anthropic's gateway checks your API key</b> — if the key is missing or wrong, you get a 401 AuthenticationError right here, before Claude ever sees your text.</li>
  <li><b>Your text is tokenized</b> — split into word-pieces (tokens). "Tokenization" is not splitting on spaces; "unhappiness" might become ["un", "happiness"]. You're billed per token.</li>
  <li><b>GPUs predict tokens one at a time</b> — Claude's model runs on a cluster of GPUs. It outputs one token, appends it to context, outputs the next, repeat — until it predicts a stop token or hits max_tokens.</li>
  <li><b>JSON response returns</b> — wraps the generated text, token counts, stop reason.</li>
  <li><b>Your code reads <code>msg.content[0].text</code></b> — extracts the string from the structured response.</li>
</ol>
<p><b>Mental model:</b> think of a restaurant. The API documentation is the menu. Your request is the order. Anthropic's gateway is the front-of-house who checks your reservation (key). The GPU cluster is the kitchen. The JSON response is the dish arriving at your table. The token count on your bill tells you how much kitchen time you used.</p>
<p>Why does this matter? When something goes wrong, you now know <em>which step</em> failed. AuthenticationError = step 3. Response is truncated = you hit max_tokens at step 5. Slow response = step 5 is generating a long answer token by token.</p>`, code:`# REQUEST — what your Python sends
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 100,
  "messages": [
    {"role": "user", "content": "What is 2 + 2?"}
  ]
}

# RESPONSE — what Anthropic sends back
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "2 + 2 = 4"
    }
  ],
  "model": "claude-haiku-4-5-20251001",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 14,   # you paid for these
    "output_tokens": 9    # and these
  }
}`},
    {h:"How to read an error message without panicking", body:`<p>Error messages feel scary when you're new. They're actually the most useful text in programming — they tell you exactly what went wrong and where. The trick: read them <b>bottom-up</b>.</p>
<p>A Python error printout is called a <b>traceback</b>. It shows the chain of function calls that led to the crash. The <b>last line</b> is the actual error. The lines above it are the call stack — where the code was when it crashed.</p>
<p><b>Example traceback:</b></p>
<pre>Traceback (most recent call last):
  File "test_claude.py", line 5, in &lt;module&gt;
    client = anthropic.Anthropic()
  File "anthropic/_client.py", line 82, in __init__
    raise AuthenticationError(...)
anthropic.AuthenticationError: No API key provided.</pre>
<p>Read from the bottom: <code>AuthenticationError: No API key provided</code> — that's the problem. The line above says it happened inside <code>anthropic/_client.py</code>. The line above <em>that</em> says your <code>test_claude.py</code> line 5 triggered it. Fix: set your API key. You don't need to read the middle lines to know that.</p>
<p><b>The five errors beginners hit most:</b></p>
<table>
<tr><th>Error</th><th>What it means</th><th>Fix</th></tr>
<tr><td><b>ModuleNotFoundError</b></td><td>You're importing a library that isn't installed</td><td>Run <code>uv pip install &lt;name&gt;</code> in PowerShell</td></tr>
<tr><td><b>AuthenticationError</b></td><td>API key is missing or wrong</td><td>Run <code>setx</code> with the correct key, then close + reopen PowerShell</td></tr>
<tr><td><b>SyntaxError</b></td><td>Python can't parse your code — typo, missing colon, unclosed quote</td><td>Look at the line number given; check for missing <code>:</code> after <code>if</code>/<code>def</code>, or unclosed <code>"</code></td></tr>
<tr><td><b>IndentationError</b></td><td>Wrong number of leading spaces inside a block</td><td>Use 4 spaces consistently; never mix tabs and spaces</td></tr>
<tr><td><b>NameError</b></td><td>Used a variable before defining it, or misspelled a name</td><td>Check spelling; make sure the variable is defined above the line that crashes</td></tr>
</table>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Reading the traceback top-down. The top is where the call started, not where it broke. Start at the bottom.</li>
<li>Retyping your entire script because "something is wrong." Read the line number — it's almost always exactly that line.</li>
<li>Ignoring the error type (the word before the colon). The type tells you the category of the problem immediately.</li>
</ul>`},
  ],
  quiz:[
    {type:"mcq", q:"Why setx instead of $env:VAR='...' in PowerShell?", options:["setx is faster","setx persists to user env; $env: lasts only current session","Add to $PROFILE — they're identical","Use Set-Item env:VAR — setx is deprecated"], answer:1, explain:"setx writes to HKCU\\Environment registry; future shells inherit. $env: is in-process. $PROFILE works but requires re-sourcing. Set-Item env: is also in-process."},
    {type:"mcq", q:"Where do you find the current Claude model IDs to use?", options:["This course's hardcoded values are forever stable","Anthropic console homepage banner","docs.anthropic.com/en/docs/about-claude/models — the authoritative list, updated on each release","StackOverflow"], answer:2, explain:"Model IDs change with releases. Always source-of-truth at docs.anthropic.com/models. Course examples illustrate the pattern but verify before depending on a specific ID."},
    {type:"short", q:"Public vs private repo for AI portfolio?", model:"Public = visible, linkable from resume/LinkedIn = portfolio leverage. Private = hides code but still counts for activity graph. Default to PUBLIC for portfolio.", rubric:["public=visible","portfolio needs public"]},
  ],
  project:{title:"Phase 0 deliverable", steps:["test_claude.py prints response","git push to AI_training succeeds","README written"]}
}
));
