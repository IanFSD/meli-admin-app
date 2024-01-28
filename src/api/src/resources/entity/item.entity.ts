import {Column, Entity, JoinColumn, OneToMany, PrimaryColumn} from 'typeorm';
import {ItemInterface} from "../interface/item.interface";
import {ItemVariationEntity} from "./item.variation.entity";
import {ItemProductEntity} from "./item.product.entity";

@Entity('item')
export class ItemEntity {
    @PrimaryColumn({length: 32, unique: true})
    id: string;

    @Column({nullable: false, length: 128})
    title: string;

    @Column({nullable: false, length: 32})
    category_id: string;

    @Column({nullable: false, type: 'numeric', precision: 18, scale: 2})
    price: number;

    @Column({nullable: false, type: 'integer'})
    available_quantity: number;

    @Column({nullable: false, length: 32})
    listing_type_id: string;

    @Column({nullable: false, length: 256})
    permalink: string;

    @Column({nullable: false, length: 256})
    thumbnail: string;

    @Column({nullable: false, length: 16})
    status: string;

    @Column({nullable: false, type: 'simple-array'})
    sub_status: string[];

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    health: number;

    @Column({nullable: true, length: 64})
    seller_custom_field: string;

    @Column({nullable: false, type: "json"})
    json: ItemInterface;

    @OneToMany(type => ItemVariationEntity, item => item.Item, {nullable: true})
    @JoinColumn([{name: 'id', referencedColumnName: 'item_id'}])
    Variations?: ItemVariationEntity[];

    @OneToMany(type => ItemProductEntity, itemProduct => itemProduct.Item, {nullable: true})
    ItemProduct: ItemProductEntity;
}
