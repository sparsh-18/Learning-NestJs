import { Exclude, Expose, Transform } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { UserDto } from "src/users/dtos/user.dto";

export class CreateReportDto {
    @IsString()
    make: string;
  
    @IsString()
    model: string;

    @IsNumber()
    @Min(1990)
    @Max(2023)
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    price: number;

    @Exclude()
    user: UserDto;

    @Expose()
    @Transform(({obj}) => obj ? obj?.user?.id : obj)
    userId: number;
  }
  