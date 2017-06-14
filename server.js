import cluster from 'cluster';
import os from 'os';
import CatLog from 'cat-log';
import registerServer from 'bootstrap/server';

const log = new CatLog('server');
const numCPUs = os.cpus().length;

if (process.env.NODE_ENV === 'production') {
    if (cluster.isMaster) {
        log.info(`Master ${process.pid} is running`);

        // Fork workers.
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            log.info(`Worker ${worker.process.pid} died`);
        });
    } else {
        registerServer();
        log.info(`Worker ${process.pid} started`);
    }
} else {
    registerServer();
}
