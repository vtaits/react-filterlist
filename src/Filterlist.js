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

export function defaultShouldRecount(data1, data2) {
  return data1 === data2;
}

class FilterlistWrapper extends Component {
  static propTypes = {
    parseFiltersAndSort: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    filtersAndSortData: PropTypes.any,
    shouldRecount: PropTypes.func,

    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    parseFiltersAndSort: null,
    filtersAndSortData: null,
    shouldRecount: defaultShouldRecount,
  }

  constructor(props) {
    super(props);

    this.syncListState = this.syncListState.bind(this);

    this.initFilterlist();

    this.state = {
      listState: this.filterlist.getListState(),
    };
  }

  componentDidUpdate(prevProps) {
    const {
      parseFiltersAndSort,
      filtersAndSortData,
      shouldRecount,
    } = this.props;

    if (
      parseFiltersAndSort
      && shouldRecount(filtersAndSortData, prevProps.filtersAndSortData)
    ) {
      const parsedFiltersAndSort = parseFiltersAndSort(filtersAndSortData);

      this.filterlist.setFiltersAndSorting(parsedFiltersAndSort);
    }
  }

  componentWillUnmount() {
    this.filterlist.removeAllListeners(eventTypes.changeListState);
  }

  getFilterlistOptions() {
    const {
      parseFiltersAndSort,
      filtersAndSortData,
    } = this.props;

    if (parseFiltersAndSort) {
      const parsedFiltersAndSort = parseFiltersAndSort(filtersAndSortData);

      return {
        ...this.props,
        ...parsedFiltersAndSort,
      };
    }

    return this.props;
  }

  initFilterlist() {
    const options = this.getFilterlistOptions();

    const filterlist = new Filterlist(options);

    filterlist.addListener(eventTypes.changeListState, this.syncListState);

    const listActions = methodsForChild.reduce((res, methodName) => {
      res[methodName] = filterlist[methodName].bind(filterlist);
      return res;
    }, {});

    this.listActions = listActions;

    this.filterlist = filterlist;
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
