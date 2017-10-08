import ServiceProvider from '../../IoC/ServiceProvider';

import { VALIDATOR_PROVIDER } from '../types';

import Validator from '../../Services/Validator/Validator';

export default class ValidatorProvider extends ServiceProvider {
    async register() {
        this.container.bind(VALIDATOR_PROVIDER, (container, { rules, messages }) => new Validator(rules, messages));
    }
}
