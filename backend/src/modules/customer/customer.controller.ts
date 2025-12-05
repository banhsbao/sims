import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('customers')
@ApiBearerAuth()
@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new customer' })
    @ApiResponse({ status: 201, description: 'Customer successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(
        @Body() createCustomerDto: CreateCustomerDto,
        @CurrentUser() user: any,
    ) {
        return this.customerService.create(createCustomerDto, user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all customers' })
    @ApiResponse({ status: 200, description: 'Returns all customers for the current user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@CurrentUser() user: any) {
        return this.customerService.findAll(user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a customer by ID' })
    @ApiParam({ name: 'id', description: 'Customer ID' })
    @ApiResponse({ status: 200, description: 'Returns the customer' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.customerService.findOne(id, user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a customer' })
    @ApiParam({ name: 'id', description: 'Customer ID' })
    @ApiResponse({ status: 200, description: 'Customer successfully updated' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
        @CurrentUser() user: any,
    ) {
        return this.customerService.update(id, updateCustomerDto, user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a customer' })
    @ApiParam({ name: 'id', description: 'Customer ID' })
    @ApiResponse({ status: 200, description: 'Customer successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.customerService.remove(id, user.userId);
    }
}
