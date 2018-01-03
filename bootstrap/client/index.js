import Container from 'framework/IoC/Container';
import Registrar from 'framework/IoC/Registrar';

import ConfigProvider from 'framework/Providers/ConfigProvider';
import ClientLoggerProvider from 'framework/Providers/ClientLoggerProvider';
import EnvProvider from 'framework/Providers/EnvProvider';
import LangProvider from 'framework/Providers/LangProvider';
import ModuleCollectionProvider from 'framework/Providers/ModuleCollectionProvider';
import ModuleProvider from 'framework/Providers/ModuleProvider';
import RouterProvider from 'framework/Providers/RouterProvider';
import StoreCollectionProvider from 'framework/Providers/StoreCollectionProvider';
import StoreProvider from 'framework/Providers/StoreProvider';

/**
 * Start client code.
 *
 * We need to initialize Inversion of Control Container and register providers before loading code.
 */
(async function start() {
    try {
        global.Container = new Container();

        await new Registrar(global.Container)
            .register([
                // Common Providers
                ConfigProvider,
                EnvProvider,
                LangProvider,
                ModuleCollectionProvider,
                ModuleProvider,
                RouterProvider,
                StoreCollectionProvider,
                StoreProvider,

                // Client Providers
                ClientLoggerProvider
            ]);

        const { default: init } = await import(/* webpackMode: "eager" */ 'bootstrap/client/init');

        await init();
    } catch (error) {
        console.error(error);
    }
})();
