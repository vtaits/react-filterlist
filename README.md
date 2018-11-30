[![NPM](https://img.shields.io/npm/v/@vtaits/react-filterlist.svg)](https://www.npmjs.com/package/@vtaits/react-filterlist)

# @vtaits/react-filterlist

React wrapper above [@vtaits/filterlist](https://www.npmjs.com/package/@vtaits/filterlist).

## Installation

```
npm install @vtaits/filterlist @vtaits/react-filterlist --save
```

or

```
yarn add @vtaits/filterlist @vtaits/react-filterlist
```

This package requiers next polyfills:

 - Promise
 - regeneratorRuntime

Examples are [here](https://github.com/vtaits/react-filterlist/tree/master/examples).

## Simple example

```
import React from 'react';
import { Filterlist } from '@vtaits/react-filterlist';

/*
 * assuming the API returns something like this:
 *   const json = [
 *     {
 *       id: 1,
 *       brand: 'Audi',
 *       owner: 'Tom',
 *       color: 'yellow',
 *     },
 *     {
 *       id: 2,
 *       brand: 'Mercedes',
 *       owner: 'Henry',
 *       color: 'white',
 *     },
 *     {
 *       id: 3,
 *       brand: 'BMW',
 *       owner: 'Alex',
 *       color: 'black',
 *     },
 *   ]
 */

const loadItems = async () => {
  const response = await fetch('/cars');
  const cars = await response.json();

  return {
    items: cars,
    additional: {
      count: cars.length,
    },
  };
};

const List = () => (
  <Filterlist
    loadItems={loadItems}
  >
    {({
      listState: {
        additional,
        items,
        loading,
      },
    }) => (
      <div>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>brand</th>
              <th>owner</th>
              <th>color</th>
            </tr>
          </thead>

          <tbody>
            {
              items.map(({
                id,
                brand,
                owner,
                color,
              }) => (
                <tr key={ id }>
                  <td>{ id }</td>
                  <td>{ brand }</td>
                  <td>{ owner }</td>
                  <td>{ color }</td>
                </tr>
              ))
            }
          </tbody>
        </table>

        {
          additional && (
            <h4>
              Total: { additional.count }
            </h4>
          )
        }

        {
          loading && (
            <h3>Loading...</h3>
          )
        }
      </div>
    )}
  </Filterlist>
);
```
