import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';
import { ApprovalReportDto } from './dtos/approval-report.dto';
import { EstimateReportDto } from './dtos/estimate-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly repo: Repository<Report>,
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

  async approve(dto: ApprovalReportDto, reportId: string) {
    let report: Report = await this.repo.findOneBy({ id: parseInt(reportId) });
    report.approved = dto.approved;
    report = await this.repo.save(report);
    return plainToClass(CreateReportDto, report);
  }

  async calculateEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: EstimateReportDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
