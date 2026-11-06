import { useEffect } from 'react';
import { useStore } from '../context/StoreContext';

/**
 * useWhatsAppNotifications: Simulates the WhatsApp API automation for order updates.
 * Aligning with Master Architecture Blueprint Section 3.2.
 */
export const useWhatsAppNotifications = () => {
  const { orders, lang } = useStore();

  useEffect(() => {
    // We only care about the most recently updated order status for notification simulation
    if (orders.length === 0) return;

    const latestOrder = orders[0];
    
    // In a real implementation, this would be a webhook or a backend trigger.
    // Here we simulate the client-side "Alert" when a status changes to specific milestones.
    
    if (latestOrder.status === 'dispatched_supplier' || latestOrder.status === 'ready_for_pickup') {
      const message = lang === 'ar'
        ? `🔔 تحديث واتساب: طلبك رقم ${latestOrder.orderNumber} أصبح الآن: ${latestOrder.status === 'ready_for_pickup' ? 'جاهز للاستلام من X-Mall' : 'قيد الشحن الدولي'}`
        : `🔔 WhatsApp Alert: Your order ${latestOrder.orderNumber} is now: ${latestOrder.status === 'ready_for_pickup' ? 'Ready for Pickup at X-Mall' : 'In Transit'}`;

      console.log(`[WhatsApp Automation] Sending message to ${latestOrder.customerPhone}: ${message}`);
      
      // Simulate the notification pop-up
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Zoos WhatsApp Bot', {
          body: message,
          icon: 'https://cdn-icons-png.flaticon.com/512/733/733585.png', // WhatsApp icon
        });
      }
    }
  }, [orders[0]?.status]); // Only trigger when the status of the newest order changes
};
