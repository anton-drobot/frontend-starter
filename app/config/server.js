export default {
    helmet: {
        /**
         * @see https://content-security-policy.com/
         */
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                sandbox: ['allow-forms', 'allow-same-origin', 'allow-scripts'],
                objectSrc: ["'none'"],
                //reportUri: '/report-violation',
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: [
                    "'self'",
                    (request, response) => {
                        return "'nonce-" + response.nonce + "'";
                    }
                ]
            }
        }
    },
    static: {
        options: {}
    }
};
