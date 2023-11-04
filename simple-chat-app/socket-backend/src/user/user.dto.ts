import { Expose } from "class-transformer";
import { IsOptional } from "class-validator";

export class UserDTO {
    
    @Expose()
    @IsOptional()
    id: number;

    @Expose()
    @IsOptional()
    username: string;

    @Expose()
    @IsOptional()
    password: string;
}