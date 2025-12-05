import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
    @ApiProperty({
        description: 'Customer name',
        example: 'John Smith'
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Customer address',
        example: '123 Main St, City'
    })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({
        description: 'Customer phone number',
        example: '+1234567890'
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({
        description: 'Customer email',
        example: 'john@example.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}
