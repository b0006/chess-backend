import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthSignUpDto {
  @IsNotEmpty({
    message: 'Введите email',
  })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @MinLength(3, {
    message: 'Логин слишком короткий (мин 3 символа)',
  })
  @IsNotEmpty({
    message: 'Введите логин',
  })
  username: string;

  @MinLength(8, {
    message: 'Пароль слишком короткий (мин 8 символов)',
  })
  @IsNotEmpty({
    message: 'Введите пароль',
  })
  password: string;

  confirmPassword: string;
}
