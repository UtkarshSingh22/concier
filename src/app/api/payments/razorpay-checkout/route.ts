// 🔒 CORE SYSTEM — DO NOT MODIFY
// Razorpay checkout page generator.
// Renders an HTML page with Razorpay checkout widget.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subscriptionId = searchParams.get("subscription_id");
  const keyId = searchParams.get("key_id");
  const successUrl = searchParams.get("success_url");
  const cancelUrl = searchParams.get("cancel_url");
  const userId = searchParams.get("user_id");
  const email = searchParams.get("email");

  if (!subscriptionId || !keyId || !successUrl || !cancelUrl) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  // Get user details for prefilling
  let userName = "";
  if (userId) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });
    userName = user?.name || "";
  }

  // Render checkout page with Razorpay script
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Payment</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      text-align: center;
      max-width: 400px;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      color: #1a1a1a;
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .cancel-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.875rem;
    }
    .cancel-link:hover {
      text-decoration: underline;
    }
    .error {
      color: #dc2626;
      background: #fef2f2;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Initializing Payment</h1>
    <p>Please wait while we prepare your secure checkout...</p>
    <div class="error" id="error"></div>
    <a href="${cancelUrl}" class="cancel-link">Cancel and return</a>
  </div>

  <script>
    const options = {
      key: "${keyId}",
      subscription_id: "${subscriptionId}",
      name: "${process.env.NEXT_PUBLIC_APP_NAME || "SaaS App"}",
      description: "Subscription Payment",
      prefill: {
        name: "${userName}",
        email: "${email || ""}"
      },
      theme: {
        color: "#667eea"
      },
      handler: function(response) {
        // Payment successful - redirect to success URL
        const url = new URL("${successUrl}");
        url.searchParams.set("razorpay_payment_id", response.razorpay_payment_id);
        url.searchParams.set("razorpay_subscription_id", response.razorpay_subscription_id);
        url.searchParams.set("razorpay_signature", response.razorpay_signature);
        window.location.href = url.toString();
      },
      modal: {
        ondismiss: function() {
          // User closed the checkout - redirect to cancel URL
          window.location.href = "${cancelUrl}";
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on("payment.failed", function(response) {
        const errorEl = document.getElementById("error");
        errorEl.textContent = response.error.description || "Payment failed. Please try again.";
        errorEl.style.display = "block";
        document.querySelector(".spinner").style.display = "none";
        document.querySelector("h1").textContent = "Payment Failed";
        document.querySelector("p").textContent = "There was an issue processing your payment.";
      });
      
      // Open checkout immediately
      setTimeout(() => rzp.open(), 500);
    } catch (err) {
      const errorEl = document.getElementById("error");
      errorEl.textContent = "Failed to initialize payment. Please try again.";
      errorEl.style.display = "block";
      document.querySelector(".spinner").style.display = "none";
    }
  </script>
</body>
</html>
  `.trim();

  logger.info("Razorpay checkout page rendered", {
    context: "razorpay-checkout",
    metadata: { subscriptionId, userId },
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
