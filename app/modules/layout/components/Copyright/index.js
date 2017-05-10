import React from 'react';
import { observer } from 'mobx-react';
import { bem } from 'app/utils/bem';

const b = bem('Copyright');

export default observer(function Copyright() {
    return (
        <div className={b()}>
            &copy; «company.ltd»
        </div>
    );
});
