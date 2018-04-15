import CatLog from 'cat-log';
import ms from 'ms';

export default class LoggerServer extends CatLog {
    /**
     * returns time to be displayed for logs
     *
     * @return  {String}
     *
     * @private
     */
    _getDisplayTime () {
        if (this._disableTime) {
            return '';
        }

        const currentTime = new Date();
        const timeDiff = this._prevTime ? `+${ms(Math.abs(currentTime.getTime() - this._prevTime.getTime()))}` : '0ms';
        this._prevTime = currentTime;
        const output = `[${currentTime.toISOString()} ${timeDiff.padStart(6)}]`;

        return !this._disableColors ?
            `\u001b[033m${output}\u001b[39m`
            : output;
    }

    error(error) {
        super.error(error.stack || error);
    }
}
