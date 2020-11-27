import WooCommerceRestApi from "./WoocommerceApi"
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"
import { config } from "../../config"

const wooapiConfig = {
  url: config.baseUrl,
  isSsl: false,
  consumerKey: config.ck ?? "consumerKey",
  consumerSecret: config.cs ?? "consumerSecret",
  version: "wc/v3",
  axiosConfig: { headers: {} },
  queryStringAuth: true
}

export const wooapi = new WooCommerceRestApi(wooapiConfig)
