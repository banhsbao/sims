import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceService } from './invoice.service';
import {
    InvoiceController,
    PublicInvoiceController,
} from './invoice.controller';
import { InvoiceAiService } from './invoice-ai.service';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { CustomerModule } from '../customer/customer.module';
import { ProductModule } from '../product/product.module';
import { ProjectModule } from '../project/project.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Invoice, InvoiceItem]),
        CustomerModule,
        ProductModule,
        ProjectModule,
    ],
    controllers: [InvoiceController, PublicInvoiceController],
    providers: [InvoiceService, InvoiceAiService],
    exports: [InvoiceService],
})
export class InvoiceModule { }
