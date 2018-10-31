# react-build-route-tree
This library helps build a typed route tree for react

## Installation
```sh
npm install @fsd/react-build-route-tree --save
```
```sh
yarn add @fsd/react-build-route-tree
```
## API
`buildRouteTree({ Object })` - a function that accepts the object of describing your routes tree.

`getRoutePath()` - a function that returns a structured route.

`getRedirectPath('' | { string })` - a function that takes an argument and adds it to a structured.
## Usage
```typescript
import { buildRouteTree } from '@fsd/react-build-route-tree';
```
### Create routes tree object
```typescript
import buildRouteTree, { getParam } from 'shared/helpers/buildRouteTree';

const rawTree = {
  preview: null,
  home: {
    loans: {
      uuid: getParam(null), // You can pass params at route
    },
    balance: {
      convert: null,
    },
  },
};

export const routes = buildRouteTree(rawTree);
```
### Pass created resource into route
```jsx
import { routes } from './constants';

...

<Route
  path={routes.auth.signIn.getRoutePath()}
  component={<RouteComponent />}
/>
```
### Pass params at 
```typescript
import { routes } from './constants';

...

this.props.history.push(routes.home.loans.uuid.getRedirectPath({ uuid }));
```