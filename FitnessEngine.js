require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 3000;

// Allow your frontend to communicate with this server
app.use(cors());


// ============================================================
// STRIPE WEBHOOK
// ============================================================
// IMPORTANT:
// The webhook must receive the raw request body.
// Therefore this route MUST come before express.json().
// ============================================================

app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    (req, res) => {

        const signature =
            req.headers["stripe-signature"];

        let event;

        try {

            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

        } catch (error) {

            console.error(
                "Webhook verification failed:",
                error.message
            );

            return res.status(400).send(
                `Webhook Error: ${error.message}`
            );
        }


        // ====================================================
        // PAYMENT SUCCESSFUL
        // ====================================================

        if (event.type === "checkout.session.completed") {

            const session = event.data.object;

            console.log(
                "Payment successful!"
            );

            console.log(
                "Customer:",
                session.customer_details?.email
            );

            console.log(
                "Session:",
                session.id
            );

            /*
                IMPORTANT:

                In a real application, this is where you would
                save the purchase in your database.

                Example:

                user.premium = true;

                For now, we're simply confirming the payment.
            */
        }


        // ====================================================
        // PAYMENT REFUNDED
        // ====================================================

        if (event.type === "charge.refunded") {

            const charge = event.data.object;

            console.log(
                "Payment refunded:",
                charge.id
            );

            /*
                In a real application you could remove
                premium access here.
            */
        }


        res.json({
            received: true
        });
    }
);


// Normal JSON requests
app.use(express.json());


// ============================================================
// CREATE STRIPE CHECKOUT SESSION
// ============================================================

app.post(
    "/create-checkout-session",
    async (req, res) => {

        try {

            const session =
                await stripe.checkout.sessions.create({

                    // ONE-TIME PAYMENT
                    mode: "payment",

                    // Your $5 Stripe Price
                    line_items: [
                        {
                            price:
                                process.env.STRIPE_PRICE_ID,

                            quantity: 1
                        }
                    ],

                    // Where the customer goes after paying
                    success_url:
                        "http://localhost:3000/success.html",

                    // Where the customer goes if they cancel
                    cancel_url:
                        "http://localhost:3000/cancel.html",

                    // Allow Stripe to dynamically determine
                    // eligible payment methods.
                    integration_identifier:
                        "fitness_purchase_aBcDeFgH"
                });


            // Send Checkout URL to frontend
            res.json({
                url: session.url
            });

        } catch (error) {

            console.error(
                "Checkout error:",
                error
            );

            res.status(500).json({
                error:
                    "Unable to create checkout session."
            });
        }
    }
);


// ============================================================
// START SERVER
// ============================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Fitness Analytics server running at http://localhost:${PORT}`
        );

    }
);
