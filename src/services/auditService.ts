import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface AuditLog {
  userId: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

export async function logAuditEvent(
  userId: string,
  action: string,
  details: Record<string, unknown>
) {
  try {
    const auditLog: AuditLog = {
      userId,
      action,
      details,
      timestamp: new Date(),
    };

    await addDoc(collection(db, 'audit_logs'), auditLog);
  } catch (error) {
    console.error('Error logging audit event:', error);
    // Don't throw - audit logging should not break the main flow
  }
}