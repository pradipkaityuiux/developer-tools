import bcrypt from "bcryptjs";

/** bcrypt cost factor (work factor) — typical production range 10–12. */
export const BCRYPT_COST_MIN = 4;
export const BCRYPT_COST_MAX = 15;

export function hashBcrypt(plain: string, rounds: number): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, rounds, (err, hash) => {
      if (err) reject(err);
      else if (hash !== undefined) resolve(hash);
      else reject(new Error("bcrypt.hash returned no hash"));
    });
  });
}

export function compareBcrypt(plain: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hash, (err, same) => {
      if (err) reject(err);
      else resolve(same ?? false);
    });
  });
}

/** True if string looks like a bcrypt modular crypt hash. */
export function looksLikeBcryptHash(s: string): boolean {
  const t = s.trim();
  return /^\$2[aby]\$\d{2}\$/.test(t);
}
