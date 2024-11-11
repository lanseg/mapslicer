// sum.test.js
import { describe, expect, test } from 'vitest'
import { getRectangleGrid, Mode, uuid4, VectorMarkupMode } from './sieve';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';

describe('ModeTest', () => {
  test('can create', () => {
    expect(new Mode()).toBeTruthy();
  });
})

describe('VectorMarkupModeTest', () => {
  test('can create', () => {
    expect(new VectorMarkupMode(new VectorSource())).toBeTruthy();
  });
})

describe('uuid4test', () => {
  test('can create', () => {
    expect(uuid4()).toBeTruthy();
  });
})

describe('GridGeneratorTest', () => {
  const extentSwissLonLat = [
    ...fromLonLat([5.9035555686685655, 47.445892444177304]),
    ...fromLonLat([10.535236361771894, 47.687255440268785])
  ];

  test('can generate', () => {
    const grid = getRectangleGrid(extentSwissLonLat, 10000 /* 10km */);
    expect(grid.length).toBe(208);
  });
})