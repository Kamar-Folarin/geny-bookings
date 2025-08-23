import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  provider_id: string;

  @IsUUID()
  service_id: string;

  @IsDateString()
  start_time: Date;

  @IsDateString()
  end_time: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}