import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from './product.entity';

@Entity('invoice_items')
export class InvoiceItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    productName: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    totalPrice: number;

    @Column()
    invoiceId: string;

    @Column({ nullable: true })
    productId: string;

    @ManyToOne(() => Invoice, (invoice) => invoice.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'invoiceId' })
    invoice: Invoice;

    @ManyToOne(() => Product, (product) => product.invoiceItems, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
