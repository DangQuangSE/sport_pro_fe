const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

export function isValidPhoneNumber(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}
