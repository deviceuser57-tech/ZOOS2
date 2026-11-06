/**
 * AtomicReserve: Simulates atomic stock reservation and race-condition prevention.
 * Aligning with Master Architecture Blueprint Section 5.1.
 */
export interface ReserveStockInput {
  variantId: string;
  locationId: string;
  requestedQty: number;
  orderId: string;
}

export interface StockBalance {
  variantId: string;
  locationId: string;
  onHand: number;
  reserved: number;
}

export class AtomicReserve {
  /**
   * Simulates the 'SELECT FOR UPDATE' logic used in the Postgres backend
   * to reserve stock atomically without double-selling.
   */
  public static async reserveStockAtomic(
    input: ReserveStockInput,
    currentBalances: StockBalance[]
  ): Promise<{ success: boolean; message: string; updatedBalances?: StockBalance[] }> {
    console.log(`Attempting atomic stock reservation for variant ${input.variantId}...`);

    // 1. Simulate finding the record (Postgres would lock this row here)
    const record = currentBalances.find(
      b => b.variantId === input.variantId && b.locationId === input.locationId
    );

    if (!record) {
      return { success: false, message: 'Stock record not found' };
    }

    // 2. Atomic calculation (performed within DB transaction in real implementation)
    const availableStock = record.onHand - record.reserved;

    if (availableStock < input.requestedQty) {
      return { 
        success: false, 
        message: `Stockout conflict: Only ${availableStock} units available for variant ${input.variantId}` 
      };
    }

    // 3. Simulate the update (COMMIT transaction)
    const updatedBalances = currentBalances.map(b => {
      if (b.variantId === input.variantId && b.locationId === input.locationId) {
        return { ...b, reserved: b.reserved + input.requestedQty };
      }
      return b;
    });

    // 4. Simulate small delay for IO / Locking
    await new Promise(resolve => setTimeout(resolve, 300));

    return { 
      success: true, 
      message: 'Stock successfully reserved atomically',
      updatedBalances
    };
  }
}
