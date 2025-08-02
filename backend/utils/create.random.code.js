import { customAlphabet } from "nanoid";

export default function createRandomCode() {
  const generatedCode = customAlphabet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    6
  );
  return generatedCode();
}

