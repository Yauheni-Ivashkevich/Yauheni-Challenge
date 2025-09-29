import { Transaction } from "@mysten/sui/transactions";

export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string,
) => {
  const tx = new Transaction();

  // Add moveCall to create a hero.
  tx.moveCall({
    target: `${packageId}::hero::create_hero`, // Path to Move function. 
    arguments: [
      tx.pure.string(name), // Hero name. 
      tx.pure.string(imageUrl), // Hero image URL. 
      tx.pure.u64(BigInt(power)) // Hero power as u64. 
    ]
  });

  return tx;
};
