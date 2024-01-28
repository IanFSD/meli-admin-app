import {Check, Column, Entity, PrimaryColumn} from 'typeorm';

@Check(`id = 1`)
@Entity('cotizacion_dolar')
export class CotizacionDolarEntity {
    @PrimaryColumn({type: 'int', default: () => `1`, nullable: false})
    public id: 1;

    @Column({type: 'decimal'})
    cotizacion: number;

    @Column()
    fecha: Date;
}
