import { jest } from '@jest/globals';

beforeEach(() => {
  jest.clearAllMocks();
});
// ── Mocks ──────────────────────────────────────────────────────────────────
const mockPlace = {
  find        : jest.fn(),
  findById    : jest.fn(),
  countDocuments: jest.fn(),
  create      : jest.fn(),
  insertMany  : jest.fn(),
};

await jest.unstable_mockModule('DB/models/places.model.js', () => ({
  default: mockPlace,
}));

await jest.unstable_mockModule('utils/cache.util.js', () => ({
  getCache          : jest.fn().mockResolvedValue(null),
  setCache          : jest.fn().mockResolvedValue(true),
  clearCacheByPrefix: jest.fn().mockResolvedValue(true),
}));

// ── Imports ────────────────────────────────────────────────────────────────
const { default: Place } = await import('DB/models/places.model.js');
const {
  getAllPlacesService,
  getPlaceByIdService,
  getFeaturedPlacesService,
  createPlaceService,
  seedPlacesService,
} = await import('modules/places/places.service.js');

// ══════════════════════════════════════════════════════════════════════════
// 1. GET ALL PLACES
// ══════════════════════════════════════════════════════════════════════════
describe('getAllPlacesService', () => {

  test('✅ يرجع قائمة الأماكن مع pagination', async () => {
    const mockPlaces = [{ name: { en: 'Pyramids' } }];

    Place.find.mockReturnValue({
      sort : jest.fn().mockReturnThis(),
      skip : jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean : jest.fn().mockResolvedValue(mockPlaces),
    });
    Place.countDocuments.mockResolvedValue(1);

    const result = await getAllPlacesService({
      page: 1, limit: 10, category: 'All', search: ''
    });

    expect(result.places).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  test('✅ يفلتر بالـ category', async () => {
    Place.find.mockReturnValue({
      sort : jest.fn().mockReturnThis(),
      skip : jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean : jest.fn().mockResolvedValue([]),
    });
    Place.countDocuments.mockResolvedValue(0);

    const result = await getAllPlacesService({
      page: 1, limit: 10, category: 'Pyramids', search: ''
    });

    expect(Place.find).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'Pyramids' })
    );
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 2. GET PLACE BY ID
// ══════════════════════════════════════════════════════════════════════════
describe('getPlaceByIdService', () => {

  test('✅ يرجع المكان لو موجود', async () => {
    Place.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue({ _id: '123', name: { en: 'Pyramids' } }),
    });

    const result = await getPlaceByIdService('123');
    expect(result.name.en).toBe('Pyramids');
  });

  test('❌ يرفض لو المكان مش موجود', async () => {
    Place.findById.mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    await expect(getPlaceByIdService('invalid_id'))
      .rejects.toThrow('Place not found');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 3. GET FEATURED PLACES
// ══════════════════════════════════════════════════════════════════════════
describe('getFeaturedPlacesService', () => {

  test('✅ يرجع الأماكن المميزة', async () => {
    const featured = [
      { name: { en: 'Pyramids' }, isFeatured: true },
      { name: { en: 'Sphinx'   }, isFeatured: true },
    ];

    Place.find.mockReturnValue({
      sort : jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean : jest.fn().mockResolvedValue(featured),
    });

    const result = await getFeaturedPlacesService();
    expect(result).toHaveLength(2);
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 4. CREATE PLACE
// ══════════════════════════════════════════════════════════════════════════
describe('createPlaceService', () => {

  test('✅ ينشئ مكان جديد', async () => {
    const newPlace = { _id: '123', name: { en: 'New Place' } };
    Place.create.mockResolvedValue(newPlace);

    const result = await createPlaceService({ name: { en: 'New Place' } });
    expect(result.name.en).toBe('New Place');
  });

});

// ══════════════════════════════════════════════════════════════════════════
// 5. SEED PLACES
// ══════════════════════════════════════════════════════════════════════════
describe('seedPlacesService', () => {

  test('✅ يعمل seed لو مفيش أماكن', async () => {
    Place.countDocuments.mockResolvedValue(0);
    Place.insertMany.mockResolvedValue([]);

    const result = await seedPlacesService();
    expect(result.message).toBe('Places seeded successfully');
    expect(Place.insertMany).toHaveBeenCalled();
  });

  test('✅ يتجاهل الـ seed لو في أماكن موجودة', async () => {
    Place.countDocuments.mockResolvedValue(10);

    const result = await seedPlacesService();
    expect(result.message).toBe('Places already seeded');
    expect(Place.insertMany).not.toHaveBeenCalled();
  });

});