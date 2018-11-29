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
    isRecountAsync: PropTypes.bool,

    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    parseFiltersAndSort: null,
    filtersAndSortData: null,
    shouldRecount: defaultShouldRecount,
    isRecountAsync: false,
  }

  constructor(props) {
    super(props);

    const {
      parseFiltersAndSort,
      isRecountAsync,
    } = props;

    this.syncListState = this.syncListState.bind(this);

    const shouldInitAsync = Boolean(parseFiltersAndSort) && isRecountAsync;

    if (shouldInitAsync) {
      this.initFilterlistAsync();
    } else {
      this.initFilterlist();
    }

    this.state = {
      isListInited: !shouldInitAsync,
      listState: shouldInitAsync
        ? null
        : this.filterlist.getListState(),
    };
  }

  async componentDidUpdate(prevProps) {
    const {
      parseFiltersAndSort,
      filtersAndSortData,
      shouldRecount,
    } = this.props;

    if (
      parseFiltersAndSort
      && shouldRecount(filtersAndSortData, prevProps.filtersAndSortData)
    ) {
      const parsedFiltersAndSort = await parseFiltersAndSort(filtersAndSortData);

      this.filterlist.setFiltersAndSorting(parsedFiltersAndSort);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
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

  async getFilterlistOptionsAsync() {
    const {
      parseFiltersAndSort,
      filtersAndSortData,
    } = this.props;

    const parsedFiltersAndSort = await parseFiltersAndSort(filtersAndSortData);

    return {
      ...this.props,
      ...parsedFiltersAndSort,
    };
  }

  initFilterlist() {
    const options = this.getFilterlistOptions();

    this.createFilterlist(options);
  }

  async initFilterlistAsync() {
    const options = await this.getFilterlistOptionsAsync();

    if (this.unmounted) {
      return;
    }

    this.createFilterlist(options);

    await this.setState({
      isListInited: true,
      listState: this.filterlist.getListState(),
    });
  }

  createFilterlist(options) {
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
      isListInited,
      listState,
    } = this.state;

    return children({
      isListInited,
      listState,
      listActions: this.listActions,
    });
  }
}

export default FilterlistWrapper;
