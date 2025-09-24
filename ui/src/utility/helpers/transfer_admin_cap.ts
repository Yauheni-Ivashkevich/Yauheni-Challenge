import { Transaction } from "@mysten/sui/transactions";

export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();
  
  // TODO: Transfer admin capability to another address
  // Use tx.transferObjects() method
  // Arguments: [objects array], recipient address
    // Hints:
    // Use tx.object() to reference the admin cap
    // This is a simple object transfer, not a moveCall
    // The recipient becomes the new admin
  
  return tx;
};
