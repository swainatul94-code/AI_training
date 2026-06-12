// c13-rag — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 13 },
{ id:11, title:"Phase 10 — RAG Systems", est:"18-28 hrs",
  intro:"LLMs only know what's in their training data, frozen at some past date. They don't know your company's docs, today's news, or your private notes. RAG (Retrieval-Augmented Generation) fixes this by fetching relevant info at query time and injecting it into the prompt.",
  lessons:[
    {h:"⚠️ Misconceptions to kill before reading further", body:`<div class="trap">
      <div class="wrong">❌ WRONG: "RAG is a special kind of model."</div>
      <div class="right">✅ RIGHT: RAG is a PATTERN, not a model. It's just: retrieve relevant text → paste into prompt → call regular LLM. The model is unchanged.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "Embedding similarity = semantic similarity."</div>
      <div class="right">✅ RIGHT: Embeddings approximate semantic similarity WITHIN A DOMAIN. Cross-domain (medical vs legal), or for exact strings (product codes, dates), they often fail. Use hybrid search.</div>
    </div>
    <div class="trap">
      <div class="wrong">❌ WRONG: "Bigger embedding dim = better retrieval."</div>
      <div class="right">✅ RIGHT: Quality of the embedding model > dimension count. A 1024-dim Voyage-3 beats a 4096-dim mediocre model. Try the cheap one first, measure recall.</div>
    </div>`},
    {h:"What RAG is and why it beats fine-tuning for most cases", body:`<p><b>Two ways to give an LLM new knowledge:</b></p>
    <ol>
      <li><b>Fine-tune</b>: bake the knowledge into model weights via training</li>
      <li><b>RAG</b>: keep the model frozen, look up relevant docs at query time, insert them into the prompt</li>
    </ol>
    <p><b>RAG wins when:</b></p>
    <ul>
      <li>Knowledge changes often (you don't want to re-train weekly)</li>
      <li>Need source citations ("according to doc X...")</li>
      <li>Knowledge is private/confidential (can encrypt at rest)</li>
      <li>You have lots of docs but each query only needs a few</li>
    </ul>
    <p><b>Fine-tune wins when:</b></p>
    <ul>
      <li>Teaching a behavior/style (tone, format) not facts</li>
      <li>Knowledge is stable and small enough to fit in weights</li>
      <li>Latency-critical (retrieval adds 100-500ms)</li>
    </ul>
    <p>Most production AI apps use RAG + sometimes fine-tune on top.</p>`},
    {h:"The RAG pipeline (6 steps)", body:`<ol>
      <li><b>Ingest</b>: load source docs (PDFs, web pages, Notion, code) and extract clean text</li>
      <li><b>Chunk</b>: split each doc into pieces small enough to fit in prompt context (e.g., 500-token chunks)</li>
      <li><b>Embed</b>: turn each chunk into a vector using an embedding model (Voyage, Cohere, OpenAI)</li>
      <li><b>Store</b>: save vectors + chunk text in a vector database (Qdrant, pgvector, Pinecone)</li>
      <li><b>Retrieve</b>: when user asks a question, embed the question, find top-k most similar chunks via vector search</li>
      <li><b>Generate</b>: paste the retrieved chunks into Claude's prompt as context, generate answer</li>
    </ol>
    <p><b>Steps 1-4 happen once</b> at ingestion. <b>Steps 5-6 happen per query</b>.</p>`},
    {h:"Chunking — why this is the make-or-break step", body:`<p><b>The dilemma:</b></p>
    <ul>
      <li>Chunks too small (50 tokens) → each chunk loses context. Splits "The customer churned because of..." across chunks.</li>
      <li>Chunks too large (4000 tokens) → retrieval fetches mostly irrelevant text. Wastes context window. Embeddings become "averages" of many topics → less precise.</li>
    </ul>
    <p><b>Sweet spot:</b> 200-800 tokens, with 50-100 token overlap between consecutive chunks.</p>
    <h4>Chunking strategies (in order of sophistication)</h4>
    <ul>
      <li><b>Fixed-size</b>: every N tokens. Simple, usually fine. Use for plain text.</li>
      <li><b>Recursive</b>: try splitting on paragraph breaks; if too big, sentence; if still too big, word. Preserves natural boundaries.</li>
      <li><b>Semantic</b>: use embeddings to find topic boundaries. Slower, occasionally better.</li>
      <li><b>Structural</b>: respect markdown headings, code blocks, tables. Critical for technical docs — never split a function in half.</li>
    </ul>
    <p><b>Always attach metadata</b> to each chunk: source URL, doc title, page number, section heading. Lets you cite sources back to the user.</p>`},
    {h:"Hybrid + reranker", body:`<ul>
      <li>Vector alone misses keywords (proper nouns, codes)</li>
      <li>BM25 sparse catches them</li>
      <li>Merge via reciprocal rank fusion</li>
      <li>Reranker (cross-encoder): top-50 → top-5</li>
    </ul>`},
    {h:"Contextual retrieval (Anthropic)", body:"<p>Prepend LLM-generated chunk context before embedding. ~35% fewer retrieval failures.</p>", code:`context_prompt = f"""<document>{whole_doc}</document>\n<chunk>{chunk}</chunk>\nProvide a short context (1-2 sentences) situating this chunk."""\ncontext = client.messages.create(\n    model="claude-haiku-4-5-20251001",\n    max_tokens=100,\n    messages=[{"role":"user","content":context_prompt}],\n).content[0].text\naugmented_chunk = context + "\\n\\n" + chunk  # embed this`},
    {h:"Minimal RAG", code:`from qdrant_client import QdrantClient\nfrom qdrant_client.models import Distance, VectorParams, PointStruct\nimport voyageai, anthropic\n\nvo = voyageai.Client(); qd = QdrantClient(":memory:"); cl = anthropic.Anthropic()\nqd.recreate_collection("docs", vectors_config=VectorParams(size=1024, distance=Distance.COSINE))\n\nvecs = vo.embed(chunks, model="voyage-3", input_type="document").embeddings\nqd.upsert("docs", [PointStruct(id=i, vector=v, payload={"text":t}) for i,(v,t) in enumerate(zip(vecs, chunks))])\n\ndef ask(q):\n    qv = vo.embed([q], model="voyage-3", input_type="query").embeddings[0]\n    hits = qd.search("docs", query_vector=qv, limit=5)\n    ctx = "\\n\\n".join(h.payload["text"] for h in hits)\n    return cl.messages.create(\n        model="claude-sonnet-4-6", max_tokens=1024,\n        system="Answer ONLY using provided context. If not in context, say so.",\n        messages=[{"role":"user","content":f"<context>{ctx}</context>\\n\\nQ: {q}"}],\n    ).content[0].text`},
    {h:"RAG evals", body:`<ul>
      <li>Recall@k on retrieval</li>
      <li>Faithfulness: claims supported by context? (LLM-judge)</li>
      <li>Relevance: does it answer the question?</li>
      <li><a href="https://github.com/explodinggradients/ragas" target="_blank">RAGAS</a></li>
    </ul>`},

    {h:"Why RAG exists", body:`<p>Before we get into how RAG works, it helps to understand the three problems it solves.</p>
    <p><b>Problem 1: Knowledge cutoff.</b> Every LLM is trained on data collected up to a certain date. After that date, the model knows nothing about what happened in the world. If you ask it about a news event from last week, it will either say it does not know or, worse, confidently make something up.</p>
    <p><b>Problem 2: Private data.</b> Your company's internal wiki, your personal notes, your customer database — none of these were in the model's training data. The model has never seen them.</p>
    <p><b>Problem 3: Hallucination.</b> When a model does not know the answer, it sometimes invents a plausible-sounding one rather than admitting ignorance. This is called hallucination, and it is one of the most dangerous failure modes of LLMs.</p>
    <p><b>RAG's fix:</b> instead of relying on what the model memorised during training, you fetch the relevant documents at question-time and paste them directly into the prompt. The instruction becomes "answer FROM these documents, and only from these documents." This converts a memory exam into an open-book exam.</p>
    <p><b>Mental model:</b> think of the LLM as a brilliant analyst who just arrived on Day 1 with no company context. RAG is the briefing packet you hand them before they answer a client question. They are still doing the reasoning — you are just giving them the facts to reason from.</p>
    <div class="mistake"><b>Common mistake:</b> thinking RAG retrains the model. It does not change the model's weights at all. RAG is literally pasting text into the prompt at runtime. The model is untouched — only the context it receives changes.</div>`},

    {h:"Chunking: the decisions that matter", body:`<p>Before you can search your documents, you must split them into smaller pieces. These pieces are called <b>chunks</b>. Choosing chunk size is the single most important tuning decision in a RAG system.</p>
    <p><b>Why you cannot embed whole documents:</b> embedding models turn text into a single fixed-length vector (a list of numbers representing meaning). If you embed an entire 50-page report, the vector is an average of every topic in that report — it is too blurry to match a specific question accurately.</p>
    <p><b>Worked example:</b> suppose the user asks "What is the refund window for damaged items?" Your document database contains a returns chapter of a policy manual.</p>
    <ul>
      <li><b>100-token chunk</b> (one focused paragraph — the exact refund-for-damage policy): the embedding is dense with refund and damage vocabulary. It is a strong match for the query.</li>
      <li><b>1,000-token chunk</b> (the whole returns chapter: refunds, exchanges, international shipping, restocking fees): the relevant sentence is diluted by 900 unrelated tokens. The embedding blurs across all those topics, so the match score is weaker and the chunk wastes most of the context window with irrelevant text.</li>
    </ul>
    <p><b>The tradeoff:</b> small chunks are precise but may lack surrounding context (a sentence that only makes sense in the paragraph around it). Large chunks are context-rich but produce fuzzy matches. There is no perfect size — you tune for your data.</p>
    <p><b>Overlap:</b> if you cut every 300 tokens with no overlap, a sentence that straddles the boundary between chunk A and chunk B is split in half and lost in both. Adding 50 tokens of overlap (the last 50 tokens of chunk A are repeated as the first 50 tokens of chunk B) ensures every sentence survives in at least one complete chunk.</p>
    <p><b>Starting point:</b> 300&ndash;500 tokens per chunk with 50 tokens of overlap. Measure retrieval quality on a golden set of questions, then tune from there.</p>
    <div class="mistake"><b>Common mistake 1:</b> chunking by character count, which splits mid-word or mid-sentence. Always chunk on token boundaries or natural text boundaries (sentences, paragraphs).</div>
    <div class="mistake"><b>Common mistake 2:</b> no overlap. If your question's answer spans a chunk boundary, you will never retrieve it completely.</div>`},

    {h:"One query, end to end", body:`<p>Let us trace a single user query through a complete RAG system, with toy numbers so every step is concrete.</p>
    <p><b>User question:</b> "What is the refund policy for damaged goods?"</p>
    <p><b>Step 1 — embed the question.</b> The query is turned into a vector, just like the stored chunks were. This puts the question and the documents in the same mathematical space so they can be compared.</p>
    <p><b>Step 2 — cosine similarity search.</b> The system compares the query vector against every stored chunk vector. Cosine similarity is a score between 0 (completely unrelated) and 1 (identical meaning). The results for four example chunks:</p>
    <ul>
      <li>Chunk A (refund policy paragraph): similarity 0.82</li>
      <li>Chunk B (damaged-goods claims paragraph): similarity 0.79</li>
      <li>Chunk C (shipping terms paragraph): similarity 0.41</li>
      <li>Chunk D (company history paragraph): similarity 0.12</li>
    </ul>
    <p><b>Step 3 — retrieve top-k.</b> The system picks the top 2 chunks (A and B) and discards C and D. The threshold for "relevant" is set by you — in this case, top-2 by score.</p>
    <p><b>Step 4 — assemble the prompt.</b> A prompt is built: system instruction + retrieved chunks + the original question. The system instruction says: "Answer ONLY from the provided context. Cite which source you used. If the answer is not in the context, say 'I don't know.'"</p>
    <p><b>Step 5 — Claude generates the answer</b>, grounded in chunks A and B, with a citation.</p>
    <p><b>Debugging map:</b> if something goes wrong, the step tells you where to look.</p>
    <ul>
      <li>Wrong chunks retrieved &rarr; the problem is in the embedding or retrieval step (step 1&ndash;2). Fix: better embedding model, hybrid search, reranker.</li>
      <li>Right chunks retrieved but the answer ignores them &rarr; the problem is in the prompt (step 4). Fix: stronger grounding instruction ("answer ONLY from context").</li>
      <li>"I don't know" returned when the right chunks are present &rarr; instructions are too strict. Fix: relax the grounding instruction slightly.</li>
    </ul>`},

    {h:"When RAG fails: the retrieval debugging guide", body:`<p>RAG can fail silently — Claude gives a fluent, confident answer that is just wrong. The key rule is: <b>log retrieved chunks for every query</b>. You cannot debug retrieval if you cannot see what was retrieved.</p>
    <table>
      <tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
      <tr><td>Answer is in the corpus but wrong chunks were retrieved</td><td>Vocabulary mismatch: the query uses different words than the document (e.g. "damaged goods" in query vs "defective merchandise" in document)</td><td>Try a reranker (a second model that re-scores the top 20 candidates), rewrite the query to match document vocabulary, or add hybrid keyword search (BM25) alongside vector search</td></tr>
      <tr><td>Correct chunks were retrieved but the answer ignores them</td><td>The prompt does not force grounding — Claude defaults to its parametric knowledge</td><td>Add "Answer ONLY from the provided context" to the system prompt and require citations</td></tr>
      <tr><td>Answers are correct but too generic or surface-level</td><td>Chunks are too large — the relevant sentence is buried in 800 tokens of noise</td><td>Re-chunk to smaller sizes (200&ndash;300 tokens); add more overlap</td></tr>
      <tr><td>Retrieval is slow (seconds per query)</td><td>Brute-force search across too many vectors</td><td>Switch to an approximate nearest-neighbour index (HNSW) in your vector database; reduce k (number of retrieved chunks)</td></tr>
    </table>
    <p><b>Golden rule:</b> when an answer is wrong, blame retrieval first, not the model. In the author's experience, 80% of RAG failures are retrieval failures — the right chunks were never given to Claude. Only 20% are generation failures where Claude had the right context but still produced a wrong answer.</p>
    <div class="mistake"><b>Common mistake:</b> when a RAG system gives a wrong answer, immediately trying different prompt wording or a bigger model. First, log the retrieved chunks. If the right answer is not in the retrieved context, no amount of prompting will fix it.</div>`},
  ],
  quiz:[
    {type:"mcq", q:"Query with product codes → wrong chunks. Fix?", options:["Bigger model","Hybrid: vector + BM25","Larger context","Different dim"], answer:1, explain:"Embeddings blur exact strings. BM25 catches tokens. Use both."},
    {type:"mcq", q:"Why reranker after retrieval?", options:["Cheaper","Cross-encoders too slow on millions but great on top-50 → top-K","Qdrant req","Improves embeddings"], answer:1, explain:"Bi-encoder ANN fast/approximate. Cross-encoder reads (q, chunk) pairs jointly → accurate."},
    {type:"mcq", q:"Anthropic contextual retrieval?", options:["Bigger DB","LLM-generated chunk context prepended before embedding","Reranking","Hybrid"], answer:1, explain:"Adds situating context to each chunk → embeddings carry richer signal → 35% fewer failures."},
    {type:"mcq", q:"500-token chunks vs 2000-token chunks — tradeoff?", options:["Same","Small: better precision (less noise per chunk), worse recall (concept may span chunks). Large: opposite + more $ per query","Larger always better","Smaller always better"], answer:1, explain:"Trade precision/recall. Overlap (50-100 tokens) helps. Test on your golden set."},
    {type:"mcq", q:"Vector embeddings vs BM25 — semantic difference?", options:["Same","Embeddings = dense vectors capturing meaning (paraphrase tolerant); BM25 = sparse token-frequency match (exact-string strong)","Embeddings are faster","BM25 is dense"], answer:1, explain:"Why hybrid wins: 'big dog' embeds near 'large canine' (vector) but 'product code XJ-487' needs exact match (BM25). Use both."},
    {type:"short", q:"Confident-but-wrong RAG. Reduce hallucination?", model:"(1) Prompt: 'Answer ONLY from context; else say unknown.' (2) Cite source chunk per claim. (3) Lower temp. (4) Improve retrieval — measure recall@k on golden set. (5) Verifier step: 2nd LLM checks support. (6) Show users sources. (7) Extended thinking for hard queries. (8) Add tool ('search_web') when context insufficient.", rubric:["grounding prompt","citations","fix retrieval","sources","verifier"]},
  ],
  project:{title:"Phase 10 deliverable", steps:["RAG over your PDFs, deployed","Contextual retrieval, measure recall@5 lift","Hybrid + reranker"]}
}
));
