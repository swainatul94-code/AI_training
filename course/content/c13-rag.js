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
