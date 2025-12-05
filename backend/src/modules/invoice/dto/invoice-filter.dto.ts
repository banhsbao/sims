import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceFilterDto {
    @ApiPropertyOptional({
        description: 'Filter by customer name',
        example: 'John Smith'
    })
    @IsString()
    @IsString()
    @IsOptional()
    customerName?: string;

    @ApiPropertyOptional({
        description: 'Filter by invoice number',
        example: 'INV-2024-001'
    })
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @ApiPropertyOptional({
        description: 'Filter by start date',
        example: '2024-01-01'
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'Filter by end date',
        example: '2024-12-31'
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({
        description: 'Filter by status',
        example: 'PENDING'
    })
    @IsString()
    @IsOptional()
    status?: string;
}
