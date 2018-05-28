import Container from 'framework/IoC/Container';
import Registrar from 'framework/IoC/Registrar';

import ConfigProvider from 'framework/Providers/ConfigProvider';
import EnvClientProvider from 'framework/Providers/EnvClientProvider';
import LangProvider from 'framework/Providers/LangProvider';
import LoggerClientProvider from 'framework/Providers/LoggerClientProvider';
import ModuleCollectionProvider from 'framework/Providers/ModuleCollectionProvider';
import ModuleProvider from 'framework/Providers/ModuleProvider';
import RouterProvider from 'framework/Providers/RouterProvider';
import StoreCollectionProvider from 'framework/Providers/StoreCollectionProvider';
import StoreProvider from 'framework/Providers/StoreProvider';
import URLProvider from 'framework/Providers/URLProvider';

/**
 * Start client code.
 *
 * We need to initialize Inversion of Control Container and register providers before loading code.
 */
(async function start() {
    try {
        const iocContainer = new Container();
        global.Container = iocContainer;

        await new Registrar(iocContainer)
            .register([
                // Common Providers
                ConfigProvider,
                LangProvider,
                ModuleCollectionProvider,
                ModuleProvider,
                RouterProvider,
                StoreCollectionProvider,
                StoreProvider,
                URLProvider,

                // Client Providers
                EnvClientProvider,
                LoggerClientProvider
            ]);

        const { default: init } = await import(/* webpackMode: "eager" */ 'bootstrap/client/init');

        await init(iocContainer);
    } catch (error) {
        console.error(error);
    }
})();
