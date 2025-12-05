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
import { Invoice } from './invoice.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ unique: true })
    reconciliationToken: string;

    @Column()
    userId: string;

    @Column({ nullable: true })
    customerId: string;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Customer, (customer) => customer.projects, {
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @OneToMany(() => Invoice, (invoice) => invoice.project)
    invoices: Invoice[];

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
