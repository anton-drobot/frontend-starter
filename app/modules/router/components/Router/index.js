import React from 'react';
import { observer, inject } from 'mobx-react';

export default inject('router')(observer(function Router({ router }) {
    const resolvedRoute = router.route;

    if (!resolvedRoute.handler) {
        return null;
    }

    const Component = resolvedRoute.handler;

    return <Component />;
}));
