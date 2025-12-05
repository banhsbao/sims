import {
    Injectable,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { username, password } = registerDto;

        const existingUser = await this.userRepository.findOne({
            where: { username },
        });

        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            username,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
        };
    }

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;

        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };
        const accessToken = this.jwtService.sign(payload);

        return {
            accessToken,
            user: {
                id: user.id,
                username: user.username,
            },
        };
    }

    async validateUser(userId: string) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
}
