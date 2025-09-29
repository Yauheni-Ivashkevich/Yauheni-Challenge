import { Transaction } from "@mysten/sui/transactions";

export const changePrice = (packageId: string, listHeroId: string, newPriceInSui: string, adminCapId: string) => {
  const tx = new Transaction();
  
  // Convert SUI to MIST.
  const newPriceInMist = BigInt(newPriceInSui) * 1_000_000_000n;

  // Add moveCall to change hero price (Admin only).
  tx.moveCall({
    target: `${packageId}::marketplace::change_the_price`,
    arguments: [
      tx.object(adminCapId), // Admin capability. 
      tx.object(listHeroId), // Listed hero. 
      tx.pure.u64(newPriceInMist) // New price in MIST. 
    ]
  });
  
  return tx;
};
