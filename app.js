import { parseTransaction } from "./core/parser.js";
import { saveToDB, loadHistory } from "./core/db.js";

const worker = new Worker("./worker/riskWorker.js", { type: "module" });

const analyzeBtn = document.getElementById("analyzeBtn");
const resultDiv = document.getElementById("result");
const timelineDiv = document.getElementById("timeline");
const historyDiv = document.getElementById("history");

analyzeBtn.onclick = async () => {
  const input = document.getElementById("jsonInput").value;

  try {
    const tx = parseTransaction(input);
    worker.postMessage(tx);
  } catch (err) {
    alert("Invalid JSON format");
  }
};

worker.onmessage = async (e) => {
  const data = e.data;

  resultDiv.innerHTML = `
    Gas Risk: ${data.gasRisk}% <br>
    Network Risk: ${data.networkRisk}% <br>
    Consensus Risk: ${data.consensusRisk}% <br>
    <strong>Overall Risk: ${data.overallRisk}</strong>
  `;

  timelineDiv.innerHTML = "";
  data.timeline.forEach(step => {
    const div = document.createElement("div");
    div.textContent = step;
    timelineDiv.appendChild(div);
  });

  await saveToDB(data);
  loadHistory(historyDiv);
};

loadHistory(historyDiv);
