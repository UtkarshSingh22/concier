# Payment Setup

Quick setup guide for enabling payments. Choose one payment provider (Stripe or Razorpay).

## Prerequisites

- Complete the [Quick Setup](../START_HERE.md#quick-setup) steps
- Have a payment provider account (Stripe or Razorpay)
- Know which plan you want to enable (default: "pro")

## Choose Your Provider

### Option 1: Stripe

1. **Create a Product in Stripe Dashboard**
   - Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
   - Click "Create product"
   - Set name to "Pro Plan"
   - Set price to $29/month (or your preferred pricing)
   - Copy the **Price ID** (starts with `price_`)

2. **Update Database**
   ```bash
   node scripts/update-stripe-price.js pro <PRICE_ID>
   ```

3. **Configure Environment**
   - Set `PAYMENT_PROVIDER=stripe` in your `.env` file
   - Ensure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are set

4. **Setup Webhooks** (Required)
   - Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - Set endpoint URL to: `https://yourdomain.com/api/payments/webhook/stripe`
     - **For local development:** Use ngrok URL instead (see Local Webhook Testing section below)
   - Select events:
     - `checkout.session.completed`
     - `invoice.paid`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the **Webhook signing secret** to `STRIPE_WEBHOOK_SECRET` in your `.env`

### Option 2: Razorpay

1. **Create a Plan in Razorpay Dashboard**
   - Go to [Razorpay Dashboard → Plans](https://dashboard.razorpay.com/app/plans)
   - Click "Create Plan"
   - Set name to "Pro Plan"
   - Set price to ₹2900/month (or your preferred pricing)
   - Copy the **Plan ID** (starts with `plan_`)

2. **Update Database**
   ```bash
   node scripts/update-razorpay-plan.js pro <PLAN_ID>
   ```

3. **Configure Environment**
   - Set `PAYMENT_PROVIDER=razorpay` in your `.env` file
   - Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set

4. **Setup Webhooks** (Required)

   #### Generate Webhook Secret
   **Important:** Unlike Stripe, you must create your own webhook secret for Razorpay.

   Generate a secure random secret:
   ```bash
   # Option 1: Use openssl (macOS/Linux)
   openssl rand -hex 32

   # Option 2: Use Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Option 3: Use Python
   python3 -c "import secrets; print(secrets.token_hex(32))"
   ```

   #### Create Webhook in Razorpay Dashboard
   1. Go to [Razorpay Dashboard → Settings → Webhooks](https://dashboard.razorpay.com/app/keys)
   2. Click **"Add New Webhook"**
   3. Set **Webhook URL** to: `https://yourdomain.com/api/payments/webhook/razorpay`
      - **For local development:** Use ngrok URL instead (see Local Webhook Testing section below)
   4. Set **Secret** to the random secret you generated above
   5. Select **Active Events**:
      - `subscription.activated`
      - `subscription.charged`
      - `subscription.cancelled`
      - `subscription.paused`
      - `subscription.resumed`
      - `payment.failed`
   6. Click **"Create Webhook"**

   #### Update Environment Variables
   Add the webhook secret to your `.env` file:
   ```bash
   RAZORPAY_WEBHOOK_SECRET=your_random_generated_secret_here
   ```

## Local Webhook Testing (Optional)

To test webhooks locally during development, use ngrok to expose your localhost to the internet.

### 1. Install ngrok

**macOS (using Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows/Linux:**
```bash
# Download from: https://ngrok.com/download
# Or using npm (if you have Node.js installed):
npm install -g ngrok
```

### 2. Authenticate ngrok

Get your auth token from [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken):

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 3. Start Your Development Server

Make sure your Next.js app is running:
```bash
pnpm dev
```

Your app should be running on `http://localhost:3000`.

### 4. Start ngrok

Expose your localhost to the internet:
```bash
# Forward port 3000 (where your Next.js app runs)
ngrok http 3000
```

You'll see output like:
```
ngrok
Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://abc123.ngrok.io -> http://localhost:3000
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000
```

**Important:** Copy the `https://abc123.ngrok.io` URL.

### 5. Update Webhook URLs

Update your webhook URLs in the payment provider dashboards to use the ngrok URL:

**Stripe:**
- Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
- Update the endpoint URL to: `https://your-ngrok-url.ngrok.io/api/payments/webhook/stripe`

**Razorpay:**
- Go to [Razorpay Dashboard → Settings → Webhooks](https://dashboard.razorpay.com/app/keys)
- Update the webhook URL to: `https://your-ngrok-url.ngrok.io/api/payments/webhook/razorpay`

### 6. Test Webhook Delivery

1. Visit your app at the ngrok URL
2. Try to purchase a subscription
3. Complete the payment using test credentials
4. Check ngrok logs at `http://127.0.0.1:4040` - you should see webhook requests
5. Verify subscription was created in your database

### Troubleshooting

**Webhook Events Not Received:**
- Check ngrok is still running: `http://127.0.0.1:4040`
- Verify webhook URL in provider dashboard uses correct ngrok URL
- Check ngrok logs for any errors

**ngrok Not Working:**
- Try a different region: `ngrok http 3000 --region=us`
- Check your internet connection
- Verify ngrok auth token is correct

**Security Note:** ⚠️ Never commit ngrok URLs or webhook secrets to version control. Always use environment variables.

## Test Payment Flow

1. Restart your development server
2. Visit your app and try to upgrade to the Pro plan
3. Complete a test payment using test credentials:
   - **Stripe**: Card `4242 4242 4242 4242`
   - **Razorpay**: Card `5500 6700 0000 1002`

## Next Steps

- View detailed payment documentation: [payments.md](payments.md)
- Configure additional plans if needed
- Test webhook events for subscription lifecycle management
