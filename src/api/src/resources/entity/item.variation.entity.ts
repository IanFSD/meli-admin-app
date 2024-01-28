import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import {ItemVariationInterface} from "../interface/item.variation.interface";
import {ItemEntity} from "./item.entity";

@Entity('item-variation')
export class ItemVariationEntity {
    @PrimaryColumn({length: 32, unique: true})
    item_id: string;

    @PrimaryColumn({length: 32})
    id: string;

    @Column({nullable: false, type: 'numeric', precision: 18, scale: 2})
    price: number;

    @Column({nullable: false, type: 'integer'})
    available_quantity: number;

    @Column({nullable: false, length: 256})
    permalink: string;

    @Column({nullable: false, length: 256})
    thumbnail: string;

    @Column({nullable: true, length: 64})
    seller_custom_field: string;

    @Column({nullable: false, type: "json"})
    json: ItemVariationInterface;

    @ManyToOne(type => ItemEntity, item => item.Variations, {nullable: true})
    @JoinColumn([{name: 'item_id', referencedColumnName: 'id'}])
    Item: ItemEntity;

    // @ManyToOne(type => ProductEntity, item => item.Items, {nullable: true})
    // @JoinColumn([
    //     {name: 'user_id', referencedColumnName: 'user_id'},
    //     {name: 'seller_custom_field', referencedColumnName: 'id'}
    // ])
    // Product: ProductEntity;
}
