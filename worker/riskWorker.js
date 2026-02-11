self.onmessage = function(e) {
  const tx = e.data;

  const gasRisk = tx.gasLimit < 100000 ? 40 : 10;

  let networkRisk = 0;
  if (tx.networkLoad === "high") networkRisk = 50;
  else if (tx.networkLoad === "medium") networkRisk = 25;
  else networkRisk = 10;

  const consensusRisk = tx.validators < 10 ? 35 : 10;

  const total = gasRisk + networkRisk + consensusRisk;

  const overallRisk =
    total > 80 ? "HIGH" :
    total > 40 ? "MEDIUM" :
    "LOW";

  const timeline = [
    "✔ Submitted",
    "✔ In Mempool",
    "✔ Picked by Validator",
    overallRisk === "HIGH" ? "✖ Consensus Failed" : "✔ Finalized"
  ];

  self.postMessage({
    gasRisk,
    networkRisk,
    consensusRisk,
    overallRisk,
    timeline
  });
};
