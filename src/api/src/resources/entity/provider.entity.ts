import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('provider')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 128, unique: true })
  codigo: string;

  @Column({ nullable: false, length: 128 })
  descripcion: string;

  @Column({ nullable: false, type: "numeric", precision: 18, scale: 2 })
  ganancia: number;

  @Column({ nullable: false, type: "numeric", precision: 18, scale: 2 })
  impuestosVarios: number;

  @Column({ nullable: false, type: "numeric", precision: 18, scale: 2 })
  gastosAdminsitrativos: number;

  @Column({ nullable: false })
  diasEntrega: number;
}
