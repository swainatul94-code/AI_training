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
