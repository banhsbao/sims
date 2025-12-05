import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InvoiceAiService } from './invoice-ai.service';

@ApiTags('invoices')
@ApiBearerAuth()
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly invoiceAiService: InvoiceAiService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new invoice' })
    @ApiResponse({ status: 201, description: 'Invoice successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createInvoiceDto: CreateInvoiceDto, @CurrentUser() user: any) {
        return this.invoiceService.create(createInvoiceDto, user.userId);
    }

    @Post('upload')
    @ApiOperation({ summary: 'Upload invoice image for OCR processing' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Invoice image file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Invoice data extracted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - invalid file' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadInvoice(
        @UploadedFile() file: any,
        @CurrentUser() user: any,
    ) {
        return this.invoiceAiService.extractInvoiceData(
            file.path,
            file.filename,
            user.userId,
        );
    }

    @Get()
    @ApiOperation({ summary: 'Get all invoices with optional filters' })
    @ApiQuery({ name: 'customerName', required: false, description: 'Filter by customer name' })
    @ApiQuery({ name: 'invoiceNumber', required: false, description: 'Filter by invoice number' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Filter by start date' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Filter by end date' })
    @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
    @ApiResponse({ status: 200, description: 'Returns all invoices for the current user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@CurrentUser() user: any, @Query() filters: InvoiceFilterDto) {
        return this.invoiceService.findAll(user.userId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an invoice by ID' })
    @ApiParam({ name: 'id', description: 'Invoice ID' })
    @ApiResponse({ status: 200, description: 'Returns the invoice' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.invoiceService.findOne(id, user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an invoice' })
    @ApiParam({ name: 'id', description: 'Invoice ID' })
    @ApiResponse({ status: 200, description: 'Invoice successfully updated' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    update(
        @Param('id') id: string,
        @Body() updateInvoiceDto: UpdateInvoiceDto,
        @CurrentUser() user: any,
    ) {
        return this.invoiceService.update(id, updateInvoiceDto, user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an invoice' })
    @ApiParam({ name: 'id', description: 'Invoice ID' })
    @ApiResponse({ status: 200, description: 'Invoice successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.invoiceService.remove(id, user.userId);
    }
}

@ApiTags('invoices')
@Controller('public/reconciliation')
export class PublicInvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Get(':token')
    @ApiOperation({ summary: 'Get invoice by reconciliation token (public)' })
    @ApiParam({ name: 'token', description: 'Reconciliation token' })
    @ApiResponse({ status: 200, description: 'Returns the invoice' })
    @ApiResponse({ status: 404, description: 'Invoice not found' })
    async getByReconciliationToken(@Param('token') token: string) {
        return this.invoiceService.findByReconciliationToken(token);
    }
}
