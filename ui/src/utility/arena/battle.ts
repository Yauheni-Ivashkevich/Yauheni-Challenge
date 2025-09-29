import { Transaction } from "@mysten/sui/transactions";

export const battle = (packageId: string, heroId: string, arenaId: string) => {
  const tx = new Transaction();
  
  // Add moveCall to start a battle.
  tx.moveCall({
    target: `${packageId}::arena::battle`,
    arguments: [
      tx.object(heroId), // Hero object. 
      tx.object(arenaId) // Arena object.
    ]
  });
  
  return tx;
};
