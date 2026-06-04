import { PlatformSettings, UpdateSettingsPayload } from '../types/settings.types';
import { getStorage, setStorage } from './localStorage';
import { STORAGE_KEYS } from '../utils/constants';
import { seedSettings } from './seed-data';

class SettingsService {
  private readonly storageKey = STORAGE_KEYS.SETTINGS;

  /**
   * Initialize settings service with seed data if needed
   */
  initialize(): void {
    if (!getStorage(this.storageKey)) {
      setStorage(this.storageKey, seedSettings);
    }
  }

  /**
   * Get all settings
   */
  getSettings(): PlatformSettings {
    return getStorage<PlatformSettings>(this.storageKey, seedSettings) || seedSettings;
  }

  /**
   * Update settings
   */
  updateSettings(payload: UpdateSettingsPayload): { success: boolean; settings?: PlatformSettings; error?: string } {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings: PlatformSettings = {
        ...currentSettings,
        ...payload,
        updatedAt: new Date().toISOString(),
      };

      setStorage(this.storageKey, updatedSettings);
      return { success: true, settings: updatedSettings };
    } catch (error) {
      return { success: false, error: 'Failed to update settings' };
    }
  }

  /**
   * Get company info
   */
  getCompanyInfo(): {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  } {
    const settings = this.getSettings();
    return {
      name: settings.companyName,
      email: settings.companyEmail,
      phone: settings.companyPhone,
      address: settings.companyAddress,
      city: settings.companyCity,
      country: settings.companyCountry,
    };
  }

  /**
   * Update company info
   */
  updateCompanyInfo(data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }): { success: boolean; settings?: PlatformSettings } {
    return this.updateSettings({
      companyName: data.name,
      companyEmail: data.email,
      companyPhone: data.phone,
      companyAddress: data.address,
      companyCity: data.city,
      companyCountry: data.country,
    });
  }

  /**
   * Get contact info
   */
  getContactInfo(): {
    email: string;
    phone: string;
  } {
    const settings = this.getSettings();
    return {
      email: settings.contactEmail,
      phone: settings.contactPhone,
    };
  }

  /**
   * Update contact info
   */
  updateContactInfo(data: { email?: string; phone?: string }): { success: boolean; settings?: PlatformSettings } {
    return this.updateSettings({
      contactEmail: data.email,
      contactPhone: data.phone,
    });
  }

  /**
   * Get payment methods
   */
  getPaymentMethods() {
    const settings = this.getSettings();
    return settings.paymentMethods;
  }

  /**
   * Get enabled payment methods
   */
  getEnabledPaymentMethods() {
    const settings = this.getSettings();
    return settings.paymentMethods.filter((pm) => pm.isEnabled);
  }

  /**
   * Update payment method
   */
  updatePaymentMethod(
    method: string,
    data: { accountNumber?: string; accountHolder?: string; instructions?: string; isEnabled?: boolean }
  ): { success: boolean; settings?: PlatformSettings } {
    const settings = this.getSettings();
    const paymentMethods = settings.paymentMethods.map((pm) =>
      pm.method === method ? { ...pm, ...data } : pm
    );

    return this.updateSettings({ paymentMethods });
  }

  /**
   * Add payment method
   */
  addPaymentMethod(data: {
    method: string;
    accountNumber?: string;
    accountHolder?: string;
    bankName?: string;
    swiftCode?: string;
    instructions?: string;
    isEnabled?: boolean;
  }): { success: boolean; settings?: PlatformSettings } {
    const settings = this.getSettings();
    const newPaymentMethod = {
      method: data.method,
      accountNumber: data.accountNumber,
      accountHolder: data.accountHolder,
      bankName: data.bankName,
      swiftCode: data.swiftCode,
      instructions: data.instructions,
      isEnabled: data.isEnabled ?? true,
    };

    return this.updateSettings({
      paymentMethods: [...settings.paymentMethods, newPaymentMethod] as any,
    });
  }

  /**
   * Toggle payment method
   */
  togglePaymentMethod(method: string): { success: boolean; settings?: PlatformSettings } {
    const settings = this.getSettings();
    const paymentMethods = settings.paymentMethods.map((pm) =>
      pm.method === method ? { ...pm, isEnabled: !pm.isEnabled } : pm
    );

    return this.updateSettings({ paymentMethods });
  }

  /**
   * Reset to default settings
   */
  resetToDefaults(): { success: boolean; settings?: PlatformSettings } {
    setStorage(this.storageKey, seedSettings);
    return { success: true, settings: seedSettings };
  }
}

export const settingsService = new SettingsService();
