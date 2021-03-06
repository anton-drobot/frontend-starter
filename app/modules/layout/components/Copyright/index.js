import React from 'react';
import { observer } from 'mobx-react';

import { bem } from 'app/libs/bem';

const b = bem('Copyright');

function Copyright() {
    return (
        <div className={b()}>
            &copy; «company.ltd»
        </div>
    );
}

export default observer(Copyright);
