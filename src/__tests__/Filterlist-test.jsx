import React from 'react';
import { shallow } from 'enzyme';

import Filterlist, { methodsForChild } from '../Filterlist';

const TestComponent = () => null;

const defaultProps = {
  children: (props) => <TestComponent {...props} />,
};

function parseFiltersAndSort({
  filtersRaw,
  appliedFiltersRaw,
  sortRaw,
}) {
  return {
    filters: filtersRaw,
    appliedFilters: appliedFiltersRaw,
    sort: sortRaw,
  };
}

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <Filterlist
        {...defaultProps}
        {...props}
      />,
    );
  }

  setProps(...args) {
    this.wrapper.setProps(...args);
  }

  update() {
    this.wrapper.update();
  }

  instance() {
    return this.wrapper.instance();
  }

  getTestComponentNode() {
    return this.wrapper.find(TestComponent);
  }

  getListAction(actionName) {
    const testComponentNode = this.getTestComponentNode();

    const listActions = testComponentNode.prop('listActions');

    return listActions[actionName];
  }

  getListState() {
    const testComponentNode = this.getTestComponentNode();

    return testComponentNode.prop('listState');
  }

  getFilterlistInstance() {
    return this.instance().filterlist;
  }

  getFilterlistOptions() {
    return this.getFilterlistInstance().constructorArgs[0];
  }
}

function setup(props) {
  return new PageObject(props);
}

test('should provide list state to child', () => {
  const page = setup({});

  expect(page.getListState()).toEqual({
    isMockedState: true,
  });
});

methodsForChild.forEach((methodName) => {
  test(`should call "${methodName}" from rendered component`, () => {
    const page = setup({});

    const method = page.getListAction(methodName);

    method('arg1', 'arg2', 'arg3', 'arg4');

    const filterlist = page.getFilterlistInstance();

    expect(filterlist[methodName].mock.calls.length).toBe(1);
    expect(filterlist[methodName].mock.calls[0])
      .toEqual(['arg1', 'arg2', 'arg3', 'arg4']);
  });
});

test('should init with parsed filters and sort', () => {
  const page = setup({
    parseFiltersAndSort,

    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value1',
      },

      appliedFiltersRaw: {
        filter1: 'value2',
      },

      sortRaw: {
        param: 'test',
        asc: true,
      },
    },
  });

  const options = page.getFilterlistOptions();

  expect(options.filters).toEqual({
    filter1: 'value1',
  });

  expect(options.filters).toEqual({
    filter1: 'value1',
  });

  expect(options.appliedFilters).toEqual({
    filter1: 'value2',
  });

  expect(options.sort).toEqual({
    param: 'test',
    asc: true,
  });
});

test('should call shouldRecount on update', () => {
  const shouldRecount = jest.fn();

  const page = setup({
    parseFiltersAndSort,
    shouldRecount,

    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value1',
      },

      appliedFiltersRaw: {
        filter1: 'value2',
      },

      sortRaw: {
        param: 'test',
        asc: true,
      },
    },
  });

  page.setProps({
    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value3',
      },

      appliedFiltersRaw: {
        filter1: 'value4',
      },

      sortRaw: {
        param: 'test2',
        asc: false,
      },
    },
  });

  expect(shouldRecount.mock.calls.length).toBe(1);
  expect(shouldRecount.mock.calls[0][0]).toEqual({
    filtersRaw: {
      filter1: 'value3',
    },

    appliedFiltersRaw: {
      filter1: 'value4',
    },

    sortRaw: {
      param: 'test2',
      asc: false,
    },
  });
  expect(shouldRecount.mock.calls[0][1]).toEqual({
    filtersRaw: {
      filter1: 'value1',
    },

    appliedFiltersRaw: {
      filter1: 'value2',
    },

    sortRaw: {
      param: 'test',
      asc: true,
    },
  });
});

test('should not call setFiltersAndSorting if shouldRecount returns false', () => {
  const page = setup({
    parseFiltersAndSort,
    shouldRecount: () => false,

    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value1',
      },

      appliedFiltersRaw: {
        filter1: 'value2',
      },

      sortRaw: {
        param: 'test',
        asc: true,
      },
    },
  });

  page.setProps({
    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value3',
      },

      appliedFiltersRaw: {
        filter1: 'value4',
      },

      sortRaw: {
        param: 'test2',
        asc: false,
      },
    },
  });

  const filterlist = page.getFilterlistInstance();

  expect(filterlist.setFiltersAndSorting.mock.calls.length).toBe(0);
});

test('should call setFiltersAndSorting if shouldRecount returns true', () => {
  const page = setup({
    parseFiltersAndSort,
    shouldRecount: () => true,

    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value1',
      },

      appliedFiltersRaw: {
        filter1: 'value2',
      },

      sortRaw: {
        param: 'test',
        asc: true,
      },
    },
  });

  page.setProps({
    filtersAndSortData: {
      filtersRaw: {
        filter1: 'value3',
      },

      appliedFiltersRaw: {
        filter1: 'value4',
      },

      sortRaw: {
        param: 'test2',
        asc: false,
      },
    },
  });

  const filterlist = page.getFilterlistInstance();

  expect(filterlist.setFiltersAndSorting.mock.calls.length).toBe(1);
  expect(filterlist.setFiltersAndSorting.mock.calls[0][0]).toEqual({
    filters: {
      filter1: 'value3',
    },

    appliedFilters: {
      filter1: 'value4',
    },

    sort: {
      param: 'test2',
      asc: false,
    },
  });
});
