import { IsBoolean } from "class-validator";

export class ApprovalReportDto {
    @IsBoolean()
    approved: boolean;
}