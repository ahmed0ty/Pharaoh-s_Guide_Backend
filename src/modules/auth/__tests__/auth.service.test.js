// src/modules/auth/__tests__/auth.service.test.js

import { jest } from '@jest/globals';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockUser = {
  findOne  : jest.fn(),
  findById : jest.fn(),
  create   : jest.fn(),
  updateOne: jest.fn(),
};

await jest.unstable_mockModule('DB/models/user.model.js', () => ({
  default: mockUser,
}));

await jest.unstable_mockModule('utils/jwt.util.js', () => ({
  generateToken: jest.fn().mockReturnValue('mocked_token'),
}));

await jest.unstable_mockModule('utils/crypto.util.js', () => ({
  generateOTP: jest.fn().mockReturnValue('123456'),
  hashToken  : jest.fn().mockReturnValue('hashedOTP'),
}));

// bcryptjs بيفضل زي ما هو
await jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash   : jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn(),
  },
}));

// الـ imports
const { default: User }   = await import('DB/models/user.model.js');
const { default: bcrypt } = await import('bcryptjs');
const {
  registerService,
  confirmEmailService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} = await import('modules/auth/auth.service.js');

// ══════════════════════════════════════════════════════════════════════════
// 1. REGISTER
// ══════════════════════════════════════════════════════════════════════════
describe('registerService', () => {

  test('✅ ينجح ويرجع بيانات اليوزر', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id  : 'user123',
      email: 'test@test.com',
      name : 'Ahmed',
    });

    const result = await registerService({
      name    : 'Ahmed',
      email   : 'test@test.com',
      password: '123456',
    });

    expect(result.email).toBe('test@test.com');
    expect(result.otp).toBe('123456');
  });

  test('❌ يرفض لو الإيميل موجود', async () => {
    User.findOne.mockResolvedValue({ email: 'test@test.com' });

    await expect(
      registerService({ name: 'Ahmed', email: 'test@test.com', password: '123456' })
    ).rejects.toThrow('Email already exists');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 2. CONFIRM EMAIL
// ══════════════════════════════════════════════════════════════════════════
describe('confirmEmailService', () => {

  test('✅ يأكد الإيميل بنجاح', async () => {
    const mockUserObj = {
      email              : 'test@test.com',
      isConfirmed        : false,
      confirmEmailOTP    : 'hashedOTP',
      confirmEmailExpires: Date.now() + 10 * 60 * 1000,
      save               : jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUserObj);

    const result = await confirmEmailService({ email: 'test@test.com', otp: '123456' });

    expect(result.isConfirmed).toBe(true);
    expect(mockUserObj.save).toHaveBeenCalled();
  });

  test('❌ يرفض لو OTP منتهي', async () => {
    User.findOne.mockResolvedValue({
      isConfirmed        : false,
      confirmEmailExpires: Date.now() - 1000,
      save               : jest.fn(),
    });

    await expect(
      confirmEmailService({ email: 'test@test.com', otp: '123456' })
    ).rejects.toThrow('OTP expired');
  });

  test('❌ يرفض لو OTP غلط', async () => {
    User.findOne.mockResolvedValue({
      isConfirmed        : false,
      confirmEmailOTP    : 'differentHashedOTP',
      confirmEmailExpires: Date.now() + 10 * 60 * 1000,
      save               : jest.fn(),
    });

    await expect(
      confirmEmailService({ email: 'test@test.com', otp: 'wrongOTP' })
    ).rejects.toThrow('Invalid OTP');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 3. LOGIN
// ══════════════════════════════════════════════════════════════════════════
describe('loginService', () => {

  test('✅ يرجع token لو البيانات صح', async () => {
    const mockUserObj = {
      _id          : 'user123',
      name         : 'Ahmed',
      email        : 'test@test.com',
      profileImage : '',
      isConfirmed  : true,
      refreshTokens: [],
      save         : jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUserObj);
    bcrypt.compare.mockResolvedValue(true);

    const result = await loginService({ email: 'test@test.com', password: '123456' });

    expect(result.accessToken).toBe('mocked_token');
    expect(result.user.email).toBe('test@test.com');
  });

  test('❌ يرفض لو الإيميل مش موجود', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      loginService({ email: 'notfound@test.com', password: '123456' })
    ).rejects.toThrow('Invalid email or password');
  });

  test('❌ يرفض لو الإيميل مش متأكد', async () => {
    User.findOne.mockResolvedValue({ isConfirmed: false });

    await expect(
      loginService({ email: 'test@test.com', password: '123456' })
    ).rejects.toThrow('Please confirm your email first');
  });

  test('❌ يرفض لو الباسورد غلط', async () => {
    User.findOne.mockResolvedValue({ isConfirmed: true });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginService({ email: 'test@test.com', password: 'wrongpass' })
    ).rejects.toThrow('Invalid email or password');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 4. FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════════════════
describe('forgotPasswordService', () => {

  test('✅ يبعت OTP بنجاح', async () => {
    const mockUserObj = {
      email: 'test@test.com',
      save : jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUserObj);

    const result = await forgotPasswordService({ email: 'test@test.com' });

    expect(result.email).toBe('test@test.com');
    expect(mockUserObj.save).toHaveBeenCalled();
  });

  test('❌ يرفض لو اليوزر مش موجود', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      forgotPasswordService({ email: 'notfound@test.com' })
    ).rejects.toThrow('User not found');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 5. RESET PASSWORD
// ══════════════════════════════════════════════════════════════════════════
describe('resetPasswordService', () => {

  test('✅ يغير الباسورد بنجاح', async () => {
    const mockUserObj = {
      email               : 'test@test.com',
      resetPasswordOTP    : 'hashedOTP',
      resetPasswordExpires: Date.now() + 10 * 60 * 1000,
      save                : jest.fn(),
    };
    User.findOne.mockResolvedValue(mockUserObj);

    const result = await resetPasswordService({
      email      : 'test@test.com',
      otp        : '123456',
      newPassword: 'newpass123',
    });

    expect(result.passwordReset).toBe(true);
    expect(mockUserObj.save).toHaveBeenCalled();
  });

  test('❌ يرفض لو OTP منتهي', async () => {
    User.findOne.mockResolvedValue({
      resetPasswordExpires: Date.now() - 1000,
    });

    await expect(
      resetPasswordService({ email: 'test@test.com', otp: '123456', newPassword: 'new' })
    ).rejects.toThrow('OTP expired');
  });

});