import {Check, Column, Entity, PrimaryColumn} from 'typeorm';

@Entity('token')
@Check(`id = 1`)
export class TokenEntity {
    @PrimaryColumn({type: 'int', default: () => `1`, nullable: false})
    id: number;

    @Column({length: 20, unique: true})
    user_id: string;

    @Column({length: 128, nullable: false})
    access_token: string;

    @Column({length: 16, nullable: false})
    token_type: string;

    @Column({type: 'integer', nullable: false})
    expires_in: number;

    @Column({length: 128, nullable: false})
    scope: string;

    @Column({length: 128, nullable: false})
    refresh_token: string;

    @Column({nullable: false})
    expires_date: Date;
}
