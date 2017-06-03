import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Lang from 'framework/Lang';

import Grid from 'app/modules/layout/components/Grid';
import GridItem from 'app/modules/layout/components/GridItem';

@observer
export default class HomePage extends Component {
    render() {
        return (
            <div>
                <Grid>
                    <GridItem columns={3} columnsL={8}>
                        {Lang.get('demo.homePage', { name: 'Username' })}
                    </GridItem>
                    <GridItem columns={4} offset={1} columnsL={4} offsetL={0}>
                        {Lang.get('demo.homePage', { name: 'Username 2' })}
                    </GridItem>
                    <GridItem columns={4} columnsL={12} offsetL={2} offsetM={0}>
                        {Lang.get('demo.homePage', { name: 'Username 3' })}
                    </GridItem>
                </Grid>
            </div>
        );
    }
}
