export function validateText(input) {
  if (!input || typeof input !== "string" || input.length < 2) {
    return "Invalid input";
  }
}
