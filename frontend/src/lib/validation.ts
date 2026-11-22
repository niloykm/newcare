export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d()\s.-]{7,20}$/;

export function validateEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return "Email address is required.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validateOptionalEmail(email: string): string | undefined {
  const trimmed = email.trim();
  if (!trimmed) return undefined;
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function validatePhone(phone: string): string | undefined {
  const trimmed = phone.trim();
  if (!trimmed) return "Contact phone number is required.";
  if (!PHONE_REGEX.test(trimmed)) return "Enter a valid phone number (at least 7 digits).";
  return undefined;
}

export function validateRequiredText(
  value: string,
  label: string,
  minLength = 2
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return `${label} is required.`;
  if (trimmed.length < minLength) return `${label} must be at least ${minLength} characters.`;
  return undefined;
}
