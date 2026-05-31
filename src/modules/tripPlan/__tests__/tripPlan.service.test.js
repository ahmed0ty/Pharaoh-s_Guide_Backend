import { jest } from '@jest/globals';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockTripPlan = {
  create        : jest.fn(),
  find          : jest.fn(),
  findOne       : jest.fn(),
  findOneAndDelete: jest.fn(),
};

await jest.unstable_mockModule('DB/models/tripPlan.model.js', () => ({
  default: mockTripPlan,
}));

await jest.unstable_mockModule('modules/ai/ai.service.js', () => ({
  generateTripPlanService: jest.fn().mockResolvedValue({
    title      : 'Amazing Egypt Trip',
    overview   : 'A wonderful journey',
    days       : [{ day: 1, places: [] }],
    totalBudget: 500,
    bestSeason : 'Winter',
  }),
}));

await jest.unstable_mockModule('utils/cache.util.js', () => ({
  getCache          : jest.fn().mockResolvedValue(null),
  setCache          : jest.fn().mockResolvedValue(true),
  clearCacheByPrefix: jest.fn().mockResolvedValue(true),
}));

// ── Imports ────────────────────────────────────────────────────────────────
const { default: TripPlan } = await import('DB/models/tripPlan.model.js');
const {
  createTripPlanService,
  getMyTripPlansService,
  getTripPlanByIdService,
  deleteTripPlanService,
} = await import('modules/tripPlan/tripPlan.service.js');

beforeEach(() => jest.clearAllMocks());

// ══════════════════════════════════════════════════════════════════════════
// 1. CREATE TRIP PLAN
// ══════════════════════════════════════════════════════════════════════════
describe('createTripPlanService', () => {

  test('✅ ينشئ خطة رحلة جديدة', async () => {
    TripPlan.create.mockResolvedValue({
      _id    : '123',
      title  : 'Amazing Egypt Trip',
      userId : 'user123',
    });

    const result = await createTripPlanService('user123', {
      days     : 3,
      interests: ['history'],
      budget   : 'medium',
      language : 'en',
    });

    expect(result.title).toBe('Amazing Egypt Trip');
    expect(TripPlan.create).toHaveBeenCalled();
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 2. GET MY TRIP PLANS
// ══════════════════════════════════════════════════════════════════════════
describe('getMyTripPlansService', () => {

  test('✅ يرجع قائمة خطط الرحلات', async () => {
    const plans = [{ _id: '1', title: 'Trip 1' }, { _id: '2', title: 'Trip 2' }];

    TripPlan.find.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(plans),
    });

    const result = await getMyTripPlansService('user123');
    expect(result).toHaveLength(2);
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 3. GET TRIP PLAN BY ID
// ══════════════════════════════════════════════════════════════════════════
describe('getTripPlanByIdService', () => {

  test('✅ يرجع الخطة لو موجودة', async () => {
    TripPlan.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: '123', title: 'Trip 1' }),
    });

    const result = await getTripPlanByIdService('123', 'user123');
    expect(result.title).toBe('Trip 1');
  });

  test('❌ يرفض لو الخطة مش موجودة', async () => {
    TripPlan.findOne.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(getTripPlanByIdService('invalid', 'user123'))
      .rejects.toThrow('Trip plan not found');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 4. DELETE TRIP PLAN
// ══════════════════════════════════════════════════════════════════════════
describe('deleteTripPlanService', () => {

  test('✅ يحذف الخطة بنجاح', async () => {
    TripPlan.findOneAndDelete.mockResolvedValue({ _id: '123', title: 'Trip 1' });

    const result = await deleteTripPlanService('123', 'user123');
    expect(result._id).toBe('123');
  });

  test('❌ يرفض لو الخطة مش موجودة', async () => {
    TripPlan.findOneAndDelete.mockResolvedValue(null);

    await expect(deleteTripPlanService('invalid', 'user123'))
      .rejects.toThrow('Trip plan not found');
  });

});