import {Check, Column, Entity, PrimaryColumn} from "typeorm";

@Entity("parameter")
@Check(`id = 1`)
export class ParameterEntity {
    @PrimaryColumn({type: 'int', default: () => `1`, nullable: false})
    id: number;

    @Column({nullable: false, type: "numeric", precision: 18, scale: 2})
    comisionClasica: number;

    @Column({nullable: false, type: "numeric", precision: 18, scale: 2})
    comisionPremium: number;

    @Column({nullable: false, type: "numeric", precision: 18, scale: 2})
    impuestosVarios: number;

    @Column({nullable: false, type: "numeric", precision: 18, scale: 2})
    gastosAdminsitrativos: number;

    @Column({nullable: false, type: "numeric", precision: 18, scale: 2})
    limiteCostoEnvio: number;
}
