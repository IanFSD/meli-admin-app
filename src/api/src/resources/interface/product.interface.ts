import {MonedaEnum} from "../entity/product.entity";

export interface ProductInterface {
    id?: number;
    provider: string;
    code: string; // newbytes: CODIGO, polytech: Cód.
    fabricante?: string; // newbytes: ID FABRICNATE, polytech: Cód. Fab.
    description: string; // newbytes: DETALLE, polytech: descripcion
    iva: number; // newbytes: IVA, polytech: IVA
    stock: string; // newbytes: STOCK, polytech: Stock
    garantia?: string; // newbytes: GARANTIA
    moneda: MonedaEnum; // newbytes: MONEDA
    price: number; // newbytes: PRECIO, polytech: Precio (DOLAR (U$S))
    rubro?: string; // polytech: Rubro
    marca?: string; // polytech: Marca
    active: boolean;
    parent?: ProductInterface;
    children?: ProductInterface[];
}
