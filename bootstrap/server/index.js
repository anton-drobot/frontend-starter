import Container from 'framework/IoC/Container';
import Registrar from 'framework/IoC/Registrar';

import ConfigProvider from 'framework/Providers/ConfigProvider';
import EnvProvider from 'framework/Providers/EnvProvider';
import LangProvider from 'framework/Providers/LangProvider';
import ModuleCollectionProvider from 'framework/Providers/ModuleCollectionProvider';
import ModuleProvider from 'framework/Providers/ModuleProvider';
import RouterProvider from 'framework/Providers/RouterProvider';
import ServerLoggerProvider from 'framework/Providers/ServerLoggerProvider';
import ServerProvider from 'framework/Providers/ServerProvider';
import StoreCollectionProvider from 'framework/Providers/StoreCollectionProvider';
import StoreProvider from 'framework/Providers/StoreProvider';
import URLProvider from 'framework/Providers/URLProvider';

/**
 * Start server instance.
 *
 * We need to initialize Inversion of Control Container and register providers before loading code.
 */
export default async function start() {
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
                URLProvider,

                // Server Providers
                ServerLoggerProvider,
                ServerProvider
            ]);

        const { default: init } = await import('bootstrap/server/init');

        await init();
    } catch (error) {
        console.error(error);
    }
}
