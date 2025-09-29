import { Transaction } from "@mysten/sui/transactions";

export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string,
) => {
  const tx = new Transaction();

  // EN: Add moveCall to create a hero.
  // RU: Добавляем вызов Move-функции для создания героя.
  tx.moveCall({
    target: `${packageId}::hero::create_hero`, // EN: Path to Move function. RU: Путь к функции Move.
    arguments: [
      tx.pure.string(name), // EN: Hero name. RU: Имя героя.
      tx.pure.string(imageUrl), // EN: Hero image URL. RU: URL картинки героя.
      tx.pure.u64(BigInt(power)) // EN: Hero power as u64. RU: Сила героя как u64.
    ]
  });

  return tx;
};
