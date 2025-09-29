import { Transaction } from "@mysten/sui/transactions";

export const transferHero = (heroId: string, to: string) => {
  const tx = new Transaction();
  
  // Transfer hero to another address.
  tx.transferObjects(
    [tx.object(heroId)], // EN: Hero object. 
    to // Recipient address. 
  );
  
  return tx;
};