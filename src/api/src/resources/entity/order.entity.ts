import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('order')
export class OrderEntity {
    @PrimaryColumn({length: 20})
    id: string;

    @Column({type: 'json'})
    readonly order: any;
}
