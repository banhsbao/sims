import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        @InjectRepository(InvoiceItem)
        private invoiceItemRepository: Repository<InvoiceItem>,
    ) { }

    async create(createInvoiceDto: CreateInvoiceDto, userId: string) {
        const { items, ...invoiceData } = createInvoiceDto;

        const invoice = this.invoiceRepository.create({
            ...invoiceData,
            userId,
        });

        const savedInvoice = await this.invoiceRepository.save(invoice);

        if (items && items.length > 0) {
            const invoiceItems = items.map((item) =>
                this.invoiceItemRepository.create({
                    ...item,
                    invoiceId: savedInvoice.id,
                }),
            );
            await this.invoiceItemRepository.save(invoiceItems);
        }

        return this.findOne(savedInvoice.id, userId);
    }

    async findAll(userId: string, filters?: InvoiceFilterDto) {
        const query = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.customer', 'customer')
            .leftJoinAndSelect('invoice.project', 'project')
            .leftJoinAndSelect('invoice.items', 'items')
            .where('invoice.userId = :userId', { userId });

        if (filters?.customerName) {
            query.andWhere('LOWER(customer.name) LIKE LOWER(:customerName)', {
                customerName: `%${filters.customerName}%`,
            });
        }

        if (filters?.invoiceNumber) {
            query.andWhere(
                'LOWER(invoice.invoiceNumber) LIKE LOWER(:invoiceNumber)',
                {
                    invoiceNumber: `%${filters.invoiceNumber}%`,
                },
            );
        }

        if (filters?.status) {
            query.andWhere('invoice.status = :status', { status: filters.status });
        }

        if (filters?.startDate && filters?.endDate) {
            query.andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
                startDate: filters.startDate,
                endDate: filters.endDate,
            });
        }

        query.orderBy('invoice.createdAt', 'DESC');

        return query.getMany();
    }

    async findOne(id: string, userId: string) {
        const invoice = await this.invoiceRepository.findOne({
            where: { id, userId },
            relations: ['customer', 'project', 'items', 'items.product'],
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }

    async update(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string) {
        const invoice = await this.findOne(id, userId);
        const { items, ...invoiceData } = updateInvoiceDto;

        Object.assign(invoice, invoiceData);
        await this.invoiceRepository.save(invoice);

        if (items) {
            await this.invoiceItemRepository.delete({ invoiceId: id });

            if (items.length > 0) {
                const invoiceItems = items.map((item) =>
                    this.invoiceItemRepository.create({
                        ...item,
                        invoiceId: id,
                    }),
                );
                await this.invoiceItemRepository.save(invoiceItems);
            }
        }

        return this.findOne(id, userId);
    }

    async remove(id: string, userId: string) {
        const invoice = await this.findOne(id, userId);
        await this.invoiceRepository.remove(invoice);
        return { message: 'Invoice deleted successfully' };
    }

    async findByReconciliationToken(token: string) {
        const invoice = await this.invoiceRepository.findOne({
            where: { reconciliationToken: token },
            relations: ['customer', 'project', 'items', 'items.product'],
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return invoice;
    }
}
