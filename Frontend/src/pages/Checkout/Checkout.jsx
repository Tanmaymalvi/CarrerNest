import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button, Container } from "../../components/ui";
import { servicesApi, ordersApi } from "../../services/api";
import { getServiceDetail } from "../ServiceDetails/ServiceDetails";

import "./Checkout.css";

const UPI_ID = "9503838360@ybl";
const UPI_NAME = "Rohit Bramhe";

const UPI_APPS = [
  {
    id: "gpay",
    label: "Google Pay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
    scheme: (amount, note) =>
      `tez://upi/pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    id: "phonepe",
    label: "PhonePe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
    scheme: (amount, note) =>
      `phonepe://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    id: "upi",
    label: "Any UPI App",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png",
    scheme: (amount, note) =>
      `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
];

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [apiService, setApiService] = useState(null);
  const [loading, setLoading] = useState(/^[a-f\d]{24}$/i.test(id || ""));

  // Payment state
  const [selectedApp, setSelectedApp] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState("select"); // select | confirm | success
  const [paying, setPaying] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const service = apiService || getServiceDetail(id);

  useEffect(() => {
    const loadService = async () => {
      if (!/^[a-f\d]{24}$/i.test(id || "")) return;
      try {
        const { data } = await servicesApi.list();
        const found = (data.services || []).find((item) => item._id === id);
        if (found) {
          setApiService({
            title: found.name,
            price: `Rs ${Number(found.price || 0).toLocaleString("en-IN")}`,
            rawPrice: found.price,
            description: found.description,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  if (loading) return <section className="section-pad"><Container><div className="glass rounded-3xl p-8 text-center">Loading checkout...</div></Container></section>;
  if (!service) return <Navigate to="/services" replace />;

  const rawPrice = apiService?.rawPrice ?? (
    typeof service.price === "string"
      ? Number(service.price.replace(/[^0-9]/g, ""))
      : service.price
  );

  const note = `CareerNest - ${service.title}`;

  const handlePayNow = async () => {
    if (!user) {
      toast.error("Please login before checkout");
      navigate("/login");
      return;
    }
    if (!selectedApp) {
      toast.error("Please select a payment method");
      return;
    }

    setPaying(true);
    try {
      // Create order in backend (only if MongoDB id)
      if (/^[a-f\d]{24}$/i.test(id || "")) {
        const { data } = await ordersApi.create(id, "upi");
        setOrderId(data.order._id);
      }

      // Open UPI deep link
      const upiLink = selectedApp.scheme(rawPrice, note);
      window.location.href = upiLink;

      // After redirect attempt, move to confirmation step
      setTimeout(() => {
        setStep("confirm");
        setPaying(false);
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not initiate payment");
      setPaying(false);
    }
  };

  const handleVerify = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter your UPI transaction ID");
      return;
    }
    setVerifying(true);
    try {
      if (orderId) {
        await ordersApi.verify(orderId, transactionId.trim());
      }
      setStep("success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment verification failed");
    } finally {
      setVerifying(false);
    }
  };

  // --- STEP: SUCCESS ---
  if (step === "success") {
    return (
      <section className="section-pad">
        <Container className="max-w-3xl">
          <div className="glass rounded-3xl p-6 sm:p-8 text-center">
            <div className="mb-4 flex justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900">
                <svg className="w-8 h-8 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white mb-2">Payment Successful!</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-1">
              Thank you for purchasing <strong>{service.title}</strong>.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Transaction ID: <span className="font-mono font-semibold">{transactionId}</span>
            </p>
            <Button onClick={() => navigate("/services")} className="mt-2">
              Back to Services
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  // --- STEP: CONFIRM (after UPI app opened) ---
  if (step === "confirm") {
    return (
      <section className="section-pad">
        <Container className="max-w-3xl">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Confirm Payment</h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300">
              Complete the payment of <strong>{service.price}</strong> on your UPI app,
              then enter the UPI transaction / reference ID below.
            </p>
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                UPI Transaction / Reference ID
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 123456789012"
                className="w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={handleVerify} className="flex-1" disabled={verifying}>
                {verifying ? "Verifying..." : "Confirm Payment"}
              </Button>
              <button
                onClick={() => setStep("select")}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium hover:bg-slate-100 dark:border-white/20 dark:hover:bg-white/10"
              >
                Go Back
              </button>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // --- STEP: SELECT (default) ---
  return (
    <section className="section-pad">
      <Container className="max-w-3xl">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Checkout</h1>

          {/* Service Summary */}
          <div className="mt-6 rounded-2xl bg-white p-5 dark:bg-white/10">
            <p className="text-sm text-slate-500">CareerNest Service</p>
            <h2 className="mt-1 text-2xl font-bold">{service.title}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">{service.description}</p>
            <p className="mt-5 text-3xl font-bold">{service.price}</p>
          </div>

          {/* UPI Payment Section */}
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Select Payment Method</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {UPI_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    selectedApp?.id === app.id
                      ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30 ring-2 ring-teal-400"
                      : "border-slate-300 bg-white dark:border-white/20 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10"
                  }`}
                >
                  <img
                    src={app.logo}
                    alt={app.label}
                    className="h-8 w-8 rounded object-contain"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{app.label}</span>
                </button>
              ))}
            </div>

            {/* UPI ID Info */}
            <div className="mt-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-3">
              <p className="text-xs text-slate-500 mb-1">Payment will be sent to</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{UPI_NAME}</p>
              <p className="text-sm font-mono text-teal-600 dark:text-teal-400">{UPI_ID}</p>
            </div>
          </div>

          <Button
            onClick={handlePayNow}
            className="mt-6 w-full"
            disabled={paying || !selectedApp}
          >
            {paying ? "Opening Payment App..." : "Pay Now"}
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default Checkout;
