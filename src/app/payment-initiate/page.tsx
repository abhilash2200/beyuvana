import { PaymentVerificationSuspense } from "@/components/payment/PaymentVerificationSuspense";

export default function PaymentInitiatePage() {
  return (
    <PaymentVerificationSuspense noPaymentInfoMessage="No payment information found. Please start checkout from your cart." />
  );
}
