import React from 'react';

import {
    MODULE_COLLECTION_PROVIDER,
    STORE_COLLECTION_PROVIDER,
    LOGGER_PROVIDER,
    CONFIG_PROVIDER
} from 'framework/Providers/types';

import appConfig from 'config/app';
import filesConfig from 'config/files';

import modules from 'app/modules';
import * as ROUTES from 'app/routes';

/**
 * Add "app" property to React Component.
 *
 * @param {Container} iocContainer
 */
function modifyReactComponent(iocContainer) {
    React.Component.prototype.app = {
        make: iocContainer.make.bind(iocContainer)
    };
}

/**
 * @param {Container} iocContainer
 *
 * @return {Promise<void>}
 */
export async function registerApp(iocContainer) {
    modifyReactComponent(iocContainer);

    const ModuleCollection = iocContainer.make(MODULE_COLLECTION_PROVIDER);
    const StoreCollection = iocContainer.make(STORE_COLLECTION_PROVIDER);
    const Logger = iocContainer.make(LOGGER_PROVIDER, { prefix: 'bootstrap/app' });
    const Config = iocContainer.make(CONFIG_PROVIDER);

    Config.register('app', appConfig);
    Config.register('files', filesConfig);

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

/**
 * @param {Container} iocContainer
 *
 * @return {Promise<void>}
 */
export async function onRequest(iocContainer) {
    const ModuleCollection = iocContainer.make(MODULE_COLLECTION_PROVIDER);
    const StoreCollection = iocContainer.make(STORE_COLLECTION_PROVIDER);
    const Logger = iocContainer.make(LOGGER_PROVIDER, { prefix: 'bootstrap/app' });

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
