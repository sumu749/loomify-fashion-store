import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const createGuestOrderToken = () => randomBytes(32).toString("hex");

export const hashGuestOrderToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");

export const matchesGuestOrderToken = (
    token: string,
    tokenHash: string | null,
) => {
    if (!tokenHash) {
        return false;
    }

    const actualHash = Buffer.from(hashGuestOrderToken(token), "hex");
    const expectedHash = Buffer.from(tokenHash, "hex");

    return (
        actualHash.length === expectedHash.length &&
        timingSafeEqual(actualHash, expectedHash)
    );
};
