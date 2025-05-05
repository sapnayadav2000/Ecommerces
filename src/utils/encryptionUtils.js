import CryptoJS from "crypto-js";

const SECRET_KEY = "mysecretkey123"; // Ensure this is the same as used for encryption

export const decodeId = (encryptedId) => {
  try {
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedId), SECRET_KEY);
    const originalId = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalId) throw new Error("Decryption failed");

    return originalId;
  } catch (error) {
    console.error("Decryption error:", error);
    return null; // Return null if decryption fails
  }
};