import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
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

const collectionAddress = publicKey("EpfB25VRXtrX2givG8kUCYjicPeoZNhtUJxup62pT2G7");//umi format of a public key from a collection address
console.log("Creating NFT...");

const mint = generateSigner(umi);
const transaction = await createNft(umi, {
    mint: mint,
    name: "Valya Rose Nft",
    uri: "https://raw.githubusercontent.com/ValyaZay/solana-boot-nft/refs/heads/main/nft-rose.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false,
    }
});

await transaction.sendAndConfirm(umi);
const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
console.log("Created nft. Address is ", getExplorerLink("address", createdNft.mint.publicKey, "devnet"));
//Created nft. Address is  https://explorer.solana.com/address/GYRPVqcysX488vxQtUfG8gh1ptwc79viQ6hYUTywzuax?cluster=devnet