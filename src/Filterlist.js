import { Component } from 'react';
import PropTypes from 'prop-types';

import Filterlist, { eventTypes } from '@vtaits/filterlist';

export const methodsForChild = [
  'loadItems',
  'setFilterValue',
  'applyFilter',
  'setAndApplyFilter',
  'resetFilter',
  'setFiltersValues',
  'applyFilters',
  'setAndApplyFilters',
  'resetFilters',
  'resetAllFilters',
  'setSorting',
  'resetSorting',
  'insertItem',
  'deleteItem',
  'updateItem',
];

class FilterlistWrapper extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.syncListState = this.syncListState.bind(this);

    const filterlist = new Filterlist(props);

    filterlist.addListener(eventTypes.changeListState, this.syncListState);

    this.filterlist = filterlist;

    const listActions = methodsForChild.reduce((res, methodName) => {
      res[methodName] = filterlist[methodName].bind(filterlist);
      return res;
    }, {});

    this.listActions = listActions;

    this.state = {
      listState: filterlist.getListState(),
    };
  }

  componentWillUnmount() {
    this.filterlist.removeAllListeners(eventTypes.changeListState);
  }

  syncListState() {
    this.setState({
      listState: this.filterlist.getListState(),
    });
  }

  render() {
    const {
      children,
    } = this.props;

    const {
      listState,
    } = this.state;

    return children({
      listState,
      listActions: this.listActions,
    });
  }
}

export default FilterlistWrapper;
