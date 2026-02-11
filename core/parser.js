export function parseTransaction(input) {
  const tx = JSON.parse(input);

  if (!tx.gasLimit || !tx.validators || !tx.networkLoad)
    throw new Error("Missing required fields");

  return tx;
}
