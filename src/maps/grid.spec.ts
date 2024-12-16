import { describe, expect, test } from 'vitest'

import { fromExtent } from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';

import { getRectangleGrid } from './grid';

describe('GridGeneratorTest', () => {
  const extentSwissLonLat = [
    ...fromLonLat([5.9035555686685655, 47.445892444177304]),
    ...fromLonLat([10.535236361771894, 47.687255440268785])
  ];
  const extentZeroZero = [
    ...fromLonLat([-1, -1]),
    ...fromLonLat([1, 1]),
  ];

  describe.each([
    { extent: extentSwissLonLat, size: 10000, want: 208 },
    { extent: extentSwissLonLat, size: 100000, want: 6 },
    { extent: extentZeroZero, size: 10000, want: 529 },
  ])('grid for various locations', ({ extent, size, want }) => {

    test('can generate', () => {
      const grid = getRectangleGrid(fromExtent(extent), size /* 10km */);
      expect(grid.length).toBe(want);
    });

    test('can generate rotated pi/2', () => {
      for (let i = 0; i <= 4; i++) {
        const grid = getRectangleGrid(fromExtent(extent), size /* 10km */, i * Math.PI / 2);
        expect(grid.length).toBe(want);
      }
    });
  });

  test('can generate rotated', () => {
    const grid = getRectangleGrid(fromExtent(extentSwissLonLat), 10000  /* 10km */, Math.PI / 6);
    expect(grid.length).toBe(281);
  });

})