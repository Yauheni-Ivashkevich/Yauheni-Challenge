import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

/**
 * Package ID retrieved from transaction summary, after runnning `sui client publish`
 *
 * Example:
 * ```bash
 *  Published Objects:
 * ┌──
 * │ PackageID: 0xdbd32a4b9802fab3bca9f7c7cb339d9a88d3b271581280cb83df487ce87a65e6
 * │ Version: 1
 * │ Digest: bn8Vs7TgMzhyPN4GtjDdjTfufX67dErp4926bQeCSFr
 * │ Modules: arena, hero, marketplace
 * └──
 */
const PACKAGE_ID = "0x6f250068ad064ed6da398d6923b519be2f0fa8d5861e9e1d023010b30e66cbee";

/**
 * AdminCap ID retrieved from transaction summary after running `sui client publish`
 *
 * Note:
 * This is hardcoded only for development mode (temporary).
 * For production / secure use cases this ID should be loaded from `.env` or a secure config
 * to avoid exposing admin capabilities in public frontend code.
 *
 * Example:
 * ```bash
 *  Created Objects:
 *  ┌──
 *  │ ObjectID: 0xbbd2d1617d56e0eaa39d47dfa34d3663516b30dad6d4b8d6c7b2ff84a4cdeb0d
 *  │ ObjectType: <packageId>::marketplace::AdminCap
 *  └──
 * ```
 */
const ADMIN_CAP_ID = "0xbbd2d1617d56e0eaa39d47dfa34d3663516b30dad6d4b8d6c7b2ff84a4cdeb0d";


const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: { packageId: PACKAGE_ID },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: { packageId: PACKAGE_ID },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: { packageId: PACKAGE_ID },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig, PACKAGE_ID, ADMIN_CAP_ID 
}; 
