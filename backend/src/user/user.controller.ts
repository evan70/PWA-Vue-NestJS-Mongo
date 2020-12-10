import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
  UploadedFile,
  Delete,
  Put,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UserDto } from '../dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { NewUserDto } from '../dto/newUser.dto';
import { File } from '../file/file.interface';
import { Roles } from '../authentication/roles.decorator';
import { RolesGuard } from '../authentication/roles.guard';
import { NewAdminDto } from '../dto/newAdmin.dto';
import { EmailDto } from '../dto/email.dto';
import { PasswordDto } from '../dto/password.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { UpdateEmailDto } from '../dto/updateEmail.dto';
import { PersonalInformation, PersonalSettings } from '../dto/user.dto';
import { NotificationService } from '../notification/notification.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getAllUser(): Promise<UserDto[]> {
    return (await this.userService.getAllUser(true)) as UserDto[];
  }

  /*
  TODO:
  - specify notification
  - move method to suitable place
  */
  @Post('notify/:userId')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async notifyUser(
    @Param() params,
    @Body() notification: any,
  ): Promise<string> {
    const user = (await this.userService.getUserById(
      params.userId,
      false,
    )) as User;
    if (!user) {
      return 'No user found';
    } else if (
      !user.personalSettings ||
      !user.personalSettings.notificationSubscription
    ) {
      return 'User has no active subscription for notifications';
    }
    const result = await this.notificationService.sendNotification(
      user.personalSettings.notificationSubscription,
      JSON.stringify(notification),
    );

    if (result) {
      return 'Successfully sent notification';
    } else {
      return 'Failed to send notification';
    }
  }

  @Post()
  async addUser(@Body() newUserDto: NewUserDto): Promise<UserDto> {
    return (await this.userService.addUser(newUserDto, true)) as UserDto;
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Request() req: any): Promise<UserDto> {
    return (await this.userService.getUserById(req.user.sub, true)) as UserDto;
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserById(@Request() req: any): Promise<boolean> {
    return this.userService.deleteUserById(req.user.sub);
  }

  @Post('profile/image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profileImage'))
  async addProfileImage(
    @Request() req: any,
    @UploadedFile() image: File,
  ): Promise<string> {
    return this.userService.addProfileImage(req.user.sub, image);
  }

  @Get('profile/image')
  @UseGuards(AuthGuard('jwt'))
  async getProfileImage(@Request() req: any): Promise<string> {
    return this.userService.getProfileImage(req.user.sub);
  }

  @Put('profile/email')
  @UseGuards(AuthGuard('jwt'))
  async updateEmail(
    @Request() req: any,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.userService.updateEmail(req.user.sub, updateEmailDto);
  }

  @Put('profile/personalinformation')
  @UseGuards(AuthGuard('jwt'))
  async updatePersonalInformation(
    @Request() req: any,
    @Body() personalInformation: PersonalInformation,
  ) {
    return this.userService.updatePersonalInformation(
      req.user.sub,
      personalInformation,
    );
  }

  @Put('profile/personalsettings')
  @UseGuards(AuthGuard('jwt'))
  async updatePersonalSettings(
    @Request() req: any,
    @Body() personalSettings: PersonalSettings,
  ) {
    return this.userService.updatePersonalSettings(
      req.user.sub,
      personalSettings,
    );
  }

  @Put('profile/password')
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(
    @Request() req: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(req.user.sub, updatePasswordDto);
  }

  @Put('confirm')
  async confirmEmail(@Query() query: any): Promise<string> {
    const userId = query.userId;
    const token = query.token;

    return this.userService.confirmEmail(userId, token);
  }

  @Post('admin')
  async addAdmin(@Body() newAdminDto: NewAdminDto): Promise<UserDto> {
    return (await this.userService.addAdmin(newAdminDto, true)) as UserDto;
  }

  @Put('resetpassword')
  async resetPassword(@Body() emailDto: EmailDto): Promise<string> {
    return this.userService.resetPassword(emailDto.email);
  }

  @Put('setnewpassword')
  async setNewPassword(
    @Query() query: any,
    @Body() passwordDto: PasswordDto,
  ): Promise<string> {
    const userId = query.userId;
    const token = query.token;

    return this.userService.setNewPassword(userId, token, passwordDto.password);
  }
}
