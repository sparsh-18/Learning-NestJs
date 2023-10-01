import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { CurrentUser } from 'src/users/utils/current-user.decorator';
import { ApprovalReportDto } from './dtos/approval-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { EstimateReportDto } from './dtos/estimate-report.dto';

@Controller('report')
export class ReportsController {
    constructor(private reportService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    async createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportService.create(body, user);
    }

    @Patch('/:reportId')
    @UseGuards(AdminGuard)
    async approveReport(@Param('reportId') reportId: string, @Body() body: ApprovalReportDto) {
        return this.reportService.approve(body, reportId);
    }

    @Get('/estimate')
    async getEstimate(@Query() query: EstimateReportDto) {
        return this.reportService.calculateEstimate(query);
    }
}
