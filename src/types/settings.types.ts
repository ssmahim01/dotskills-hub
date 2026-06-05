export type PaymentMethod = 'bkash' | 'nagad' | 'bank-transfer';

export interface PaymentConfig {
  method: PaymentMethod;
  accountNumber?: string;
  accountHolder?: string;
  bankName?: string;
  swiftCode?: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface PlatformSettings {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyCountry: string;
  contactEmail: string;
  contactPhone: string;
  paymentMethods: PaymentConfig[];
  termsUrl?: string;
  privacyUrl?: string;
  updatedAt: string;
}

export interface UpdateSettingsPayload {
  companyName?: string;
  companyLogo?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCountry?: string;
  contactEmail?: string;
  contactPhone?: string;
  paymentMethods?: PaymentConfig[];
}
