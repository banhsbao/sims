import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({
        description: 'Project name',
        example: 'Website Redesign'
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        description: 'Project description',
        example: 'Complete website redesign for client'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Customer ID associated with this project',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional({
        description: 'Project image URL',
        example: 'https://example.com/project-image.jpg'
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}
