import Filterlist from '../Filterlist';
import {
  createListStatePropTypes,
  createListStateShape,
  listActionsPropTypes,
  listActionsShape,
} from '../propTypes';

import * as lib from '../index';

test('should export needed modules', () => {
  expect(lib.Filterlist).toBe(Filterlist);
  expect(lib.createListStatePropTypes).toBe(createListStatePropTypes);
  expect(lib.createListStateShape).toBe(createListStateShape);
  expect(lib.listActionsPropTypes).toBe(listActionsPropTypes);
  expect(lib.listActionsShape).toBe(listActionsShape);
});
