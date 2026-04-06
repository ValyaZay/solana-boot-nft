import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();
//await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);
console.log("LAMPORTS_PER_SOL: ", LAMPORTS_PER_SOL);

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

console.log("Loaded user ", umiUser.publicKey);
umi.use(keypairIdentity(umiUser)); // make it default signer of a tx

console.log("Set up Umi instance for user");

const collectionMint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "Valya Test Collection",
    symbol: "VTC",
    uri: "https://raw.githubusercontent.com/ValyaZay/solana-boot-nft/refs/heads/main/nft-collection.json",//should be a json accessed via that uri
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
});
await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);
console.log("Created collection. Address is ", getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet"));
// Loaded user  UXwVCaapzYpGdb9WU9GEeHBJMTzf9sGUA27tteRBNpR
// Created collection. Address is  https://explorer.solana.com/address/EpfB25VRXtrX2givG8kUCYjicPeoZNhtUJxup62pT2G7?cluster=devnet