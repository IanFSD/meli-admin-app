interface Value {
    id: string;
    name: string;
    struct?: any;
}

interface AttributeCombination {
    id: string;
    name: string;
    value_id: string;
    value_name: string;
    value_struct?: any;
    values: Value[];
}

export interface ItemVariationInterface {
    id: string;
    price: number;
    attribute_combinations: AttributeCombination[];
    available_quantity: number;
    sold_quantity: number;
    sale_terms: any[];
    picture_ids: string[];
    seller_custom_field?: any;
    catalog_product_id?: any;
    inventory_id?: any;
    item_relations: any[];
}
