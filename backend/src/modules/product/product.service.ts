import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto, userId: string) {
        const product = this.productRepository.create({
            ...createProductDto,
            userId,
        });
        return this.productRepository.save(product);
    }

    async findAll(userId: string) {
        return this.productRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string) {
        const product = await this.productRepository.findOne({
            where: { id, userId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
        const product = await this.findOne(id, userId);
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async remove(id: string, userId: string) {
        const product = await this.findOne(id, userId);
        await this.productRepository.remove(product);
        return { message: 'Product deleted successfully' };
    }

    async findByName(name: string, userId: string) {
        return this.productRepository
            .createQueryBuilder('product')
            .where('product.userId = :userId', { userId })
            .andWhere('LOWER(product.name) LIKE LOWER(:name)', {
                name: `%${name}%`,
            })
            .getMany();
    }
}
