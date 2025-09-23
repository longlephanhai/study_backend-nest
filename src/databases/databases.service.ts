import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permissions/schema/permission.schema';
import { Role } from 'src/roles/schema/role.schema';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample.data';
import { hashPassword } from 'src/util';

@Injectable()
export class DatabasesService implements OnModuleInit {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    private configService: ConfigService,
    private userService: UsersService
  ) { }

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments();
      const countPermission = await this.permissionModel.countDocuments();
      const countRole = await this.roleModel.countDocuments();

      // create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS)
      }
      // create roles
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select("_id")
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: "System admin, has all rights",
            isActive: true,
            permissions: permissions
          },
          {
            name: USER_ROLE,
            description: "Users using the system",
            isActive: true,
            permissions: []
          }
        ])
      }
      // create admin and user
      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            fullName: "ADMIN",
            age: 20,
            email: "admin@gmail.com",
            password: hashPassword(this.configService.get<string>('INIT_PASSWORD')!),
            phone: "0377651138",
            address: "Đà Nẵng",
            role: adminRole?._id,
            avatar: "Hải Long-1756430446516.jpeg"
          },
          {
            fullName: "USER",
            age: 20,
            email: "user@gmail.com",
            password: hashPassword(this.configService.get<string>('INIT_PASSWORD')!),
            phone: "0377651138",
            address: "Đà Nẵng",
            role: userRole?._id,
            avatar: "Hải Long-1756430446516.jpeg"
          }
        ])
      }

      if (countUser > 0 && countRole > 0 && countPermission > 0) {
        console.log("Database initialized already. To re-initialize, please clear the database and set SHOULD_INIT to true in the .env file")
      }
    }
  }
}
