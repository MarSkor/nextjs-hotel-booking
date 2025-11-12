import Stripe from "stripe";
import config from "./config";

export const stripe = new Stripe(config.env.stripe.secretKey, {
  apiVersion: "2025-09-30.clover",
});
