import 'isomorphic-fetch';

import Env from 'framework/Env';
import JsonApi from 'framework/JsonApi';

export default class ApiMethod extends JsonApi {
    static _apiMethods = [];

    apiUrl = Env.get('BACKEND_URL');

    method = 'GET';

    static getMethods() {
        return ApiMethod._apiMethods;
    }

    constructor() {
        super();
        ApiMethod._apiMethods.push(this);
    }
}
