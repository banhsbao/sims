import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Web Development Service'
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Product description',
        example: 'Professional web development services'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Default price for the product',
        example: 1000
    })
    @IsNumber()
    @IsOptional()
    defaultPrice?: number;
}
