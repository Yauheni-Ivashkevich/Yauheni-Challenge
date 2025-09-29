import { Transaction } from "@mysten/sui/transactions";

export const delist = (
  packageId: string,
  listHeroId: string,
  adminCapId: string,
) => {
  const tx = new Transaction();

  // Add moveCall to delist a hero (Admin only).
  tx.moveCall({
    target: `${packageId}::marketplace::delist`,
    arguments: [
      tx.object(adminCapId), // Admin capability. 
      tx.object(listHeroId) // Listed hero. 
    ]
  });

  return tx;
};
