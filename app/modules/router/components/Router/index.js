import React from 'react';
import { observer, inject } from 'mobx-react';

export default inject('router')(observer(function Router({ router }) {
    const Component = router.component;

    if (!Component) {
        return null;
    }

    return <Component />;
}));
