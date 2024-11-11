import CommunicationController from '../model/CommunicationController';

export default class ViewModel {

    static async loadOrderData(orderId) {
        try {
            const orderData = await CommunicationController.getOrderDetailsById(orderId);

            if (orderData.status === "ON_DELIVERY") {
                const deliveryDate = await CommunicationController.getOrderDeliveryDateById(orderId);
                const dateObject = new Date(deliveryDate.date);
                const dateString = dateObject.toLocaleDateString("IT-it");
                orderData.status = "Delivery expected on " + dateString;
            }

            return orderData;        
        } catch (err) {
            throw err;
        }
    }

}