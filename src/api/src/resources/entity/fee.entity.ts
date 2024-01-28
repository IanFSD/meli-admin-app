import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('fee')
export class FeeEntity {
    @Column({nullable: false, length: 64})
    name: string;

    @PrimaryColumn({nullable: false, unique: true, length: 32})
    listing_type_id: string;

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    threshold: number;

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    percentage_above_threshold: number;

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    fixed_value_per_item_above_threshold: number;

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    percentage_below_threshold: number;

    @Column({nullable: true, type: 'numeric', precision: 18, scale: 2})
    fixed_value_per_item_below_threshold: number;
}
