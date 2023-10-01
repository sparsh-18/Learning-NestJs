import { Transform } from "class-transformer";
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class EstimateReportDto {
    @IsString()
    make: string;
  
    @IsString()
    model: string;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(1990)
    @Max(2023)
    year: number;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Transform(({value}) => parseInt(value))
    @IsLongitude()
    lng: number;

    @Transform(({value}) => parseInt(value))
    @IsLatitude()
    lat: number;
  }
  