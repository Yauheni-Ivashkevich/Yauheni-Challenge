import { Transaction } from "@mysten/sui/transactions";

export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string,
) => {
  const tx = new Transaction();

  // EN: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST).
  // RU: Конвертируем SUI в MIST (1 SUI = 1_000_000_000 MIST).
  const priceInMist = BigInt(priceInSui) * 1_000_000_000n;

  // EN: Add moveCall to list a hero for sale.
  // RU: Добавляем вызов Move-функции для выставления героя на продажу.
  tx.moveCall({
    target: `${packageId}::marketplace::list_hero`,
    arguments: [
      tx.object(heroId), // EN: Hero object. RU: Объект героя.
      tx.pure.u64(priceInMist) // EN: Price in MIST. RU: Цена в MIST.
    ]
  }); 

  return tx;
};
