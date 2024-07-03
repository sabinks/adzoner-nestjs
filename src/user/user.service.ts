import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(roleName: string, data: CreateUserDto) {
        let role = this.prisma.role.findFirst({ where: { name: roleName } })
        let user = await this.prisma.user.create({
            data: {
                username: data.username, displayName: data.displayName,
                userSetting: {
                    create: {
                        smsEnabled: true,
                        notificationOn: false
                    }
                },
                userRole: {
                    create: {
                        roleId: (await role).id
                    }
                }
            }
        })
    }

    async findAll() {
        let users = await this.prisma.user
            .findMany({ include: { userSetting: true, posts: true } });
        return users.map((user) => ({ ...user, id: user.id.toString() }))
    }

    async findOne(id: number) {
        let user = await this.prisma.user.findUnique({
            where: { id }, include: {
                userSetting: {
                    select: {
                        id: true,
                        smsEnabled: true,
                        notificationOn: true
                    }
                },
                posts: true
            }
        });
        if (!user) {
            return null
        }
        return { ...user, id: user.id.toString() }
    }

    async findByUsername(username: string) {
        let user = await this.prisma.user.findUnique({
            where: { username }
        });
        return { ...user, id: user.id.toString() }
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    async remove(id: number) {
        let user = await this.findOne(id)
        if (!user) {
            throw new HttpException('User not found!', 404)
        }
        await this.prisma.user.delete({
            where: { id }
        })
    }
}