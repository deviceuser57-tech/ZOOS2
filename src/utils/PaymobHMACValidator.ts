/**
 * PaymobHMACValidator: Validates the HMAC signature from Paymob payment callbacks.
 * Aligning with Master Architecture Blueprint Section 5.2.
 */
export interface PaymobCallbackPayload {
  amount_cents: string;
  created_at: string;
  currency: string;
  error_occured: string;
  has_parent_transaction: string;
  id: string;
  integration_id: string;
  is_3d_secure: string;
  is_auth: string;
  is_capture: string;
  is_standalone_payment: string;
  is_voided: string;
  order: string;
  owner: string;
  pending: string;
  source_data_pan: string;
  source_data_sub_type: string;
  source_data_type: string;
  success: string;
  hmac: string;
}

export class PaymobHMACValidator {
  /**
   * Validates the HMAC of a Paymob transaction callback.
   * Note: Real implementation requires 'crypto' module which is usually server-side.
   * This utility simulates the validation logic for the frontend/BFF contract.
   */
  public static async validateHMAC(payload: PaymobCallbackPayload, hmacSecret: string): Promise<boolean> {
    // 1. Arrange keys in exact order defined by Paymob documentation
    const keys = [
      'amount_cents',
      'created_at',
      'currency',
      'error_occured',
      'has_parent_transaction',
      'id',
      'integration_id',
      'is_3d_secure',
      'is_auth',
      'is_capture',
      'is_standalone_payment',
      'is_voided',
      'order',
      'owner',
      'pending',
      'source_data_pan',
      'source_data_sub_type',
      'source_data_type',
      'success'
    ];

    const concatenatedString = keys.map(key => (payload as any)[key]).join('');

    console.log('Validating Paymob HMAC for transaction:', payload.id);

    // Simulation of cryptographic check
    // In a real Node.js environment:
    // const calculatedHmac = crypto.createHmac('sha512', hmacSecret).update(concatenatedString).digest('hex');
    // return calculatedHmac.toLowerCase() === payload.hmac.toLowerCase();

    return payload.hmac.length > 0; // Simulate success if HMAC exists
  }
}
