import { QRCodeCanvas } from "qrcode.react";

const UpiPaymentModal = ({ open, onClose, courseTitle, amount, onConfirmPayment, confirming }) => {
  if (!open) return null;

  const upiId = import.meta.env.VITE_UPI_ID || "";
  const payeeName = import.meta.env.VITE_PAYEE_NAME || "Edemy LMS";
  const formattedAmount = Number(amount || 0).toFixed(2);
  const note = `Payment for ${courseTitle}`;
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Pay Now</h2>
            <p className="mt-1 text-sm text-gray-500">{courseTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-700"
            aria-label="Close payment modal"
          >
            &times;
          </button>
        </div>

        <div className="mt-5 rounded-md border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500">Amount</p>
          <p className="text-3xl font-semibold text-gray-900">INR {formattedAmount}</p>
        </div>

        {upiId ? (
          <>
            <div className="mt-5 flex justify-center rounded-md border border-gray-200 p-4">
              <QRCodeCanvas value={upiUrl} size={220} includeMargin />
            </div>
            <a
              href={upiUrl}
              className="mt-5 block w-full rounded bg-blue-600 py-3 text-center font-medium text-white"
            >
              Open UPI App
            </a>
            <button
              type="button"
              onClick={onConfirmPayment}
              disabled={confirming}
              className="mt-3 w-full rounded bg-green-600 py-3 text-center font-medium text-white disabled:cursor-not-allowed disabled:bg-green-300"
            >
              {confirming ? "Confirming..." : "I have paid"}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Scan this QR with any UPI app, then tap I have paid.
            </p>
          </>
        ) : (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Add your UPI ID in <span className="font-semibold">client/.env</span> as{" "}
            <span className="font-semibold">VITE_UPI_ID=yourupi@bank</span>, then restart the frontend.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpiPaymentModal;
