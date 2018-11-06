# build-route-tree
This library helps build a typed route tree

## Motivation
This library allows you to create typed route trees with syntax highlighting. This avoids many errors due to the use of strings in paths. Routes become typed and encapsulated so autocompletions appear for them in IDEs.
### How it looks like without a library
```typescript
<Route path={`${ROUTES_PREFIX}/user/${uuid}/security/2fa`} component={Layout} />
```
Here you need to keep in mind what routes to use or to look at it in another piece of code. You can also make syntax errors when writing this line of code. This library will help you avoid these things.
## Installation
```sh
npm install @fsd/build-route-tree --save
```
```sh
yarn add @fsd/build-route-tree
```
## API
`buildRouteTree({ Object })` - a function that accepts the object of describing your routes tree and return an object with route keys.

`getRoutePath('' | { string, boolean })` - a function that returns a structured route, may take params and insert it like .../:params/...

`getRedirectPath('' | { string })` - a function that structures the route and redirects it, may take arguments such as uuid, etc. Returns an object with route keys and your arguments inside.

`getElementKey()` - return a last part of your resource from routes tree object.

`getParam(null | Object)` - returns the continuation of building the route tree after the parameter if the object is passed.
## Usage
### Create routes tree object
```typescript
import buildRouteTree, { getParam } from '@fsd/buildRouteTree';

const rawTree = {
  preview: null,
  home: {
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