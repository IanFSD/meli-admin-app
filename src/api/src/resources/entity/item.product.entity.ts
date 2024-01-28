import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {ItemEntity} from "./item.entity";
import {ProductEntity} from "./product.entity";

@Entity('item-product')
@Unique(['Item', "Product"])
export class ItemProductEntity {
    @PrimaryGeneratedColumn()
    id: null;

    @ManyToOne(type => ItemEntity, item => item.ItemProduct, {nullable: false})
    @JoinColumn([{name: 'item_id', referencedColumnName: 'id'}])
    Item: ItemEntity;

    @ManyToOne(type => ProductEntity, product => product.ItemProduct, {nullable: false})
    @JoinColumn([{name: "product_id", referencedColumnName: "id"}])
    Product: ProductEntity;
}
