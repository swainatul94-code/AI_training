// c14-agents — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 14 },
{ id:12, title:"Phase 11 — AI Agents", est:"25-40 hrs",
  intro:"An <b>agent</b> = LLM + tools + a loop where the LLM decides what to do next based on previous results. This is where AI stops being a chatbot and starts being a worker.",
  lessons:[
    {h:"⚠️ Misconceptions to kill before reading further", body:`<div class="trap">
      <div class="wrong">❌ WRONG: "LLM agents reason and plan."</div>
      <div class="right">✅ RIGHT: LLMs do next-token prediction. The OUTPUT often LOOKS like planning, but the model has no persistent goal or world model. This is why agents loop forever calling the same tool — they don't "realize" they're stuck.</div>
      <div class="why">Implication: enforce step caps, repeat detection, cost limits in YOUR HARNESS. Never expect the model to self-regulate.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "More tools = better agent."</div>
      <div class="right">✅ RIGHT: Tool count above ~8-12 confuses the model. Quality + clarity of tool descriptions matter more than count. Start with 3-5 well-described tools.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "Agentic = autonomous = good."</div>
      <div class="right">✅ RIGHT: Agentic loops add latency, cost, and failure modes. Use the simplest pattern that works: single LLM call > tool use > loop. Only agentify when the LLM genuinely must decide ordering at runtime.</div>
    </div>`},
    {h:"What an agent actually is (vs hype)", body:`<p>"Agent" is overused. Concrete definition: <b>an LLM in a loop where, at each step, the model can call tools, get back results, and decide what to do next — until it produces a final answer.</b></p>
    <p><b>The minimal loop:</b></p>
    <ol>
      <li>User gives a task: "Find the latest version of Python and write a hello world"</li>
      <li>LLM emits a tool call: <code>web_search("latest Python version")</code></li>
      <li>You execute the tool, get back: "Python 3.13"</li>
      <li>LLM emits another tool call: <code>write_file("hello.py", "print('hi')")</code></li>
      <li>You execute, return success</li>
      <li>LLM emits <code>end_turn</code> with: "Done. Latest is 3.13, file written."</li>
    </ol>
    <p>That's it. No magic. The LLM is the planner; your code is the executor.</p>
    <p><b>When you need an agent (vs a single LLM call):</b></p>
    <ul>
      <li>The task requires multiple steps with unknown ordering</li>
      <li>Each step's output determines the next step</li>
      <li>External info (web, files, APIs) needed at runtime</li>
    </ul>
    <p><b>When you DON'T need one:</b> simple Q&A, single classification, fixed multi-step pipeline. Don't agentify what one prompt + maybe one tool call can do.</p>
    <div class="callout">Required reading: Anthropic's <a href="https://www.anthropic.com/research/building-effective-agents" target="_blank">Building Effective Agents</a>. Defines core patterns (routing, parallelization, orchestrator-workers, evaluator-optimizer).</div>`},
    {h:"Raw agent loop (SAFE — no shell=True)", body:`<div class="callout warn"><b>SECURITY:</b> never pass model output to <code>shell=True</code>. Use <code>shlex.split</code> + allowlist, or sandbox (Docker, Modal). Below: read-only filesystem + allowlisted commands.</div>`, code:`import anthropic, subprocess, shlex, pathlib\nclient = anthropic.Anthropic()\n\nALLOWED_CMDS = {"ls", "cat", "wc", "grep", "head", "tail", "python", "pytest"}\nSAFE_ROOT = pathlib.Path("./workspace").resolve()\n\nTOOLS = [\n    {"name":"read_file","description":"Read a file under ./workspace",\n     "input_schema":{"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}},\n    {"name":"run","description":"Run an allowlisted command (no shell). Args as list.",\n     "input_schema":{"type":"object","properties":{"argv":{"type":"array","items":{"type":"string"}}},"required":["argv"]}},\n]\n\ndef safe_path(p):\n    full = (SAFE_ROOT / p).resolve()\n    if SAFE_ROOT not in full.parents and full != SAFE_ROOT:\n        raise ValueError("path escapes workspace")\n    return full\n\ndef exec_tool(name, args):\n    try:\n        if name == "read_file":\n            return safe_path(args["path"]).read_text()[:8000]\n        if name == "run":\n            argv = args["argv"]\n            if not argv or argv[0] not in ALLOWED_CMDS:\n                return f"command not allowed: {argv[:1]}"\n            r = subprocess.run(argv, capture_output=True, text=True, timeout=15, cwd=SAFE_ROOT)\n            return (r.stdout + r.stderr)[:4000]\n        return f"unknown tool {name}"\n    except Exception as e:\n        return f"tool error: {e}"\n\ndef run_agent(task, max_steps=10, max_dollars=0.50):\n    messages = [{"role":"user","content":task}]\n    spent = 0.0; seen = set()\n    for step in range(max_steps):\n        resp = client.messages.create(\n            model="claude-opus-4-7", max_tokens=4096,\n            tools=TOOLS, messages=messages,\n        )\n        # cost cap (Opus 4.7 illustrative; verify pricing live)\n        spent += resp.usage.input_tokens*15e-6 + resp.usage.output_tokens*75e-6\n        if spent > max_dollars: return f"cost cap hit at step {step}"\n        messages.append({"role":"assistant","content":resp.content})\n        if resp.stop_reason == "end_turn":\n            return next((b.text for b in resp.content if b.type=="text"), "")\n        tool_results = []\n        for b in resp.content:\n            if b.type == "tool_use":\n                sig = (b.name, repr(b.input))\n                if sig in seen:\n                    tool_results.append({"type":"tool_result","tool_use_id":b.id,\n                                         "content":"You already called this. Try a different approach."})\n                else:\n                    seen.add(sig)\n                    tool_results.append({"type":"tool_result","tool_use_id":b.id,\n                                         "content":exec_tool(b.name, b.input)})\n        messages.append({"role":"user","content":tool_results})\n    return "max steps reached"`},
    {h:"Claude Agent SDK", body:`<p>Anthropic's official agent SDK — production loop, tool exec, parallel, observability. Docs at <a href="https://docs.anthropic.com/" target="_blank">docs.anthropic.com</a>.</p>`},
    {h:"Patterns", body:`<table>
      <tr><th>Pattern</th><th>When</th></tr>
      <tr><td>Single call</td><td>Q&A, classify</td></tr>
      <tr><td>Tool use (1-2)</td><td>Fetch + answer</td></tr>
      <tr><td>Agent loop</td><td>Multi-step, runtime decisions</td></tr>
      <tr><td>Router</td><td>LLM picks subroutine</td></tr>
      <tr><td>Parallelization</td><td>Independent subtasks</td></tr>
      <tr><td>Orchestrator-workers</td><td>Manager spawns workers</td></tr>
      <tr><td>Evaluator-optimizer</td><td>Produce → grade → loop</td></tr>
    </table>
    <div class="callout warn">Start simple. Don't agentify what 1 prompt solves.</div>`},
    {h:"Failure modes", body:`<ul>
      <li>Infinite loop → max_steps cap + repeat detection</li>
      <li>Hallucinated tool → validate name</li>
      <li>Bad schema → let model retry with error</li>
      <li>Cost runaway → per-task token/$ cap</li>
      <li>Security → never shell=True on untrusted; sandbox</li>
    </ul>`},
    {h:"Observability", body:`<ul>
      <li>Log (prompt, response, tools, tokens, latency, $) per step</li>
      <li><a href="https://langfuse.com" target="_blank">Langfuse</a>, <a href="https://helicone.ai" target="_blank">Helicone</a>, or SQLite+dashboard</li>
    </ul>`},

    {h:"An agent is a loop", body:`<p>Strip away all the marketing language and an AI agent is three things: an LLM, a set of tools, and a while-loop. That is it. At each iteration of the loop, the model decides what to do next based on everything that has happened so far. The loop ends when the model declares it is finished.</p>
    <p><b>Concrete trace: "Find the cheapest flight Sydney to Tokyo in March"</b></p>
    <p>The messages list starts with just the user's request. Watch how it grows.</p>
    <ul>
      <li><b>Turn 1:</b> model sees the user request, calls <code>search_flights(origin="SYD", destination="TYO", month="March")</code>. Your code runs the function. 23 results appended to messages.</li>
      <li><b>Turn 2:</b> model sees 23 results, calls <code>filter_by_price(results=..., max_price=800)</code>. Your code runs it. 5 results appended to messages.</li>
      <li><b>Turn 3:</b> model sees the 5 filtered results and writes the final answer: "The cheapest flight is Jetstar JS101 at $642." Stop reason is <code>end_turn</code> (not <code>tool_use</code>), so the loop exits.</li>
    </ul>
    <p>Notice the messages list grew from 1 item to 7 items across three turns. The model's "memory" of prior steps is entirely in that growing list — there is no hidden state.</p>
    <div class="mistake"><b>Common mistake:</b> no maximum-iterations cap on the loop. If something goes wrong (bad tool output, ambiguous task, the model gets "confused"), the loop can run forever, calling tools repeatedly and burning API costs. Always add a <code>max_turns</code> limit and a dollar-spend cap that kills the loop if either is exceeded.</div>`,
    code:`import anthropic
client = anthropic.Anthropic()

TOOLS = [
    {
        "name": "search_flights",
        "description": "Search for flights between two cities in a given month.",
        "input_schema": {
            "type": "object",
            "properties": {
                "origin": {"type": "string"},
                "destination": {"type": "string"},
                "month": {"type": "string"}
            },
            "required": ["origin", "destination", "month"]
        }
    }
]

def run_tool(name, args):
    # In a real app, call an actual flights API here.
    if name == "search_flights":
        return "Flight results: Jetstar JS101 $642, Qantas QF21 $890"
    return "unknown tool"

messages = [{"role": "user", "content": "Find cheapest flight Sydney to Tokyo in March"}]

MAX_TURNS = 10
for turn in range(MAX_TURNS):
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=TOOLS,
        messages=messages,
    )
    messages.append({"role": "assistant", "content": resp.content})

    if resp.stop_reason == "end_turn":
        # The model finished. Print the final answer.
        print(next(b.text for b in resp.content if b.type == "text"))
        break

    # The model wants to call a tool.
    results = []
    for block in resp.content:
        if block.type == "tool_use":
            output = run_tool(block.name, block.input)
            results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": output
            })
    messages.append({"role": "user", "content": results})
else:
    print("Reached max turns without finishing.")`},

    {h:"Tool design rules", body:`<p>The quality of your tools determines the reliability of your agent far more than which model you use. A poorly described tool will be misused or skipped. A well-described tool gives the model everything it needs to make the right call.</p>
    <h4>Rule 1: Keep the tool count small</h4>
    <p>Between 3 and 7 tools is the sweet spot for most agents. When a model sees 30 tools, it has to choose among them for every step — choice paralysis leads to wrong calls. If you have many related functions, group them or let the agent request more tools as needed.</p>
    <h4>Rule 2: Names say what the tool does</h4>
    <ul>
      <li><b>Bad:</b> <code>helper2</code>, <code>process_data</code>, <code>do_thing</code></li>
      <li><b>Good:</b> <code>search_flights_by_route</code>, <code>get_customer_order_history</code>, <code>send_support_email</code></li>
    </ul>
    <h4>Rule 3: Descriptions are written for the model, not for humans</h4>
    <p>The description should answer three questions: (1) when should I call this tool? (2) when should I NOT call it? (3) what does a valid call look like?</p>
    <h4>Rule 4: Use typed schemas with required fields</h4>
    <p>The <code>input_schema</code> tells the model what arguments to provide and what type each should be. Always mark fields as required if the tool will fail without them. The model reads the schema and constructs the arguments — a clear schema reduces argument errors.</p>
    <h4>Rule 5: Return errors as result content, not as exceptions</h4>
    <p>If a tool fails (invalid city code, network timeout, permission denied), do NOT raise an exception that crashes the loop. Instead, return a plain-English error string as the tool result so the model can read it and self-correct.</p>
    <ul>
      <li><b>Bad:</b> <code>raise ValueError("Unknown city code")</code> &rarr; crashes the agent loop</li>
      <li><b>Good:</b> return <code>"error: city code 'XYZ' not recognised. Use IATA codes like SYD, TYO, LHR."</code> &rarr; model sees the error and tries a corrected argument next turn</li>
    </ul>
    <div class="mistake"><b>Common mistake:</b> writing tool descriptions aimed at human readers ("This helper function processes the input data and returns the result"). The model needs operational guidance, not documentation. Write: "Use this tool when the user asks about flight prices. Do NOT use this for hotel searches. Provide origin and destination as IATA airport codes (e.g. SYD, NRT)."</div>`},

    {h:"Why agents fail: error compounding", body:`<p>This is the most important reliability concept for agent builders. It sounds like simple maths but the implications are severe.</p>
    <p><b>The maths:</b> suppose each step in your agent has a 95% chance of succeeding. That sounds excellent. But success for the whole task requires every step to succeed.</p>
    <ul>
      <li>10 steps: 0.95<sup>10</sup> &asymp; 0.599 &asymp; <b>60% task success rate</b></li>
      <li>20 steps: 0.95<sup>20</sup> &asymp; 0.358 &asymp; <b>36% task success rate</b></li>
    </ul>
    <p>A 95%-reliable agent over 20 steps succeeds only about a third of the time. Reliability falls <b>exponentially</b> as chain length grows. This is why experienced agent builders keep chains short.</p>
    <p><b>Mitigations — in order of effectiveness:</b></p>
    <ol>
      <li><b>Fewer, bigger steps.</b> Instead of 10 small tool calls, design 3 larger ones. Each combines what would have been multiple actions. Fewer steps means fewer failure points.</li>
      <li><b>Checkpoints.</b> After major steps, validate the intermediate result before continuing. "Does this list of flights make sense? Are there at least 2 results?" If validation fails, stop and report rather than continuing with garbage input.</li>
      <li><b>Verification steps.</b> After the agent produces an output, a cheap second LLM call checks: "Does this output satisfy the original goal?" If not, retry once. This catches silent failures where the model produced something plausible but wrong.</li>
      <li><b>Fail fast and report.</b> When something goes wrong, stop and tell the user rather than continuing with a corrupted state. A clear error message is better than a confident wrong answer.</li>
    </ol>
    <div class="mistake"><b>Common mistake:</b> designing a 20-step agent pipeline and expecting it to be reliable. At 95% per-step accuracy, a 20-step pipeline has roughly a coin-flip chance of completing successfully. If your task truly needs 20 steps, plan for failures: checkpoints, retries, and human review of outputs.</div>`},

    {h:"Guardrails and the human in the loop", body:`<p>Every guardrail in an agent is a <b>line of code</b>, not a line in the system prompt. "Be careful" in a prompt is not a guardrail. <code>if spend &gt; limit: stop()</code> is a guardrail. This distinction matters because the model can be tricked, confused, or simply wrong — your code cannot be prompted into ignoring a hard limit.</p>
    <table>
      <tr><th>What to guard</th><th>How (in code)</th></tr>
      <tr><td>Spend cap</td><td>Count tokens per session (from <code>resp.usage</code>). Hard-stop the loop when cumulative cost exceeds your limit. Never let the model decide when to stop spending.</td></tr>
      <tr><td>Allowed-tools list</td><td>An agent built for handling refunds should have NO access to <code>delete_user</code> or <code>send_mass_email</code>. Only give tools needed for the specific task. This is the principle of <b>least privilege</b>.</td></tr>
      <tr><td>Confirm before irreversible actions</td><td>Tools that send emails, charge cards, or delete data should return a sentinel string like <code>"CONFIRMATION REQUIRED: about to send email to 200 users. Confirm? yes/no"</code>. Your code pauses and waits for a human click before executing.</td></tr>
      <tr><td>Audit log</td><td>Append every tool call, its arguments, and its result to a log file. If something goes wrong, you must be able to reconstruct exactly what the agent did and in what order.</td></tr>
      <tr><td>Output filter</td><td>Validate the agent's final answer before showing it to the user. If the task requires JSON output, parse it; if parsing fails, surface an error instead of malformed text.</td></tr>
    </table>
    <p><b>Principle: minimum tools for the job.</b> Before adding a tool to an agent, ask: "Could this tool cause irreversible harm if called with wrong arguments?" If yes, either remove it, add a confirmation gate, or scope it to only safe operations (read-only variant).</p>
    <div class="mistake"><b>Common mistake:</b> giving one "super agent" all available tools and relying on the system prompt to constrain its behaviour. System prompts can be worked around. The only reliable constraint is removing the tool from the agent's definition entirely.</div>`},
  ],
  quiz:[
    {type:"mcq", q:"Agent stuck repeating same tool. Fix?", options:["Bigger model","Detect repeated (tool,args) → break loop with 'try different' nudge","More steps","No streaming"], answer:1, explain:"Cheapest reliable fix. Bigger model only marginal."},
    {type:"mcq", q:"When single call beats agent?", options:["Never","Whenever task decomposes into one tool + one response","Always","Chat only"], answer:1, explain:"Agentic loops add latency/cost/failures. Only when LLM must decide ordering."},
    {type:"mcq", q:"Where enforce cost caps?", options:["Prompt","Harness — per-step counter, hard kill","Claude itself","Cannot"], answer:1, explain:"Never trust model. Harness owns the loop."},
    {type:"short", q:"Web research agent failure modes?", model:"(1) Max 15 steps. (2) Step 30s + total 5min timeout. (3) $0.50 cap → abort partial. (4) Repeat query 3x → nudge 'broaden'. (5) try/except per fetch. (6) Truncate page to 5k tokens. (7) Validator scores report; 1 retry on fail. (8) SQLite trace. (9) Sandbox (no localhost, respect robots). (10) Stream partial progress.", rubric:["step/time/cost caps","repeat detection","error handling","truncation","logging","sandbox"]},
  ],
  project:{title:"Phase 11 deliverable", steps:["Research agent: topic → report","Code review agent on PR diff","Observability dashboard"]}
}
));
