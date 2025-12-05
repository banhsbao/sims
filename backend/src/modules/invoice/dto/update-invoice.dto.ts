import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto, InvoiceItemDto } from './create-invoice.dto';
import { IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
    @ApiPropertyOptional({
        description: 'Invoice items',
        type: [InvoiceItemDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    @IsOptional()
    items?: InvoiceItemDto[];
}
