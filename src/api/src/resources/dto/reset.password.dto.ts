import {ApiProperty} from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty()
    password: string;

    @ApiProperty()
    key: string;

    @ApiProperty()
    token: string;
}
