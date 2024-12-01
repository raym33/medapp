import { db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { encryptData, decryptData } from './encryptionService';

export interface License {
  id?: string;
  userId: string;
  key: string;
  startDate: Date;
  expirationDate: Date;
  isActive: boolean;
  type: 'basic' | 'professional' | 'enterprise';
  features: string[];
}

class LicenseService {
  private readonly COLLECTION = 'licenses';

  async generateLicense(userId: string, type: License['type'], durationMonths: number): Promise<License> {
    const startDate = new Date();
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + durationMonths);

    const features = this.getLicenseFeatures(type);
    const key = await this.generateLicenseKey(userId, expirationDate);

    const license: Omit<License, 'id'> = {
      userId,
      key,
      startDate,
      expirationDate,
      isActive: true,
      type,
      features
    };

    const docRef = await addDoc(collection(db, this.COLLECTION), license);
    return { ...license, id: docRef.id };
  }

  async verifyLicense(userId: string): Promise<{ isValid: boolean; daysLeft?: number; type?: string }> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        where('isActive', '==', true)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return { isValid: false };
      }

      const license = snapshot.docs[0].data() as License;
      const now = new Date();
      const expiration = license.expirationDate.toDate();
      const isValid = now < expiration;
      
      if (!isValid) {
        await this.deactivateLicense(snapshot.docs[0].id);
        return { isValid: false };
      }

      const daysLeft = Math.ceil((expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { isValid: true, daysLeft, type: license.type };
    } catch (error) {
      console.error('License verification error:', error);
      return { isValid: false };
    }
  }

  private async deactivateLicense(licenseId: string): Promise<void> {
    const licenseRef = doc(db, this.COLLECTION, licenseId);
    await updateDoc(licenseRef, { isActive: false });
  }

  private async generateLicenseKey(userId: string, expirationDate: Date): Promise<string> {
    const data = new TextEncoder().encode(
      JSON.stringify({ userId, expirationDate: expirationDate.toISOString() })
    );
    const encrypted = await encryptData(data);
    return Buffer.from(encrypted).toString('base64');
  }

  private getLicenseFeatures(type: License['type']): string[] {
    const features = {
      basic: ['audio_recording', 'basic_reports'],
      professional: ['audio_recording', 'advanced_reports', 'email_notifications', 'priority_support'],
      enterprise: ['audio_recording', 'advanced_reports', 'email_notifications', 'priority_support', 'custom_branding', 'api_access']
    };
    return features[type] || [];
  }
}

export const licenseService = new LicenseService();