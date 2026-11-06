import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { TransactionalOutboxEvent } from '../types';

export const useOrderOutboxProcessor = () => {
  const { outbox, processOutboxEvent, updateOrderStatus, lang } = useStore();

  useEffect(() => {
    const pendingEvents = outbox.filter(evt => evt.status === 'pending');
    
    if (pendingEvents.length === 0) return;

    // Process events one by one with a delay to simulate background worker
    const processNext = async () => {
      const event = pendingEvents[0];
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log(`[OutboxProcessor] Processing event: ${event.eventType} for ${event.aggregateId}`);

      // Handle specific event types
      switch (event.eventType) {
        case 'FULFILLMENT_REQUESTED':
          // Simulate CJ Dropshipping / Supplier API call
          updateOrderStatus(event.aggregateId, 'dispatched_supplier');
          break;
        case 'STOCK_RESERVED':
          // Stock already reserved in AtomicReserve, just acknowledge
          break;
        case 'PAYMENT_COMPLETED':
          updateOrderStatus(event.aggregateId, 'processing');
          break;
      }

      processOutboxEvent(event.id);
      
      // Show "WhatsApp" style notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Zoos Electronics', {
          body: lang === 'ar' 
            ? `تحديث الطلب ${event.aggregateId}: تم البدء في المعالجة` 
            : `Order ${event.aggregateId} Update: Processing started`,
        });
      }
    };

    processNext();
  }, [outbox, processOutboxEvent, updateOrderStatus, lang]);
};
