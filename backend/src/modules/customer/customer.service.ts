import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto, userId: string) {
        const customer = this.customerRepository.create({
            ...createCustomerDto,
            userId,
        });
        return this.customerRepository.save(customer);
    }

    async findAll(userId: string) {
        return this.customerRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string) {
        const customer = await this.customerRepository.findOne({
            where: { id, userId },
            relations: ['invoices', 'projects'],
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        return customer;
    }

    async update(
        id: string,
        updateCustomerDto: UpdateCustomerDto,
        userId: string,
    ) {
        const customer = await this.findOne(id, userId);
        Object.assign(customer, updateCustomerDto);
        return this.customerRepository.save(customer);
    }

    async remove(id: string, userId: string) {
        const customer = await this.findOne(id, userId);
        await this.customerRepository.remove(customer);
        return { message: 'Customer deleted successfully' };
    }

    async findByName(name: string, userId: string) {
        return this.customerRepository
            .createQueryBuilder('customer')
            .where('customer.userId = :userId', { userId })
            .andWhere('LOWER(customer.name) LIKE LOWER(:name)', {
                name: `%${name}%`,
            })
            .getMany();
    }
}
