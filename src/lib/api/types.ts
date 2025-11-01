/**
 * API Type Definitions
 * Centralized type definitions for API interfaces
 */

import { ApiResponse } from "./core";

// Base API Response
export type { ApiResponse };

// Price Tier
export interface PriceTier {
  product_price_id: string;
  qty: number;
  unit_id: string;
  unit_name: string;
  mrp: string;
  discount: string;
  discount_off_inpercent: string;
  discount_amount: number;
  sale_price: string;
  final_price: string;
}

// Product Types
export interface Product {
  id: string;
  category: string;
  categorykey: string;
  brand: string;
  brandkey: string;
  product_code: string;
  product_name: string;
  product_price?: string;
  discount_price?: string;
  discount_off_inpercent?: string;
  prices?: PriceTier[];
  sku_number: string;
  short_description: string;
  product_description: string;
  in_stock: string;
  image?: string;
  image_single?: string;
  image_all?: string[];
  design_type?: "green" | "pink" | "GREEN" | "PINK";
}

export interface ProductDetailsResponse {
  total_star_ratting: string;
  id: string;
  design_type?: string;
  categorykey: string;
  category: string;
  product_code: string;
  product_name: string;
  product_price: string;
  discount_price: string;
  discount_off_inpercent: string;
  sku_number: string;
  short_description: string;
  product_description: string;
  in_stock: string;
  image: string[];
  prices?: PriceTier[];
  my_review: ProductReview[];
  review: ProductReview[];
}

export interface LegacyProduct {
  id: number;
  name: string;
  tagline?: string;
  description: string[];
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  bgColor: string;
  design_type?: "green" | "pink";
  category?: string;
  categorykey?: string;
  brand?: string;
  brandkey?: string;
  product_code?: string;
  sku_number?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  image_single?: string;
  image_all?: string[];
  prices?: PriceTier[];
}

export interface ProductsListRequest {
  filter?: {
    brandkey?: string[];
    categorykey?: string[];
    product_name?: string[];
    product_price?: [number, number];
    [key: string]: unknown;
  };
  sort?: Record<string, "ASC" | "DESC">;
  searchTerms?: string;
  page?: number;
  limit?: number;
}

// Auth Types
export interface SendOtpRequest {
  phonenumber: string;
}

export interface VerifyOtpRequest {
  phonenumber: string;
  otp: string;
}

export interface RegisterRequest {
  fullname: string;
  email: string;
  phonenumber: string;
  otp_code: string;
}

export interface LoginRequest {
  phonenumber: string;
  otp_code: string;
}

// Cart Types
export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  price_qty?: number;
  price_unit_name?: string;
  product_price?: number;
  discount_price?: number;
  product_price_id?: string;
  discount_percent?: string;
}

export interface CartItem {
  id?: string;
  product_id: string;
  name?: string;
  product_name?: string;
  price?: number;
  sale_price?: number;
  final_price?: string | number;
  quantity?: number;
  qty?: number;
  image?: string;
  product_image?: string;
  mrp_price?: number;
  discount_percent?: string;
  discount_off_inpercent?: string;
  short_description?: string;
  product_description?: string;
  in_stock?: string;
  pack_qty?: number;
  product_price_id?: string;
  unit_qty?: string | number;
  unit_name?: string;
  cart_id?: string;
  product_price?: string;
  discount_price?: string;
  price_unit_name?: string;
  posted_on?: string;
  product_code?: string;
  sku_number?: string;
  gst_rate?: string;
}

// Order Types
export interface Order {
  id: string;
  productName: string;
  description: string;
  price: number;
  status: "arriving" | "cancelled" | "delivered";
  date?: string;
  image: string;
  thumbnail?: string;
  product_id?: string;
}

export interface BackendOrderItem {
  id?: string | number;
  user_id?: string | number;
  status?: string;
  pay_status?: string;
  created_date?: string;
  order_no?: string;
  paid_amount?: string | number;
  gross_amount?: string | number;
  qty?: string | number;
  product_name?: string;
  product_id?: string | number;
  updated_at?: string;
  thumbnail?: string;
}

export interface OrderDetailsItem {
  product_code: string;
  product_name: string;
  sku_number: string;
  image: string;
  id: string;
  user_id: string;
  product_id: string;
  sale_price: string;
  sale_unit: string;
  qty: string;
  mrp_price: string;
  total_mrp_price: string;
  total_sale_price: string;
  discount_amount: string;
  created_at: string;
  created_date: string;
  updated_at: string;
  order_id: string;
  rate_star: string;
  review: string | null;
  review_date: string | null;
  gst_amount: string;
}

export interface OrderDetailsAddress {
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  fullname: string;
  email: string;
  mobile: string;
}

export interface OrderDetailsPayment {
  id: string;
  order_no: string;
  pay_gateway_name: string;
  payment_request_id: string;
  txn_id: string;
  txn_date: string;
  pay_status: string;
  paid_amount: string;
  created_at: string;
  updated_at: string;
  other_info: string;
  user_id: string;
}

export interface OrderDetailsData {
  order_details: {
    id: string;
    user_id: string;
    txn_id: string;
    status: string;
    pay_status: string;
    created_date: string;
    order_no: string;
    paid_amount: string;
    discount_amount: string;
    gross_amount: string;
    promo_amount: string;
    promo_code: string;
    qty: string;
    pay_mode: string;
    pay_gateway_name: string;
    session_key: string;
    awb_no: string | null;
    courier_name: string | null;
    created_at: string;
    updated_at: string;
    total_discount: string;
    gst_amount: string;
    gst_no: string | null;
    address_id: string;
    completed_date: string | null;
    remarks: string | null;
    thumbnail: string;
    shipment_shipment_id: string;
    shipment_order_id: string;
    payment_app_type: string;
    payment_redirect_url: string;
  };
  item_list: OrderDetailsItem[];
  address: OrderDetailsAddress;
  payment_details: OrderDetailsPayment;
}

// Address Types
export interface SaveAddressRequest {
  user_id: number;
  fullname: string;
  address1: string;
  address2: string;
  mobile: string;
  email: string;
  city: string;
  pincode: string;
  is_primary: number;
}

export interface SavedAddress {
  id: number;
  user_id: number;
  fullname: string;
  address1: string;
  address2: string;
  mobile: string;
  email: string;
  city: string;
  pincode: string;
  is_primary: number;
  created_at?: string;
  updated_at?: string;
}

// Review Types
export interface ProductReview {
  id: string;
  product_id: string;
  customer_logo: string;
  customer_name: string;
  review: string;
  created_id: string;
  created_on: string;
  status: string;
  review_added_by: string;
  user_id: string;
  star_ratting: string;
}

export interface ProductReviewRequest {
  product_id: number;
  user_id: number;
  review: string;
  star_ratting: number;
}

export interface ProductReviewItem {
  id: number;
  user_name: string;
  review: string;
  star_ratting: number;
  created_at?: string;
}

export type ReviewsListResponse = {
  reviews: ProductReviewItem[];
};

// Checkout Types
export interface CheckoutCartItem {
  product_id: number;
  sale_price: number;
  mrp_price: number;
  sale_unit: number;
  qty: number;
  total_mrp_price: number;
  total_sale_price: number;
  discount_amount: number;
}

export interface PaymentInfo {
  pay_gateway_name: string;
  pay_status: string;
  txn_id: string;
}

export interface CheckoutRequest {
  cart: CheckoutCartItem[];
  user_id: number;
  qty: number;
  paid_amount: number;
  discount_amount: number;
  gross_amount: number;
  promo_amount: number;
  total_discount: number;
  promo_code: string;
  pay_mode: string;
  address_id: number;
  gst_amount: string;
  payment_info: PaymentInfo;
}

