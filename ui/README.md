## Sui Community Project User Interface

A learning-oriented React DApp that interacts with the smart contracts in the
`move` folder. This application provides an interface to the smart contracts
implemented in the smart contract section of the challenge. The code
intentionally leaves utility function implementations as _TODOs_ to be completed
for challenge finalization.

### What's inside

- **Frontend Framework**: React + TypeScript + Vite
- **Sui Integration**: `@mysten/dapp-kit` for wallet connection and blockchain
  interaction
- **UI Framework**: Radix UI for modern, accessible components
- **Smart Contract Integration**: Connects to `challenge` packages `arena`,
  `hero`, `marketplace` Move modules
- **Features**:
  - **Wallet Connection**: Connect/disconnect Sui wallet with balance display
  - **Hero Creation**: Mint new Hero NFTs with name, image, and power
  - **Hero Management**: View owned heroes with transfer and listing
    capabilities
  - **NFT Marketplace**: Browse and purchase listed heroes from other users
  - **Arena System**: Create arenas and battle heroes with other players
  - **Admin Functions**: Change listing prices and delist heroes (admin only)
  - **Event History**: Track all HeroListed, HeroBought, ArenaCreated, and
    ArenaCompleted events
  - **Real-time Updates**: Automatic UI refresh after each transaction

### Architecture

```
src/
├── components/           # React components
│   ├── WalletStatus.tsx    # Wallet connection & balance
│   ├── CreateHero.tsx      # Hero minting form
│   ├── OwnedObjects.tsx    # User's heroes management
│   ├── SharedObjects.tsx   # Marketplace listings
│   ├── Arenas.tsx          # Arena creation and management
│   └── EventsHistory.tsx   # Transaction history
├── utility/             # Transaction builders (PTBs)
│   ├── heroes/
│   │   └── create_hero.ts  # Hero creation PTB
│   ├── marketplace/
│   │   ├── list_hero.ts    # Hero listing PTB
│   │   └── buy_hero.ts     # Hero purchase PTB
│   ├── arena/
│   │   ├── create_arena.ts # Arena creation PTB
│   │   └── battle.ts       # Battle PTB
│   ├── admin/
│   │   ├── change_price.ts # Price change PTB
│   │   └── delist.ts       # Hero delisting PTB
│   └── helpers/
│       ├── transfer_hero.ts    # Hero transfer PTB
│       └── transfer_admin_cap.ts # Admin cap transfer PTB
├── types/               # TypeScript interfaces
│   ├── hero.ts             # Hero & Event types
│   └── props.ts            # Shared prop interfaces
├── networkConfig.ts     # Network & package configuration
├── main.tsx            # Application entry point
└── App.tsx             # Main application layout
```

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** package manager
- **Slush Wallet** (browser extension)
- **Package ID**: Obtain from your instructor for shared marketplace experience

### Setup Instructions

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Package ID

**⚠️ IMPORTANT**: Get the `packageId` from running `sui client publish` on in
the `move` folder and add it to `src/networkConfig.ts` file:

```typescript

const PACKAGE_ID = ""; // 👈 Set this variable

const { networkConfig } = createNetworkConfig({
  devnet: {
    url: getFullnodeUrl("devnet"),
    variables: { packageId: PACKAGE_ID },
  },
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: { packageId: PACKAGE_ID },
  },
  ...
});
```

#### 3. Complete Utility Functions (TODOs)

Navigate to `src/utility/` and complete the Programmatic Transaction Block (PTB)
implementations:

**Hero Functions (`src/utility/heroes/`):**

**File: `src/utility/heroes/create_hero.ts`**

```typescript
export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string,
) => {
  const tx = new Transaction();

  // TODO: Add moveCall to create a hero
  // Function: `${packageId}::hero::create_hero`
  // Arguments: name (string), imageUrl (string), power (u64)
  // Hints:
  // - Use tx.pure.string() for string arguments
  // - Use tx.pure.u64() for number arguments (convert power to BigInt)

  return tx;
};
```

**Marketplace Functions (`src/utility/marketplace/`):**

**File: `src/utility/marketplace/list_hero.ts`**

```typescript
export const listHero = (
  packageId: string,
  heroId: string,
  priceInSui: string,
) => {
  const tx = new Transaction();

  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // TODO: Add moveCall to list a hero for sale
  // Function: `${packageId}::marketplace::list_hero`
  // Arguments: heroId (object), priceInMist (u64)
  // Hints:
  // - Use tx.object() for the hero object
  // - Use tx.pure.u64() for the price in MIST

  return tx;
};
```

**File: `src/utility/marketplace/buy_hero.ts`**

```typescript
export const buyHero = (
  packageId: string,
  listHeroId: string,
  priceInSui: string,
) => {
  const tx = new Transaction();

  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // TODO: Split coin for exact payment
  // TODO: Add moveCall to buy a hero
  // Function: `${packageId}::marketplace::buy_hero`
  // Arguments: listHeroId (object), paymentCoin (coin)
  // Hints:
  // - Use tx.splitCoins(tx.gas, [priceInMist]) to create payment coin
  // - Use tx.object() for the ListHero object

  return tx;
};
```

**Arena Functions (`src/utility/arena/`):**

**File: `src/utility/arena/create_arena.ts`**

```typescript
export const createArena = (packageId: string, heroId: string) => {
  const tx = new Transaction();

  // TODO: Add moveCall to create a battle place
  // Function: `${packageId}::arena::create_arena`
  // Arguments: heroId (object)
  // Hints:
  // - Use tx.object() for the hero object
  // - This creates a shared object that others can battle against

  return tx;
};
```

**File: `src/utility/arena/battle.ts`**

```typescript
export const battle = (packageId: string, heroId: string, arenaId: string) => {
  const tx = new Transaction();

  // TODO: Add moveCall to start a battle
  // Function: `${packageId}::arena::battle`
  // Arguments: heroId (object), arenaId (object)
  // Hints:
  // - Use tx.object() for both hero and arena objects
  // - The battle winner is determined by hero power comparison
  // - Winner takes both heroes

  return tx;
};
```

**Admin Functions (`src/utility/admin/`):**

**File: `src/utility/admin/change_price.ts`**

```typescript
export const changePrice = (
  packageId: string,
  listHeroId: string,
  newPriceInSui: string,
  adminCapId: string,
) => {
  const tx = new Transaction();

  // TODO: Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
  // TODO: Add moveCall to change hero price (Admin only)
  // Function: `${packageId}::marketplace::change_the_price`
  // Arguments: adminCapId (object), listHeroId (object), newPriceInMist (u64)
  // Hints:
  // - Use tx.object() for objects
  // - Use tx.pure.u64() for the new price

  return tx;
};
```

**File: `src/utility/admin/delist.ts`**

```typescript
export const delist = (
  packageId: string,
  listHeroId: string,
  adminCapId: string,
) => {
  const tx = new Transaction();

  // TODO: Add moveCall to delist a hero (Admin only)
  // Function: `${packageId}::marketplace::delist`
  // Arguments: adminCapId (object), listHeroId (object)
  // Hints:
  // - Use tx.object() for both objects
  // - This requires admin capability verification
  // - Returns the hero to the original seller

  return tx;
};
```

**Helper Functions (`src/utility/helpers/`):**

**File: `src/utility/helpers/transfer_hero.ts`**

```typescript
export const transferHero = (heroId: string, to: string) => {
  const tx = new Transaction();

  // TODO: Transfer hero to another address
  // Use tx.transferObjects() method
  // Arguments: heroId (object), to (address)
  // Hints:
  // - Use tx.object() for object IDs
  // - This is a simple object transfer, not a moveCall

  return tx;
};
```

**File: `src/utility/helpers/transfer_admin_cap.ts`**

```typescript
export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();

  // TODO: Transfer admin capability to another address
  // Use tx.transferObjects() method
  // Arguments: [objects array], recipient address
  // Hints:
  // - Use tx.object() to reference the admin cap
  // - This is a simple object transfer, not a moveCall
  // - The recipient becomes the new admin

  return tx;
};
```

### Development

#### Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Build for Production

```bash
npm run build
```

### Usage Guide

1. **Connect Wallet**: Click "Connect Wallet" to link your Sui wallet
2. **Create Heroes**: Fill the form to mint new Hero NFTs (name, image URL,
   power level)
3. **Manage Heroes**: View your owned heroes, transfer to others, or list for
   sale
4. **Browse Marketplace**: See all listed heroes from the class and purchase
   them
5. **Create Arenas**: Use your heroes to create battle arenas for other players
6. **Battle Heroes**: Challenge other players' arenas with your heroes
7. **Admin Functions**: Change prices or delist heroes (if you have admin
   access)
8. **Track Activity**: Monitor all listing, purchase, arena, and battle events
   in real-time

### Smart Contract Functions

The DApp interacts with these Move module functions:

**Hero Module (`challenge::hero`):**

- **`create_hero(name, image_url, power)`** — Mint a new Hero NFT

**Marketplace Module (`challenge::marketplace`):**

- **`list_hero(hero, price)`** — List hero for sale in marketplace
- **`buy_hero(list_hero, coin)`** — Purchase a listed hero
- **`change_the_price(admin_cap, list_hero, new_price)`** — Change listing price
  (admin only)
- **`delist(admin_cap, list_hero)`** — Remove hero from marketplace (admin only)

**Arena Module (`challenge::arena`):**

- **`create_arena(hero)`** — Create a new arena with a hero
- **`battle(hero, arena)`** — Battle a hero against the arena owner's hero

### Implementation Guide (PTB Mapping)

#### Transaction Structure

```typescript
import { Transaction } from "@mysten/sui/transactions";

const tx = new Transaction();
tx.moveCall({
  target: `${packageId}::hero::function_name`,
  arguments: [
    /* your arguments */
  ],
});
```

#### Argument Types

- **Strings**: `tx.pure.string(value)`
- **Numbers**: `tx.pure.u64(value)`
- **Addresses**: `tx.pure.address(value)`
- **Objects**: `tx.object(objectId)`
- **Coins**: `tx.splitCoins(tx.gas, [amount])`

#### SUI ↔ MIST Conversion

```typescript
// SUI to MIST (for blockchain)
const mistAmount = Number(suiAmount) * 1_000_000_000;

// MIST to SUI (for display)
const suiAmount = Number(mistAmount) / 1_000_000_000;
```

### Troubleshooting

- **"Package not found"**: Verify package ID is correctly set in
  `networkConfig.ts`
- **Transaction fails**: Check wallet has sufficient SUI for gas fees
- **Heroes not loading**: Ensure wallet is connected and on correct network
- **Marketplace empty**: Wait for other users to list heroes, or list your own
- **Buy button disabled**: Ensure exact price match and sufficient balance
- **Linter warnings about unused parameters**: This is normal! The warnings will
  disappear as you complete the TODO functions in `src/utility/` files
- **DApp not working**: Make sure all TODO implementations in utility functions
  are completed

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Radix UI** - Component library
- **@mysten/dapp-kit** - Sui wallet integration
- **@mysten/sui** - Sui SDK for transactions
- **@tanstack/react-query** - Data fetching & caching

### Learning Objectives

By completing this module, you will learn:

1. **Sui dApp Development**: Connect React apps to Sui blockchain
2. **Transaction Building**: Create PTBs (Programmatic Transaction Blocks)
3. **Wallet Integration**: Handle wallet connection and user authentication
4. **Real-time Data**: Query and display blockchain data dynamically
5. **Event Handling**: Listen to and display smart contract events
6. **State Management**: Manage complex UI state with automatic updates
