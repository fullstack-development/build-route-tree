import { isRawRouteTree, isParamGuard, IRawRouteTree, RouteTree, IPathItem, IRoutable } from './namespace';
import makeGetPath from './makeGetPath';
import makeGetRoutePath from './makeGetRoutePath';

export { default as getParam } from './getParam';

// TODO watch for https://github.com/Microsoft/TypeScript/issues/10727 to fix any types
export default function buildRouteTree<T extends IRawRouteTree>(rawTree: T): RouteTree<T> {
  return (function loop(tree: IRawRouteTree, path: IPathItem[] = []): RouteTree<T> {
    return Object
      .entries(tree)
      .reduce<RouteTree<T>>((acc: RouteTree<T>, [key, value]) => {
        const xPath: IPathItem[] = [...path, { value: key, isParam: isParamGuard(value) }];

        const routeData: IRoutable = {
          getRoutePath: makeGetRoutePath(xPath),
          getRedirectPath: makeGetPath(xPath),
          getElementKey: () => key,
        };
        if (!isRawRouteTree(value)) {
          return { ...(acc as any), [key]: routeData };
        }
        return {
          ...(acc as any),
          [key]: {
            ...(loop(value, xPath) as any),
            ...routeData,
          },
        };
      }, {} as RouteTree<T>);
  })(rawTree);
}
