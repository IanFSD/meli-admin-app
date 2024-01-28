import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 128, unique: true})
    email: string;
}
