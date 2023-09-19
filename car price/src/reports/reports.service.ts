import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly repo: Repository<Report>
    ) {}

    async create(dto: CreateReportDto, user: User): Promise<CreateReportDto> {
        let report: Report = await this.repo.create(dto);
        report.user = user;
        report = await this.repo.save(report);
        // console.log(report);
        const reportDto = plainToClass(CreateReportDto, report);
        console.log(reportDto);
        return reportDto;
    }
}
