export function getFriendlyErrorMessage(errMessage: string, t: (key: string) => string): string {
  if (!errMessage) {
    return t("admin.productForm.errors.unknown");
  }

  const msgLower = errMessage.toLowerCase();

  // 1. SKU already exists
  if (msgLower.includes("sku already exists")) {
    const match = errMessage.match(/sku already exists:\s*(.+)/i);
    if (match && match[1]) {
      const sku = match[1].trim();
      const template = t("admin.productForm.errors.skuExistsWithSku");
      return template.replace("{sku}", sku);
    }
    return t("admin.productForm.errors.skuExists");
  }

  // 2. Duplicate SKU in request
  if (msgLower.includes("duplicate sku in request")) {
    const match = errMessage.match(/duplicate sku in request:\s*(.+)/i);
    if (match && match[1]) {
      const sku = match[1].trim();
      const template = t("admin.productForm.errors.duplicateSkuInRequestWithSku");
      return template.replace("{sku}", sku);
    }
    return t("admin.productForm.errors.duplicateSkuInRequest");
  }

  // Common operations failures
  if (msgLower.includes("failed to save") || msgLower.includes("failed to create") || msgLower.includes("failed to update")) {
    return t("admin.productForm.errors.failedToSave");
  }

  if (msgLower.includes("session expired") || msgLower.includes("please login again")) {
    return t("admin.productForm.errors.sessionExpired");
  }

  if (msgLower.includes("network error") || msgLower.includes("failed to fetch")) {
    return t("admin.productForm.errors.networkError");
  }

  if (msgLower.includes("sql") || msgLower.includes("constraint") || msgLower.includes("database") || msgLower.includes("hibernate")) {
    return t("admin.productForm.errors.databaseError");
  }

  if (msgLower.includes("http error")) {
    return t("admin.productForm.errors.serverError");
  }

  return errMessage;
}
