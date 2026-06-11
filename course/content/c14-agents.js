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
