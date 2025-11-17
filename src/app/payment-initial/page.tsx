import { PaymentVerificationSuspense } from "@/components/payment/PaymentVerificationSuspense";

export default function PaymentInitialPage() {
    return (
        <PaymentVerificationSuspense 
            noPaymentInfoMessage="No payment information found. Please check your orders or contact support."
        />
    );
}

