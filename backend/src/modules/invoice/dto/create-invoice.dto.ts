import {
    IsString,
    IsOptional,
    IsNumber,
    IsEnum,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from '../../../entities/invoice.entity';

export class InvoiceItemDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Web Development'
    })
    @IsString()
    productName: string;

    @ApiProperty({
        description: 'Quantity of product/service',
        example: 2
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        description: 'Unit price',
        example: 500
    })
    @IsNumber()
    unitPrice: number;

    @ApiProperty({
        description: 'Total price for this item',
        example: 1000
    })
    @IsNumber()
    totalPrice: number;

    @ApiPropertyOptional({
        description: 'Product ID if linked to existing product',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsOptional()
    productId?: string;
}

export class CreateInvoiceDto {
    @ApiProperty({
        description: 'Invoice number',
        example: 'INV-2024-001'
    })
    @IsString()
    invoiceNumber: string;

    @ApiPropertyOptional({
        description: 'Customer ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional({
        description: 'Project ID',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsOptional()
    projectId?: string;

    @ApiProperty({
        description: 'Total invoice amount',
        example: 1000
    })
    @IsNumber()
    totalAmount: number;

    @ApiPropertyOptional({
        description: 'Amount already paid',
        example: 500
    })
    @IsNumber()
    @IsOptional()
    paidAmount?: number;

    @ApiPropertyOptional({
        description: 'Remaining debt amount',
        example: 500
    })
    @IsNumber()
    @IsOptional()
    debtAmount?: number;

    @ApiPropertyOptional({
        description: 'Invoice status',
        enum: InvoiceStatus,
        example: InvoiceStatus.PENDING
    })
    @IsEnum(InvoiceStatus)
    @IsOptional()
    status?: InvoiceStatus;

    @ApiPropertyOptional({
        description: 'Invoice image URL',
        example: 'https://example.com/invoice.jpg'
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty({
        description: 'Invoice items',
        type: [InvoiceItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];
}
