import React from 'react';
import { shallow } from 'enzyme';

import Filterlist, { methodsForChild } from '../Filterlist';

const TestComponent = () => null;

const defaultProps = {
  children: (props) => <TestComponent {...props} />,
};

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <Filterlist
        {...defaultProps}
        {...props}
      />,
    );
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

    const {
      filterlist,
    } = page.instance();

    expect(filterlist[methodName].mock.calls.length).toBe(1);
    expect(filterlist[methodName].mock.calls[0])
      .toEqual(['arg1', 'arg2', 'arg3', 'arg4']);
  });
});
