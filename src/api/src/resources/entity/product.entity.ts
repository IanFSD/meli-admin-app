import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {ItemProductEntity} from "./item.product.entity";

export enum MonedaEnum {ARS = 'ARS', USD = 'USD'}

@Entity("product")
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 32, nullable: false})
    provider: string;

    @Column({length: 32, nullable: false})
    code: string; // newbytes: CODIGO, polytech: Cód.

    @Column({length: 32, nullable: true})
    fabricante?: string; // newbytes: ID FABRICNATE, polytech: Cód. Fab.

    @Column({length: 256, nullable: false})
    description: string; // newbytes: DETALLE, polytech: descripcion

    @Column({type: "numeric", precision: 18, scale: 2, nullable: true})
    iva: number; // newbytes: IVA, polytech: IVA

    @Column({length: 32, nullable: false})
    stock: string; // newbytes: STOCK, polytech: Stock

    @Column({length: 32, nullable: true})
    garantia?: string; // newbytes: GARANTIA

    @Column({length: 16, nullable: false})
    moneda: MonedaEnum; // newbytes: MONEDA

    @Column({type: "numeric", precision: 18, scale: 2, nullable: false})
    price: number; // newbytes: PRECIO, polytech: Precio (DOLAR (U$S))

    @Column({length: 128, nullable: true})
    rubro?: string; // polytech: Rubro

    @Column({length: 64, nullable: true})
    marca?: string; // polytech: Marca

    @Column({nullable: true})
    active: boolean;

    @ManyToOne((type) => ProductEntity, (product) => product.children)
    @JoinColumn([{name: "parent_id", referencedColumnName: "id"}])
    parent?: ProductEntity;

    @OneToMany(type => ProductEntity, (product) => product.parent)
    @JoinColumn([{name: "parent_id", referencedColumnName: "id"}])
    children?: ProductEntity[];

    @OneToMany(type => ItemProductEntity, itemProduct => itemProduct.Product, {nullable: true})
    ItemProduct: ItemProductEntity;

    // //Columnas agregadas por franco
    //
    // @Column({length: 128, nullable: true})
    // descuento?: string;
    //
    // @Column({length: 128, nullable: true})
    // newPrice?: string;
    //
    // @Column({length: 128, nullable: true})
    // listPrice?: string;
    //
    // @Column({type: "numeric", precision: 18, scale: 2, nullable: true})
    // impInt?: number;
    //
    // @Column({length: 128, nullable: true})
    // etiqueta?: string;
    //
    //
    //
    // @Column({nullable: true})
    // descripLarga?: string;
    //
    // @Column({nullable: true})
    // descripDetallada?: string;
    //
    // @Column({type: "numeric", precision: 18, scale: 2, nullable: true})
    // precioDolar: number;
    //
    // @Column({type: "numeric", precision: 18, scale: 2, nullable: true})
    // precioConIVA: number;

    //-----------------

    // @OneToMany(type => ItemEntity, item => item.Product, {nullable: true})
    // @JoinColumn([
    //     {name: 'user_id', referencedColumnName: 'user_id'},
    //     {name: 'id', referencedColumnName: 'seller_custom_field'}
    // ])
    // Items?: ItemEntity[];

    // @OneToMany(type => ItemVariationEntity, item => item.Product, {nullable: true})
    // @JoinColumn([
    //     {name: 'user_id', referencedColumnName: 'user_id'},
    //     {name: 'id', referencedColumnName: 'seller_custom_field'}
    // ])
    // ItemVariations?: ItemVariationEntity[];
}
