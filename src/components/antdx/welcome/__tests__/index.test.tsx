import React from 'react';

import Welcome from '../index.tsx';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';

describe('welcome', () => {
  mountTest(() => <Welcome />);
  rtlTest(() => <Welcome />);
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
