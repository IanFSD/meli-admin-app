interface Feedback {
    sale?: any;
    purchase?: any;
}

interface OrderRequest {
    return?: any;
    change?: any;
}

interface Coupon {
    id?: any;
    amount: number;
}

interface Item {
    id: string;
    title: string;
    category_id: string;
    variation_id?: any;
    seller_custom_field?: any;
    variation_attributes: any[];
    warranty: string;
    condition: string;
    seller_sku?: any;
}

interface OrderItem {
    item: Item;
    quantity: number;
    unit_price: number;
    full_unit_price: number;
    currency_id: string;
    manufacturing_days?: any;
    sale_fee: number;
    listing_type_id: string;
}

interface Collector {
    id: string;
}

interface AtmTransferReference {
    company_id?: any;
    transaction_id: string;
}

interface Payment {
    id: string;
    order_id: string;
    payer_id: string;
    collector: Collector;
    card_id?: any;
    site_id: string;
    reason: string;
    payment_method_id: string;
    currency_id: string;
    installments: number;
    issuer_id: string;
    atm_transfer_reference: AtmTransferReference;
    coupon_id?: any;
    activation_uri?: any;
    operation_type: string;
    payment_type: string;
    available_actions: string[];
    status: string;
    status_code?: any;
    status_detail: string;
    transaction_amount: number;
    taxes_amount: number;
    shipping_cost: number;
    coupon_amount: number;
    overpaid_amount: number;
    total_paid_amount: number;
    installment_amount: number;
    deferred_period?: any;
    date_approved: Date;
    authorization_code: string;
    transaction_order_id?: any;
    date_created: Date;
    date_last_modified: Date;
}

interface Shipping {
    id?: any;
}

interface Phone {
    area_code: string;
    extension: string;
    number: string;
    verified: boolean;
}

interface AlternativePhone {
    area_code: string;
    extension: string;
    number: string;
}

interface BillingInfo {
    doc_type: string;
    doc_number: string;
}

interface Buyer {
    id: string;
    nickname: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: Phone;
    alternative_phone: AlternativePhone;
    billing_info: BillingInfo;
}

interface Phone2 {
    area_code: string;
    extension: string;
    number: string;
    verified: boolean;
}

interface AlternativePhone2 {
    area_code: string;
    extension: string;
    number: string;
}

interface Seller {
    id: string;
    nickname: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: Phone2;
    alternative_phone: AlternativePhone2;
}

interface Taxes {
    amount?: any;
    currency_id?: any;
}

export interface OrderInterface {
    id: string;
    date_created: Date;
    date_closed: Date;
    last_updated: Date;
    manufacturing_ending_date?: any;
    feedback: Feedback;
    mediations: any[];
    comments?: any;
    pack_id?: any;
    pickup_id?: any;
    order_request: OrderRequest;
    fulfilled?: any;
    total_amount: number;
    paid_amount: number;
    coupon: Coupon;
    expiration_date: Date;
    order_items: OrderItem[];
    currency_id: string;
    payments: Payment[];
    shipping: Shipping;
    status: string;
    status_detail?: any;
    tags: string[];
    buyer: Buyer;
    seller: Seller;
    taxes: Taxes;
}


