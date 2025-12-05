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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'Project successfully created' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
        return this.projectService.create(createProjectDto, user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    @ApiResponse({ status: 200, description: 'Returns all projects for the current user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findAll(@CurrentUser() user: any) {
        return this.projectService.findAll(user.userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project by ID' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Returns the project' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectService.findOne(id, user.userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a project' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Project successfully updated' })
    @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @CurrentUser() user: any,
    ) {
        return this.projectService.update(id, updateProjectDto, user.userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a project' })
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiResponse({ status: 200, description: 'Project successfully deleted' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    remove(@Param('id') id: string, @CurrentUser() user: any) {
        return this.projectService.remove(id, user.userId);
    }
}

@ApiTags('projects')
@Controller('public/reconciliation/project')
export class PublicProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Get(':token')
    @ApiOperation({ summary: 'Get project by reconciliation token (public)' })
    @ApiParam({ name: 'token', description: 'Reconciliation token' })
    @ApiResponse({ status: 200, description: 'Returns the project' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getByReconciliationToken(@Param('token') token: string) {
        return this.projectService.findByReconciliationToken(token);
    }
}
