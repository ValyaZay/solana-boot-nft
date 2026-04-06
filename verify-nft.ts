import { createNft, fetchDigitalAsset, findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

console.log("Loaded user ", umiUser.publicKey);
umi.use(keypairIdentity(umiUser)); // make it default signer of a tx

console.log("Set up Umi instance for user");

// verify that nft is a part of that collection
const collectionAddress = publicKey("EpfB25VRXtrX2givG8kUCYjicPeoZNhtUJxup62pT2G7");
const nftAddress = publicKey("GYRPVqcysX488vxQtUfG8gh1ptwc79viQ6hYUTywzuax");

const transaction = verifyCollectionV1(umi, { 
    metadata: findMetadataPda(umi, {mint: nftAddress}), 
    collectionMint: collectionAddress, 
    authority: umi.identity
});

transaction.sendAndConfirm(umi);
console.log(`Nft at address ${nftAddress} is verified to be a member of collection at ${collectionAddress}. See Explorer at ${getExplorerLink("address", nftAddress, "devnet")}`);