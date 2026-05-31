import { jest } from '@jest/globals';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockUser = {
  findById         : jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

await jest.unstable_mockModule('DB/models/user.model.js', () => ({
  default: mockUser,
}));

await jest.unstable_mockModule('utils/cache.util.js', () => ({
  getCache          : jest.fn().mockResolvedValue(null),
  setCache          : jest.fn().mockResolvedValue(true),
  clearCacheByPrefix: jest.fn().mockResolvedValue(true),
}));

// ── Imports ────────────────────────────────────────────────────────────────
const { default: User } = await import('DB/models/user.model.js');
const {
  getMyProfileService,
  updateMyProfileService,
  updateProfileImageService,
} = await import('modules/user/user.service.js');

beforeEach(() => jest.clearAllMocks());

// ══════════════════════════════════════════════════════════════════════════
// 1. GET MY PROFILE
// ══════════════════════════════════════════════════════════════════════════
describe('getMyProfileService', () => {

  test('✅ يرجع بيانات اليوزر', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean  : jest.fn().mockResolvedValue({ _id: '123', name: 'Ahmed' }),
    });

    const result = await getMyProfileService('123');
    expect(result.name).toBe('Ahmed');
  });

  test('❌ يرفض لو اليوزر مش موجود', async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      lean  : jest.fn().mockResolvedValue(null),
    });

    await expect(getMyProfileService('invalid'))
      .rejects.toThrow('User not found');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 2. UPDATE MY PROFILE
// ══════════════════════════════════════════════════════════════════════════
describe('updateMyProfileService', () => {

  test('✅ يحدث بيانات اليوزر', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: '123', name: 'New Name' }),
    });

    const result = await updateMyProfileService('123', { name: 'New Name' });
    expect(result.name).toBe('New Name');
  });

  test('❌ يرفض لو اليوزر مش موجود', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(updateMyProfileService('invalid', { name: 'Test' }))
      .rejects.toThrow('User not found');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 3. UPDATE PROFILE IMAGE
// ══════════════════════════════════════════════════════════════════════════
describe('updateProfileImageService', () => {

  test('✅ يحدث صورة البروفايل', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id         : '123',
        profileImage: 'https://image.url/photo.jpg',
      }),
    });

    const result = await updateProfileImageService('123', 'https://image.url/photo.jpg');
    expect(result.profileImage).toBe('https://image.url/photo.jpg');
  });

  test('❌ يرفض لو اليوزر مش موجود', async () => {
    User.findByIdAndUpdate.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await expect(updateProfileImageService('invalid', 'https://image.url/photo.jpg'))
      .rejects.toThrow('User not found');
  });

});