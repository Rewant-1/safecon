import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

export interface ProtectOptions {
  userPassword: string;
  ownerPassword?: string;
}

export async function protectPdf(
  file: File,
  options: ProtectOptions
): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  
  // Encrypt the PDF bytes directly
  const encryptedBytes = await encryptPDF(
    bytes,
    options.userPassword,
    options.ownerPassword || options.userPassword
  );

  return new Blob([encryptedBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}
