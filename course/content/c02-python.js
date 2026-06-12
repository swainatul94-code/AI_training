// c02-python — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 2 },
{ id:1, title:"Phase 0.5 — Python Basics", est:"8-15 hrs",
  intro:"This phase teaches Python basics. Everything explained from scratch, no prior coding assumed. Skim ONLY if you can read all the code below at a glance and want to skip.",
  lessons:[
    {h:"Optional QA → Python analogies (skip if not from QA background)", body:`<p>If you've done QA testing before, these analogies may help. If not, skip — every term below is taught from scratch in the following lessons.</p>
    <table>
      <tr><th>QA concept</th><th>Python concept</th></tr>
      <tr><td>Test data / fixture</td><td>Variable, dict, list</td></tr>
      <tr><td>Test helper function</td><td><code>def func():</code></td></tr>
      <tr><td>Page Object Model</td><td>Class (<code>class Page:</code>)</td></tr>
      <tr><td>Test step / assertion</td><td><code>assert</code></td></tr>
      <tr><td>Expected exception</td><td><code>try/except</code></td></tr>
      <tr><td>Test runner (pytest/TestNG)</td><td>pytest library (taught later this phase)</td></tr>
      <tr><td>Logging / report</td><td><code>print()</code>, <code>logging</code> module</td></tr>
      <tr><td>BDD steps</td><td>A function = one step, called by name</td></tr>
    </table>
    <div class="callout"><b>Core idea:</b> A program is inputs → behavior → outputs. ML adds "the behavior is <i>learned</i> from examples" instead of written by hand. Everything else stays the same.</div>`},
    {h:"Python basics — variables & types", body:"<p>Everything is an object. No type declarations needed.</p>", code:`# numbers, strings, booleans\nx = 42                # int\npi = 3.14             # float\nname = "ada"          # str\nactive = True         # bool\n\n# containers\nnumbers = [1, 2, 3]                          # list (mutable, ordered)\npoint = (10, 20)                              # tuple (immutable)\nuser = {"name": "ada", "age": 35}            # dict (key→value)\ntags = {"ml", "qa", "python"}                 # set (unique)\n\n# type check\nprint(type(x))           # <class 'int'>\nprint(isinstance(x, int))# True`},
    {h:"Control flow", body:"", code:`# if/elif/else\nscore = 85\nif score >= 90: grade = "A"\nelif score >= 80: grade = "B"\nelse: grade = "C"\n\n# for loop\nfor n in [1,2,3]: print(n*n)\nfor k, v in {"a":1,"b":2}.items(): print(k, v)\n\n# while\ni = 0\nwhile i < 3:\n    print(i); i += 1\n\n# list comprehension (very Pythonic)\nsquares = [n*n for n in range(10) if n % 2 == 0]\n# = [0, 4, 16, 36, 64]`},
    {h:"Functions", body:"", code:`# basic function\ndef add(a, b):\n    return a + b\n\n# default args + keyword args\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\ngreet("Ada")                      # "Hello, Ada!"\ngreet("Ada", greeting="Hi")       # "Hi, Ada!"\n\n# *args (variable positional), **kwargs (keyword dict)\ndef debug(*args, **kwargs):\n    print("args:", args)\n    print("kwargs:", kwargs)\n\ndebug(1, 2, 3, name="ada", age=35)`},
    {h:"Classes (Page Object analogue)", body:"", code:`class User:\n    def __init__(self, name, age):     # constructor (auto-called)\n        self.name = name\n        self.age = age\n    def greet(self):\n        return f"Hi, I'm {self.name}"\n    def __repr__(self):\n        return f"User({self.name!r}, {self.age})"\n\nu = User("Ada", 35)\nprint(u.greet())     # Hi, I'm Ada\nprint(u)             # User('Ada', 35)`},
    {h:"Errors + exceptions (like expected test failures)", body:"", code:`def divide(a, b):\n    if b == 0:\n        raise ValueError("can't divide by zero")\n    return a / b\n\ntry:\n    divide(10, 0)\nexcept ValueError as e:\n    print(f"caught: {e}")\nfinally:\n    print("cleanup runs always")`},
    {h:"File I/O", body:"", code:`# read\nwith open("data.txt") as f:\n    text = f.read()\n\n# write\nwith open("out.txt", "w") as f:\n    f.write("hello\\nworld")\n\n# read lines\nwith open("data.txt") as f:\n    for line in f:\n        print(line.strip())`},
    {h:"pytest — automated testing in Python", body:`<p><b>What it is:</b> pytest is a library that runs your test functions and reports which pass/fail. It's the Python equivalent of JUnit (Java) or TestNG.</p>
    <p><b>Why ML projects need testing:</b></p>
    <ul>
      <li>Catch regressions when refactoring data preprocessing</li>
      <li>Verify your loss function math against known cases</li>
      <li>Sanity-check that model output shapes are correct</li>
      <li>Run automatically in CI on every git push (block bad PRs)</li>
    </ul>
    <h4>Install</h4>
    <pre><code>uv pip install pytest</code></pre>
    <h4>How pytest works (the 3 rules)</h4>
    <ol>
      <li>Files named <code>test_*.py</code> are discovered automatically</li>
      <li>Functions named <code>test_*</code> inside those files are run as tests</li>
      <li>Each test passes if no exception (especially no <code>assert</code> failure); fails otherwise</li>
    </ol>
    <h4>Your first test</h4>
    <p>Save the code below as <code>test_math.py</code> next to your code. From PowerShell in same folder: <code>pytest -v</code></p>
    <p><b>What each piece means:</b></p>
    <ul>
      <li><code>def add(a, b)</code> = the function we're testing (would normally be in a separate <code>math.py</code> file)</li>
      <li><code>def test_add_positive()</code> = a test function (name MUST start with <code>test_</code>)</li>
      <li><code>assert add(2, 3) == 5</code> = the actual check. If equal, pass. If not, pytest prints the failure.</li>
      <li><code>@pytest.mark.parametrize</code> = decorator that runs the same test multiple times with different inputs. Saves writing 10 nearly-identical tests.</li>
      <li><code>pytest -v</code> = <i>v</i>erbose flag, shows each test name as it runs</li>
    </ul>`, code:`# test_math.py
def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

import pytest
@pytest.mark.parametrize("a,b,expected", [
    (1, 1, 2),
    (0, 0, 0),
    (2, 3, 5),
])
def test_add_param(a, b, expected):
    assert add(a, b) == expected

# Run from the same folder:
#   pytest test_math.py -v
# Output: 5 passed in 0.01s`},
    {h:"List + dict tricks worth knowing", body:"", code:`# unpacking\na, b, c = [1, 2, 3]\nfirst, *rest = [1, 2, 3, 4]   # first=1, rest=[2,3,4]\n\n# dict comprehension\nsquares = {n: n*n for n in range(5)}\n\n# enumerate (index + value)\nfor i, val in enumerate(["a","b","c"]):\n    print(i, val)\n\n# zip (iterate parallel)\nfor name, age in zip(["Ada","Bob"], [35, 40]):\n    print(name, age)\n\n# sorted with key\nusers = [{"n":"Ada","age":35},{"n":"Bob","age":28}]\nby_age = sorted(users, key=lambda u: u["age"])`},
    {h:"Project structure for ML", body:`<pre><code>AI_training/\n├── README.md\n├── requirements.txt\n├── .gitignore\n├── data/         # datasets (often gitignored)\n├── notebooks/    # exploration\n├── src/          # reusable modules\n│   ├── __init__.py\n│   └── train.py\n├── tests/        # pytest tests\n└── scripts/      # one-off runners</code></pre>`},
    {h:"Variables are labeled boxes (and Python's 4 basic types)", body:`<p>A <b>variable</b> is a name that points to a value stored in memory. Think of it as a labeled box: you put something in, stick a label on the outside, and later you can grab it by label without remembering exactly where in memory it lives.</p>
<p>Python has four fundamental types you'll use constantly:</p>
<table>
<tr><th>Type</th><th>What it holds</th><th>Example</th><th>Check with type()</th></tr>
<tr><td><b>int</b></td><td>Whole numbers, no decimal</td><td><code>42</code>, <code>-7</code>, <code>0</code></td><td><code>&lt;class 'int'&gt;</code></td></tr>
<tr><td><b>float</b></td><td>Numbers with a decimal point</td><td><code>3.14</code>, <code>-0.5</code></td><td><code>&lt;class 'float'&gt;</code></td></tr>
<tr><td><b>str</b></td><td>Text, always in quotes</td><td><code>"hello"</code>, <code>'42'</code></td><td><code>&lt;class 'str'&gt;</code></td></tr>
<tr><td><b>bool</b></td><td>True or False only</td><td><code>True</code>, <code>False</code></td><td><code>&lt;class 'bool'&gt;</code></td></tr>
</table>
<p>Notice that <code>'42'</code> (with quotes) is a <b>str</b>, not an <b>int</b>. This matters enormously: you cannot do arithmetic on a string. Python treats <code>'42'</code> the same way it treats <code>'banana'</code> — as text.</p>
<p><b>Worked example — the TypeError trap:</b></p>
<ul>
  <li>You read a number from user input. Python gives it to you as a string: <code>age = "25"</code></li>
  <li>You try <code>age + 5</code> → Python raises <code>TypeError: can only concatenate str (not "int") to str</code></li>
  <li>Fix: convert first → <code>int("25") + 5</code> → <code>30</code></li>
  <li>Check the type at any moment: <code>type(age)</code> → <code>&lt;class 'str'&gt;</code></li>
</ul>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Forgetting that input() always returns a string. Always wrap with int() or float() when you expect a number.</li>
<li>Mixing up <code>==</code> (comparison, asks "are these equal?") with <code>=</code> (assignment, stores a value). Writing <code>if x = 5</code> is a SyntaxError.</li>
<li>Assuming <code>True</code> and <code>False</code> must be lowercase everywhere — they do in Python, but other languages differ. Caps-first is Python's rule.</li>
</ul>`, code:`# The four basic types
score = 95          # int
rate  = 0.085       # float
name  = "Ada"       # str
passed = True       # bool

# Check type at any time
print(type(score))   # <class 'int'>
print(type(name))    # <class 'str'>

# THIS CRASHES — str + int is illegal
# result = "5" + 5   # TypeError!

# Fix: convert first
result = int("5") + 5   # 10
print(result)            # 10

# Also useful: str() converts the other direction
message = "Score: " + str(score)   # "Score: 95"`},
    {h:"Lists vs dictionaries — when to use each", body:`<p>Python has two workhorses for storing collections of values: <b>lists</b> and <b>dictionaries</b>. They look similar but solve different problems. Picking the wrong one makes your code twice as hard to write.</p>
<p><b>List</b> = a numbered shelf. Items sit in slots numbered 0, 1, 2, … You grab an item by its position. Order matters. Use a list when the position itself is meaningful (first place, second place) or when you just need to store a sequence and loop over it.</p>
<p><b>Dictionary</b> = a set of labeled drawers. Each drawer has a name (the <b>key</b>) and holds something (the <b>value</b>). You grab an item by its label. Order doesn't usually matter. Use a dict when you constantly look things up by name rather than by position.</p>
<p><b>Mental model:</b> a list is a ranked leaderboard; a dictionary is an address book. You look up "Ada" in an address book, not "person number 4."</p>
<p>The same student scores data, stored both ways:</p>
<p>As a <b>list</b> — useful when all you need is to loop through scores: <code>[88, 92, 75, 96]</code><br>
As a <b>dict</b> — useful when you need to look up a specific student: <code>{"Ada": 88, "Bob": 92, "Cat": 75, "Dan": 96}</code></p>
<p>Want Ada's score? With a list you'd have to remember she's at index 0 and hope the order never changes. With a dict: <code>scores["Ada"]</code> — clear, unambiguous, safe.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li><b>IndexError: list index out of range</b> — you asked for position 5 of a 4-item list. Lists are 0-indexed: a 4-item list has positions 0, 1, 2, 3. Position 4 doesn't exist.</li>
<li><b>KeyError</b> — you asked for a dict key that doesn't exist. Use <code>scores.get("Eve", 0)</code> to return a default instead of crashing.</li>
<li>Using a list when you constantly search by name. Searching a list by value (finding who scored 88) requires looping through the whole thing. A dict lookup is instant.</li>
</ul>`, code:`# Same data — list vs dict
# AS A LIST (access by position)
scores_list = [88, 92, 75, 96]
print(scores_list[0])       # 88  (Ada's score — but you must remember index 0 = Ada)
print(scores_list[1])       # 92  (Bob)
# scores_list[4]            # IndexError! No position 4 in a 4-item list.

# AS A DICT (access by name)
scores_dict = {"Ada": 88, "Bob": 92, "Cat": 75, "Dan": 96}
print(scores_dict["Ada"])         # 88 — clear which student
print(scores_dict["Bob"])         # 92
# scores_dict["Eve"]              # KeyError! "Eve" not in dict.
print(scores_dict.get("Eve", 0))  # 0  — safe: returns default if missing

# Loop a dict — both key and value
for name, score in scores_dict.items():
    print(f"{name}: {score}")`},
    {h:"Loops and functions, by tracing", body:`<p>A <b>loop</b> is an instruction to repeat a block of code for each item in a collection. A <b>function</b> is a reusable block of code that takes inputs (called <b>arguments</b>) and produces an output (called a <b>return value</b>).</p>
<p>The best way to understand both is to trace through them step by step with real numbers — do it on paper at least once, then you'll never be confused again.</p>
<p><b>Tracing a for loop:</b> <code>for n in [3, 7, 2]: total += n</code> (assume total starts at 0)</p>
<table>
<tr><th>Iteration</th><th>n</th><th>total before</th><th>total after</th></tr>
<tr><td>1</td><td>3</td><td>0</td><td>0 + 3 = 3</td></tr>
<tr><td>2</td><td>7</td><td>3</td><td>3 + 7 = 10</td></tr>
<tr><td>3</td><td>2</td><td>10</td><td>10 + 2 = 12</td></tr>
</table>
<p>After the loop, <code>total</code> is 12. The loop ran exactly once per item in the list.</p>
<p><b>Functions — the recipe analogy:</b> a recipe has ingredients (arguments) and produces a dish (return value). You write the recipe once and call it with different ingredients any time. The function doesn't run when you <em>define</em> it (write the recipe); it runs when you <em>call</em> it (cook the dish).</p>
<p><b>Mental model:</b> <code>def</code> = write the recipe. The function name = the recipe card. Calling the function = actually cooking it. <code>return</code> = the dish comes out of the oven.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Forgetting <code>total = 0</code> before the loop. Python will raise a NameError on <code>total += n</code> if total was never defined.</li>
<li>Defining a function but never calling it. Writing <code>def add(a, b):</code> does nothing by itself — you must also write <code>add(3, 4)</code> somewhere.</li>
<li>Forgetting <code>return</code>. A function without a return statement returns <code>None</code> silently. If you assign the result to a variable and then use it, you'll get a confusing NoneType error later.</li>
</ul>`, code:`# TRACING THE LOOP
total = 0                   # start here
for n in [3, 7, 2]:
    total += n              # += means total = total + n
print(total)                # 12

# FUNCTION — write once, call many times
def add_numbers(a, b):
    result = a + b
    return result           # sends the value back to the caller

answer = add_numbers(3, 4)  # call it — now answer = 7
print(answer)               # 7
print(add_numbers(10, 20))  # 30 — same recipe, different ingredients

# Function with no return is a common trap
def broken(a, b):
    a + b                   # computed but NOT returned

x = broken(3, 4)
print(x)                    # None — not 7!`},
    {h:"f-strings and slicing — the two tools you'll use daily", body:`<p>Two Python features appear in almost every script you'll ever write: <b>f-strings</b> for building text, and <b>slicing</b> for cutting sequences. Learn them once, use them forever.</p>
<p><b>f-strings</b> (formatted string literals) are fill-in-the-blank strings. Put an <code>f</code> in front of the opening quote, then wrap any variable or expression in curly braces <code>{}</code> and Python fills it in at runtime.</p>
<p>Before f-strings, you'd write: <code>"Hello " + name + ", you scored " + str(score)</code> — awkward, error-prone. With f-strings: <code>f"Hello {name}, you scored {score}"</code> — clean and readable.</p>
<p><b>Slicing</b> cuts a piece out of a sequence (string, list, or tuple) without modifying the original. The syntax is <code>sequence[start:stop]</code>. Python returns characters/items from position <code>start</code> up to but <em>not including</em> position <code>stop</code>.</p>
<p><b>Worked example — slicing the word "transformer":</b></p>
<table>
<tr><th>Slice</th><th>Meaning</th><th>Result</th></tr>
<tr><td><code>"transformer"[0]</code></td><td>Single character at position 0</td><td><code>'t'</code></td></tr>
<tr><td><code>"transformer"[-1]</code></td><td>Last character (negative counts from end)</td><td><code>'r'</code></td></tr>
<tr><td><code>"transformer"[0:5]</code></td><td>Positions 0, 1, 2, 3, 4 — NOT 5</td><td><code>'trans'</code></td></tr>
<tr><td><code>"transformer"[5:]</code></td><td>Position 5 to the end</td><td><code>'former'</code></td></tr>
<tr><td><code>"transformer"[::2]</code></td><td>Every 2nd character (step=2)</td><td><code>'tasomr'</code></td></tr>
</table>
<p><b>The off-by-one rule (memorise this):</b> <code>[0:5]</code> gives you positions 0, 1, 2, 3, 4 — that's 5 characters, but the stop index (5) is excluded. Think of it as "start at 0, stop before 5."</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Expecting <code>[0:5]</code> to include position 5. It never does. The stop is always exclusive.</li>
<li>Forgetting the <code>f</code> prefix. <code>"Hello {name}"</code> prints the literal text <code>Hello {name}</code>, not the variable's value.</li>
<li>Putting expressions outside the braces. <code>f"result: x + y"</code> prints the string literally. It must be <code>f"result: {x + y}"</code>.</li>
</ul>`, code:`# F-STRINGS
name = "Ada"
score = 92
grade = "A"

# Old way (ugly)
msg_old = "Hello " + name + ", score: " + str(score)

# f-string (clean)
msg = f"Hello {name}, score: {score}, grade: {grade}"
print(msg)   # Hello Ada, score: 92, grade: A

# Any expression works inside {}
print(f"Double score: {score * 2}")    # Double score: 184
print(f"Pass? {score >= 60}")          # Pass? True

# SLICING
word = "transformer"
print(word[0])      # t      — position 0
print(word[-1])     # r      — last character
print(word[0:5])    # trans  — positions 0,1,2,3,4 (stop=5 excluded)
print(word[5:])     # former — position 5 to end
print(word[::2])    # tasomr — every 2nd character (positions 0,2,4,6,8,10)

# Slicing a list works the same way
nums = [10, 20, 30, 40, 50]
print(nums[1:4])    # [20, 30, 40]`},
    {h:"Reading other people's Python (the skill nobody teaches)", body:`<p>You will spend more time reading code than writing it. Reading unfamiliar code feels overwhelming until you have a method. Here is a method that always works.</p>
<p><b>Step 1 — Read the imports.</b> The first lines of any Python file list the tools it uses. Each <code>import</code> tells you what category of work this code does. See <code>import anthropic</code>? It talks to Claude. See <code>import csv</code>? It reads spreadsheets. You've learned 80% of the script's purpose in 3 lines.</p>
<p><b>Step 2 — Find the entry point.</b> Where does the code actually start running? Look for <code>if __name__ == "__main__":</code> at the bottom — that block runs when you execute the file directly. If there's no such block, scan for the last few "loose" lines (code that isn't inside a function or class).</p>
<p><b>Step 3 — Follow one piece of data.</b> Pick one input value and trace it through the code: where does it come from, which function touches it first, what does that function return, where does that return value go? Tracing one path gives you the skeleton of the whole program.</p>
<p><b>Mental model:</b> reading code is like following a package through a delivery system. The imports are the warehouses. The entry point is the front door. Following one package (one variable) shows you every step of the route.</p>
<p>The annotated script below is 15 lines. Read the comments as if you're a detective encountering it for the first time.</p>
<p><b>Common novice mistakes:</b></p>
<ul>
<li>Trying to understand every line before moving on. Skim first, trace second, deep-read only what you need.</li>
<li>Ignoring the imports. They're the table of contents.</li>
<li>Starting in the middle. Always start at the entry point and work forward, not from line 1 top-to-bottom.</li>
</ul>`, code:`# READING EXERCISE — trace this script as a detective would

# STEP 1: imports tell us: reads files (pathlib), counts things (collections)
from pathlib import Path
from collections import Counter

# STEP 2: these are helper functions — they don't run yet, just get defined
def load_words(filepath):
    # opens the file, reads all text, splits into a list of words
    text = Path(filepath).read_text()
    return text.lower().split()   # lowercase so "The" and "the" count as one

def top_words(words, n=3):
    # Counter counts how many times each word appears
    # .most_common(n) returns the n most frequent as [(word, count), ...]
    counts = Counter(words)
    return counts.most_common(n)

# STEP 3: entry point — this is where execution actually starts
if __name__ == "__main__":
    words = load_words("sample.txt")   # follow "words" from here...
    top = top_words(words)             # ...into top_words...
    for word, count in top:            # ...then printed here
        print(f"{word}: {count} times")`},
  ],
  quiz:[
    {type:"mcq", q:"Difference between a Python list and a tuple?", options:["No difference","List is mutable; tuple is immutable","Tuple is faster always","List can't hold mixed types"], answer:1, explain:"Lists support append/remove/edit. Tuples are fixed once created. Use tuples for fixed-shape records (coords, return values) and lists for collections that grow."},
    {type:"mcq", q:"What does <code>self</code> mean in a class method?", options:["Reserved keyword","Convention name for the instance the method was called on (first arg auto-passed)","Required by Python","The class itself"], answer:1, explain:"self is not a keyword, just a convention. Python auto-passes the instance as first arg when you call obj.method()."},
    {type:"mcq", q:"What does this print? <code>x = [1,2,3]; y = x; y.append(4); print(x)</code>", options:["[1,2,3]","[1,2,3,4]","Error","[1,2,3,4,4]"], answer:1, explain:"y = x doesn't copy, both names point to same list. Mutating via y mutates x. Tester-relevant bug pattern. Use x.copy() or list(x) for a copy."},
    {type:"short", q:"Translate this QA mental model to Python: 'A page object has methods to interact with elements. Each method returns either a value or another page object.'", model:"In Python: a class with __init__(self, driver) holds element locators, methods (def click_login, def get_title) do interactions, methods return values or other Page instances for navigation. Same pattern as Selenium/Playwright POM. Python adds: properties (@property) for computed attrs, dataclasses for simple data holders, type hints (def click_login(self) -> 'DashboardPage') for IDE help.", rubric:["class with __init__","methods do actions","methods return values/pages"]},
  ],
  project:{title:"Phase 0.5 deliverable", steps:["Write 5 pytest tests for a small Python module","Create a class with constructor + 3 methods","Push to AI_training repo under /python_basics/"]}
}
));
