import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

export class AuthDTO {

    @Expose()
    @IsOptional()
    username: string;

    @Expose()
    @IsOptional()
    password: string;
}