import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    BeforeInsert,
} from 'typeorm';
import { randomBytes } from 'crypto';
import { User } from './user.entity';
import { Customer } from './customer.entity';
import { Project } from './project.entity';
import { InvoiceItem } from './invoice-item.entity';

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    invoiceNumber: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    paidAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    debtAmount: number;

    @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
    status: InvoiceStatus;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ unique: true })
    reconciliationToken: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    customerId: string;

    @Column({ nullable: true })
    projectId: string;

    @ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Customer, (customer) => customer.invoices, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @ManyToOne(() => Project, (project) => project.invoices, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @OneToMany(() => InvoiceItem, (item) => item.invoice, {
        cascade: true,
        eager: true,
    })
    items: InvoiceItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generateReconciliationToken() {
        if (!this.reconciliationToken) {
            this.reconciliationToken = randomBytes(32).toString('hex');
        }
    }
}
