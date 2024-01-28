import {Check, Column, Entity, PrimaryColumn} from 'typeorm';
import {UserMeliDataInterface} from "../interface/user.meli.data.interface";

@Entity('user_data')
@Check(`id = 1`)
export class UserDataEntity {
    @PrimaryColumn({type: 'int', default: () => `1`, nullable: false})
    id: number;

    @Column({nullable: false, length: 128, unique: true})
    user_id: string;

    @Column({type: "json"})
    json: UserMeliDataInterface;
}
