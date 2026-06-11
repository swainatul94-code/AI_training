// c06-classical-ml — course content. Must load before course/engine.js.
window.COURSE_PHASES = window.COURSE_PHASES || [];
COURSE_PHASES.push(Object.assign({ order: 6 },
{ id:4, title:"Phase 3 — Classical ML", est:"20-30 hrs",
  intro:"LLM-only candidates fail interviews. Classical ML teaches the patterns (overfit, regularization, evaluation) that show up in every deep learning project too.",
  lessons:[
    {h:"What classical ML is and why you need it", body:`<p><b>Classical ML</b> = the algorithms before deep learning took over (~2012). Linear regression, decision trees, random forests, gradient boosting, k-nearest neighbors, SVMs.</p>
    <p><b>Why still relevant in 2026:</b></p>
    <ol>
      <li><b>Tabular data still rules.</b> For CSVs with rows of numbers, XGBoost often beats deep learning. Hospital data, financial data, business KPIs — classical wins.</li>
      <li><b>Interviews ask it.</b> Bias-variance, regularization, ROC curves are standard ML interview questions. LLM-only candidates fail.</li>
      <li><b>Concepts transfer.</b> Overfitting, regularization, cross-validation, eval metrics — same concepts apply to LLMs.</li>
      <li><b>Cheap baseline.</b> Always train a simple model first. Beats spending 3 weeks on a neural net that doesn't outperform.</li>
    </ol>
    <p>You don't need to master 20 algorithms. Master 5: linear regression, logistic regression, random forest, gradient boosting (XGBoost), and k-means. Plus eval discipline.</p>`},
    {h:"Supervised landscape", body:`<table>
      <tr><th>Algorithm</th><th>Problem type</th><th>What it does (one line)</th></tr>
      <tr><td>Linear regression</td><td>Continuous target</td><td>Fit a straight line/plane minimizing squared error.</td></tr>
      <tr><td>Logistic regression</td><td>Binary classification</td><td>Linear regression + sigmoid output → probability.</td></tr>
      <tr><td>Decision tree</td><td>Either</td><td>Series of if/else splits chosen to maximize information gain.</td></tr>
      <tr><td>Random forest</td><td>Either</td><td>Many random trees voting. Reduces overfit via averaging.</td></tr>
      <tr><td>XGBoost / LightGBM</td><td>Either</td><td>Trees grown sequentially, each fixing previous errors. SOTA tabular.</td></tr>
      <tr><td>k-Nearest Neighbors</td><td>Either</td><td>Predict using k closest training points. No training, slow predict.</td></tr>
    </table>`},
    {h:"Bias-variance — why models fail (the most-tested ML concept)", body:`<p><b>Two ways a model can be wrong:</b></p>
    <ul>
      <li><b>High bias</b> = "model too simple" → underfits. Picture: trying to fit a sine wave with a straight line.</li>
      <li><b>High variance</b> = "model too sensitive to training data" → memorizes noise. Picture: a wiggly curve hitting every training point but failing on new data.</li>
    </ul>
    <p><b>Diagnose by comparing train vs val accuracy:</b></p>
    <table>
      <tr><th>train acc</th><th>val acc</th><th>diagnosis</th><th>fix</th></tr>
      <tr><td>60%</td><td>60%</td><td>High bias (underfit)</td><td>More features, deeper model, train longer, less regularization</td></tr>
      <tr><td>99%</td><td>70%</td><td>High variance (overfit)</td><td>More data, regularization, simpler model, dropout</td></tr>
      <tr><td>85%</td><td>83%</td><td>Just right (small gap)</td><td>Ship or tune more carefully</td></tr>
      <tr><td>60%</td><td>30%</td><td>Bug — val worse than train shouldn't happen this badly</td><td>Data leakage? Distribution shift? Bad split?</td></tr>
    </table>
    <p><b>Total error decomposition:</b> <code>error = bias² + variance + irreducible_noise</code>. You can trade bias for variance but not eliminate both.</p>`},
    {h:"Regularization — fighting overfitting", body:`<p><b>The setup:</b> overfit models have huge weight magnitudes that perfectly thread the training data. Regularization penalizes those huge weights, forcing simpler solutions.</p>
    <h4>L2 (Ridge)</h4>
    <p>Add <code>λ · Σ wᵢ²</code> to the loss. Larger weights cost more. Result: all weights shrink toward 0 smoothly.</p>
    <p>Geometric picture: solution must lie inside a circle.</p>
    <h4>L1 (Lasso)</h4>
    <p>Add <code>λ · Σ |wᵢ|</code> to the loss. Same idea but absolute value instead of square.</p>
    <p>Geometric picture: solution must lie inside a diamond → optimum often lies on a corner → some weights become exactly 0 → automatic feature selection.</p>
    <p><b>L1 vs L2 cheat:</b> L1 if you want sparse models (only some features matter). L2 if you want smooth shrinkage of all features.</p>
    <h4>Dropout (neural networks)</h4>
    <p>During training, randomly set p fraction of activations to 0 (e.g., p=0.1-0.5). Forces the network to not rely on any single neuron — like training many networks at once.</p>
    <p>Turn OFF at inference (model.eval() in PyTorch).</p>
    <h4>Early stopping</h4>
    <p>Watch validation loss. When it starts rising while train loss falls, stop training. Saves compute and is a form of regularization.</p>`},
    {h:"Metrics", body:`<table>
      <tr><td>Accuracy</td><td>(TP+TN)/N. Bad on imbalance.</td></tr>
      <tr><td>Precision</td><td>TP/(TP+FP)</td></tr>
      <tr><td>Recall</td><td>TP/(TP+FN)</td></tr>
      <tr><td>F1</td><td>2PR/(P+R)</td></tr>
      <tr><td>ROC-AUC</td><td>Threshold-independent</td></tr>
      <tr><td>PR-AUC</td><td>Better for imbalance</td></tr>
    </table>`},
    {h:"sklearn template", code:`from sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.metrics import roc_auc_score\n\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)\nmodels = {\n  "logreg": Pipeline([("s",StandardScaler()),("c",LogisticRegression(max_iter=1000))]),\n  "rf": RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42),\n  "gb": GradientBoostingClassifier(),\n}\nfor n, m in models.items():\n    cv = cross_val_score(m, X_tr, y_tr, cv=5, scoring="roc_auc").mean()\n    m.fit(X_tr, y_tr)\n    print(n, cv, roc_auc_score(y_te, m.predict_proba(X_te)[:,1]))`},
  ],
  quiz:[
    {type:"mcq", q:"train=99%, val=70%. Diagnosis?", options:["Underfit","Overfit — needs regularization or more data","Just right","Bug"], answer:1, explain:"Big train-val gap = memorization. L2, dropout, more data, simpler model."},
    {type:"mcq", q:"99/1 imbalance — worst metric?", options:["F1","Precision","Accuracy","PR-AUC"], answer:2, explain:"All-negative = 99% accuracy but useless. F1/PR-AUC instead."},
    {type:"mcq", q:"L1 vs L2 key difference?", options:["L1 faster","L1 sparse (sel features); L2 smooth shrink","L2 linear only","Same"], answer:1, explain:"L1 corners at axes → exact zeros. L2 smooth → no exact zeros."},
    {type:"mcq", q:"In XGBoost, new trees predict:", options:["y directly","Residual (gradient of loss) from previous","Random","Mean"], answer:1, explain:"Sequential gradient fitting → 'gradient boosting'."},
    {type:"short", q:"What is data leakage?", model:"Info from outside training set sneaks in → val/test scores too optimistic. Examples: fit scaler on full dataset before split; target encoding with global means; features that include future info. Prevent: split FIRST, fit transformers on train only inside sklearn Pipeline, audit temporal semantics.", rubric:["info leaks","preprocess before split","pipeline + fold-aware"]},
  ],
  project:{title:"Phase 3 deliverable", steps:["Linreg from scratch (numpy)","Kaggle House Prices submission, top 30%","Writeup: which model won and why"]}
}
));
