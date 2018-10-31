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
`buildRouteTree({ Object })` - a function that accepts the object of describing your routes tree and return an object with route keys.

`getRoutePath('' | { string, boolean })` - a function that returns a structured route, may take params and insert it like .../:params/...

`getRedirectPath('' | { string })` - a function that structures the route and redirects it, may take arguments such as uuid, etc. Returns an object with route keys and your arguments inside.

`getElementKey()` - return a last part of your recourse from routes tree object.
## Usage
### Create routes tree object
```typescript
import buildRouteTree, { getParam } from 'shared/helpers/buildRouteTree';

const rawTree = {
  preview: null,
  home: {
    loans: {
      uuid: getParam(null), // If you need to pass params at route
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