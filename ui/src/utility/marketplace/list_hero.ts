import { Transaction } from "@mysten/sui/transactions";

export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string,
) => {
  const tx = new Transaction();

  // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST).
  const priceInMist = BigInt(priceInSui) * 1_000_000_000n;

  // Add moveCall to list a hero for sale.
  tx.moveCall({
    target: `${packageId}::marketplace::list_hero`,
    arguments: [
      tx.object(heroId), // Hero object. 
      tx.pure.u64(priceInMist) // Price in MIST. 
    ]
  }); 

  return tx;
};
