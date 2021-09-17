
import 'react-native'; import React from 'react';
import {render} from '@testing-library/react-native';
import Header from '../components/Header';

test('renders correctly', () => {
  expect(render(<Header />)).toBeTruthy()
});
