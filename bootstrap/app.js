import ConfigProvider from 'framework/Providers/ConfigProvider';
import EnvProvider from 'framework/Providers/EnvProvider';
import LangProvider from 'framework/Providers/LangProvider';
import ModuleCollectionProvider from 'framework/Providers/ModuleCollectionProvider';
import ModuleProvider from 'framework/Providers/ModuleProvider';
import RouterProvider from 'framework/Providers/RouterProvider';
import StoreCollectionProvider from 'framework/Providers/StoreCollectionProvider';
import StoreProvider from 'framework/Providers/StoreProvider';

import {
    MODULE_COLLECTION_PROVIDER,
    STORE_COLLECTION_PROVIDER,
    LOGGER_PROVIDER,
    CONFIG_PROVIDER
} from 'framework/Providers/types';

import appConfig from 'config/app';

export const providers = [
    ConfigProvider,
    EnvProvider,
    LangProvider,
    ModuleCollectionProvider,
    ModuleProvider,
    RouterProvider,
    StoreCollectionProvider,
    StoreProvider
];

import * as ROUTES from 'app/routes';

export async function registerApp() {
    const ModuleCollection = global.Container.make(MODULE_COLLECTION_PROVIDER);
    const StoreCollection = global.Container.make(STORE_COLLECTION_PROVIDER);
    const Logger = global.Container.make(LOGGER_PROVIDER, { prefix: 'bootstrap/app' });
    const Config = global.Container.make(CONFIG_PROVIDER);

    Config.register('app', appConfig);
    const { default: modules } = await import('app/modules');

    try {
        /**
         * Register modules when starting server.
         */
        await Promise
            .all(
                modules.map(async (Module) => {
                    const instance = new Module();

                    /**
                     * Register module.
                     */
                    ModuleCollection.set(instance.constructor.name, instance);
                    await instance.register();

                    /**
                     * Register stores.
                     */
                    const stores = await instance.registerStores();
                    Object.keys(stores).forEach((identifier) => {
                        StoreCollection.register(identifier, stores[identifier]);
                    });
                })
            );
    } catch (error) {
        Logger.error(error);
    }
}

export async function onRequest() {
    const ModuleCollection = global.Container.make(MODULE_COLLECTION_PROVIDER);
    const StoreCollection = global.Container.make(STORE_COLLECTION_PROVIDER);
    const Logger = global.Container.make(LOGGER_PROVIDER, { prefix: 'bootstrap/app' });

    /**
     * Boot modules on each request.
     */
    await Promise
        .all(ModuleCollection.toArray().map(async (module) => {
            await module.boot();
        }))
        .catch((error) => {
            Logger.error(error);
        });

    StoreCollection.createStore();
    StoreCollection.deserializeFromInitialState();

    const store = StoreCollection.store();

    /**
     * Register routes.
     */
    Object.values(ROUTES).forEach((route) => {
        store.router.setRoute(route);
    });
}
