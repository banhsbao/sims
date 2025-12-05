import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async create(createProjectDto: CreateProjectDto, userId: string) {
        const project = this.projectRepository.create({
            ...createProjectDto,
            userId,
        });
        return this.projectRepository.save(project);
    }

    async findAll(userId: string) {
        return this.projectRepository.find({
            where: { userId },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string) {
        const project = await this.projectRepository.findOne({
            where: { id, userId },
            relations: ['customer', 'invoices'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
        const project = await this.findOne(id, userId);
        Object.assign(project, updateProjectDto);
        return this.projectRepository.save(project);
    }

    async remove(id: string, userId: string) {
        const project = await this.findOne(id, userId);
        await this.projectRepository.remove(project);
        return { message: 'Project deleted successfully' };
    }

    async findByReconciliationToken(token: string) {
        const project = await this.projectRepository.findOne({
            where: { reconciliationToken: token },
            relations: ['customer', 'invoices'],
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }

        return project;
    }

    async findByName(name: string, userId: string) {
        return this.projectRepository
            .createQueryBuilder('project')
            .where('project.userId = :userId', { userId })
            .andWhere('LOWER(project.name) LIKE LOWER(:name)', {
                name: `%${name}%`,
            })
            .getMany();
    }
}
