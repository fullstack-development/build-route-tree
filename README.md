# build-route-tree
This library helps build a typed route tree

## Motivation
This library allows you to create typed route trees with syntax highlighting. This avoids many errors due to the use of strings in paths. Routes become typed and encapsulated so autocompletions appear for them in IDEs.
### How it looks like without a library
```typescript
<Route path={`${ROUTES_PREFIX}/user/${uuid}/security/2fa`} component={Layout} />
```
Here you need to keep in mind what routes to use or to look at it in another piece of code. You can also make syntax errors when writing this line of code. This library will help you avoid these things. Go to [usage](#usage) to see an example of our solution
## Installation
```sh
npm install build-route-tree --save
```
```sh
yarn add build-route-tree
```
## API
`buildRouteTree({ Object })` - a function that accepts the object of describing your routes tree and returns an object with route keys. Builded route tree looks like:
<details>
  <summary>
    tree
  </summary>

```typescript
{
  preview: {
    getRoutePath: Function,
    getRedirectPath: Function,
    getElementKey: Function,
  },
  home: {
    loans: {
      uuid: Object,
      getRoutePath: Function,
      getRedirectPath: Function,
      getElementKey: Function,
    },
    orders: {
      opened: Object,
      closed: Object,
      getRoutePath: Function,
      getRedirectPath: Function,
      getElementKey: Function,
    },
    user: {
      uuid: {
        balances: {
          getRoutePath: Function,
          getRedirectPath: Function,
          getElementKey: Function,
        },
        security: {
          2fa: {
            getRoutePath: Function,
            getRedirectPath: Function,
            getElementKey: Function,
          },
          sms: {
            getRoutePath: Function,
            getRedirectPath: Function,
            getElementKey: Function,
          },
          getRoutePath: Function,
          getRedirectPath: Function,
          getElementKey: Function,
        },
        getRoutePath: Function,
        getRedirectPath: Function,
        getElementKey: Function,
      },
      getRoutePath: Function,
      getRedirectPath: Function,
      getElementKey: Function,
    },
    getRoutePath: Function,
    getRedirectPath: Function,
    getElementKey: Function,
  }
}
```
</details>
the constructed object of the route tree has three methods for each route

1. `getRoutePath()` - a function that returns a string structured from your properties of the `rawTree` object. If in `rawTree` the value of the property is a function `getParam`, then `getRoutePath` will return the dynamic path for the route. [Example](###pass-created-resource-into-route)

2. `getRedirectPath('' | { string })` - a function that structures the path for redirect, may take arguments such as uuid, etc. Returns the structured string from the properties of the route tree, whose values is the result of `getParam`, are replaced by the values of the properties of the object passed to `getRedirectPath`. This will work on parts of the route tree that were created with `getParam`. If you have several dynamic routes in a branch, then you can declare all of them with `getParam`, pass an object to it, and then at the end of the property chain call `getRedirectPath`, passing an object, the keys of which are dynamic routes and their properties are values of these routes. [Example](###pass-params-at)

3. `getElementKey()` - return a last part of your resource from routes tree object. [Example](###pass-created-resource-into-route)

`getParam(null | Object)` - the function is used to build a tree of routes where dynamic routes are present. `getParam` is assigned to the property(route) of the route tree object, after which this route becomes dynamic. This means that this property will be replaced by the route passed to the `getRedirectPath` function. [Example](###pass-params-at)
## Usage
### Create routes tree object
```typescript
import buildRouteTree, { getParam } from 'build-route-tree';

const rawTree = {
  preview: null,              // null in this tree is a point, which means
  home: {                     // that after it there will be no other routes in this branch
    loans: {
      uuid: getParam(null),   // If you need to pass params at route
    },
    orders: {
      opened: null,
      closed: null,
    },
    user: {
      uuid: getParam({        // You can pass an object to a function
        balances: null,       // to continue the route tree after passing parameters
        security: getParam({
          2fa: null,
          sms: null,
        }),
      }),
    }
  },
};

export const routes = buildRouteTree(rawTree);
```
### Pass created resource into route
```jsx
import { routes } from './constants';

...

<Route
  key={routes.home.orders.opened.getElementKey()} // returns 'opened'
  path={routes.home.orders.opened.getRoutePath()} // returns path '/home/orders/opened'
  component={<RouteComponent />}
/>
// or with dynamic path
<Route
  path={routes.home.loans.uuid.getRoutePath()} // returns path '/home/loans/:uuid'
  component={<RouteComponent />}
/>
```
### Pass params at
```typescript
import { routes } from './constants';

...

// let's say user uuid is 123
// based on this getRedirectPath will return the path '/home/loans/123'
this.props.history.push(routes.home.loans.uuid.getRedirectPath({ uuid }));
```
or you need to pass several parameters
```typescript
import { routes } from './constants';

...

// let's say user number is 123 and you need to return security by SMS
// in this case, getRedirectPath should be called at the end of the chain
// and pass the necessary arguments to the keys
// based on this getRedirectPath will return the path '/home/user/123/sms'
this.props.history.push(routes.home.user.uuid.security.getRedirectPath({ uuid: 123, security: 'sms' })));
```
