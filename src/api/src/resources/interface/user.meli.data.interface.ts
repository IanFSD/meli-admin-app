interface Identification {
    number: string;
    type: string;
}

interface Address {
    address: string;
    city: string;
    state: string;
    zip_code: string;
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

interface BillData {
    accept_credit_note?: any;
}

interface Ratings {
    negative: number;
    neutral: number;
    positive: number;
}

interface Transactions {
    canceled: number;
    completed: number;
    period: string;
    ratings: Ratings;
    total: number;
}

interface Sales {
    period: string;
    completed: number;
}

interface Claims {
    period: string;
    rate: number;
    value: number;
}

interface DelayedHandlingTime {
    period: string;
    rate: number;
    value: number;
}

interface Cancellations {
    period: string;
    rate: number;
    value: number;
}

interface Metrics {
    sales: Sales;
    claims: Claims;
    delayed_handling_time: DelayedHandlingTime;
    cancellations: Cancellations;
}

interface SellerReputation {
    level_id: string;
    power_seller_status?: any;
    transactions: Transactions;
    metrics: Metrics;
}

interface Canceled {
    paid?: any;
    total?: any;
}

interface NotYetRated {
    paid?: any;
    total?: any;
    units?: any;
}

interface Unrated {
    paid?: any;
    total?: any;
}

interface Transactions2 {
    canceled: Canceled;
    completed?: any;
    not_yet_rated: NotYetRated;
    period: string;
    total?: any;
    unrated: Unrated;
}

interface BuyerReputation {
    canceled_transactions: number;
    tags: any[];
    transactions: Transactions2;
}

interface Billing {
    allow: boolean;
    codes: any[];
}

interface ImmediatePayment {
    reasons: any[];
    required: boolean;
}

interface Buy {
    allow: boolean;
    codes: any[];
    immediate_payment: ImmediatePayment;
}

interface ShoppingCart {
    buy: string;
    sell: string;
}

interface ImmediatePayment2 {
    reasons: any[];
    required: boolean;
}

interface List {
    allow: boolean;
    codes: any[];
    immediate_payment: ImmediatePayment2;
}

interface ImmediatePayment3 {
    reasons: any[];
    required: boolean;
}

interface Sell {
    allow: boolean;
    codes: any[];
    immediate_payment: ImmediatePayment3;
}

interface Status {
    billing: Billing;
    buy: Buy;
    confirmed_email: boolean;
    shopping_cart: ShoppingCart;
    immediate_payment: boolean;
    list: List;
    mercadoenvios: string;
    mercadopago_account_type: string;
    mercadopago_tc_accepted: boolean;
    required_action: string;
    sell: Sell;
    site_status: string;
    user_type: string;
}

interface Company {
    brand_name?: any;
    city_tax_id: string;
    corporate_name: string;
    identification: string;
    state_tax_id: string;
    cust_type_id: string;
    soft_descriptor?: any;
}

interface Credit {
    consumed: number;
    credit_level_id: string;
    rank: string;
}

interface Context {
}

interface Thumbnail {
    picture_id: string;
    picture_url: string;
}

export interface UserMeliDataInterface {
    id: number;
    nickname: string;
    registration_date: Date;
    first_name: string;
    last_name: string;
    gender: string;
    country_id: string;
    email: string;
    identification: Identification;
    internal_tags: string[];
    address: Address;
    phone: Phone;
    alternative_phone: AlternativePhone;
    user_type: string;
    tags: string[];
    logo?: any;
    points: number;
    site_id: string;
    permalink: string;
    shipping_modes: string[];
    seller_experience: string;
    bill_data: BillData;
    seller_reputation: SellerReputation;
    buyer_reputation: BuyerReputation;
    status: Status;
    secure_email: string;
    company: Company;
    credit: Credit;
    context: Context;
    thumbnail: Thumbnail;
}
