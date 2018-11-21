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
npm install @fsd/build-route-tree --save
```
```sh
yarn add @fsd/build-route-tree
```
## API
`buildRouteTree({ Object })` - a function that accepts the object of describing your routes tree and returns an object with route keys. Builded route tree looks like:
<details>
  <summary>
    tree
  </summary>

```js
{
  preview: {
    getRoutePath: [Function],
    getRedirectPath: [Function],
    getElementKey: [Function: getElementKey]
  },
  home: {
    loans: {
      uuid: [Object],
      getRoutePath: [Function],
      getRedirectPath: [Function],
      getElementKey: [Function: getElementKey]
    },
    orders: {
      opened: [Object],
      closed: [Object],
      getRoutePath: [Function],
      getRedirectPath: [Function],
      getElementKey: [Function: getElementKey]
    },
    user: {
      uuid: [Object],
      getRoutePath: [Function],
      getRedirectPath: [Function],
      getElementKey: [Function: getElementKey]
    },
    getRoutePath: [Function],
    getRedirectPath: [Function],
    getElementKey: [Function: getElementKey]
  }
}
{
  balances: {
    getRoutePath: [Function],
    getRedirectPath: [Function],
    getElementKey: [Function: getElementKey]
  },
  security: {
    '2fa': {
      getRoutePath: [Function],
      getRedirectPath: [Function],
      getElementKey: [Function: getElementKey]
    },
    sms: {
      getRoutePath: [Function],
      getRedirectPath: [Function],
      getElementKey: [Function: getElementKey]
    },
    getRoutePath: [Function],
    getRedirectPath: [Function],
    getElementKey: [Function: getElementKey]
  },
  getRoutePath: [Function],
  getRedirectPath: [Function],
  getElementKey: [Function: getElementKey]
}
```
</details>
the constructed object of the route tree has three methods for each route

1. `getRoutePath('' | { string, boolean })` - a function that returns a structured route, may take params and insert it like `.../:params...`

2. `getRedirectPath('' | { string })` - a function that structures the route and redirects it, may take arguments such as uuid, etc. Returns the path(`string`) structured from the properties of the route tree, whose values is the result of `getParam`, are replaced by the values of the properties of the object passed to `getRedirectPath`. This will work on parts of the route tree that were created with `getParam`. If you have several dynamic routes in a branch, then you can declare all of them with `getParam`, pass an object to it, and then at the end of the property chain call `getRedirectPath`, passing an object, the keys of which are dynamic routes and their properties are values of these routes.

3. `getElementKey()` - return a last part of your resource from routes tree object.

`getParam(null | Object)` - returns the continuation of building the route tree after the parameter if the object is passed. The `getParam` replaces the property to which it is assigned with the parameter passed to it with `getRedirectPath`. If an object with routes is passed to the `getParam`, the property will still be replaced by the parameter passed to it with `getRedirectPath`, but the value of this property will be the routes passed to the `getParam`.
## Usage
### Create routes tree object
```typescript
import buildRouteTree, { getParam } from '@fsd/buildRouteTree';

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
  path={routes.home.orders.opened.getRoutePath()} // returns path /home/orders/opened
  component={<RouteComponent />}
/>
```
### Pass params at 
```typescript
import { routes } from './constants';

...

// let's say user uuid is 123
// based on this getRedirectPath will return the path /home/loans/123
this.props.history.push(routes.home.loans.uuid.getRedirectPath({ uuid }));
```
or you need to pass several parameters
```typescript
import { routes } from './constants';

...

// let's say user number is 123 and you need to return security by SMS
// in this case, getRedirectPath should be called at the end of the chain
// and pass the necessary arguments to the keys
// based on this getRedirectPath will return the path /home/user/123/sms
this.props.history.push(routes.home.user.uuid.security.getRedirectPath({ uuid: 123, security: 'sms' })));
```
### Get last resource
```typescript
import { routes } from './constants';

...

const resource = routes.home.orders.opened.getElementKey(); // returns 'opened'
```