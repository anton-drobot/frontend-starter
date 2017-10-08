import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';

import { bem } from 'app/utils/bem';

import DefaultLayout from 'app/modules/layout/components/DefaultLayout';

import Icon from 'app/modules/core/components/Icon';

import Grid from 'app/modules/layout/components/Grid';
import GridItem from 'app/modules/layout/components/GridItem';

import Link from 'app/modules/core/components/Link';

import Button from 'app/modules/controls/components/Button';
import ButtonGroup from 'app/modules/controls/components/ButtonGroup';

import Checkbox from 'app/modules/controls/components/Checkbox';
import Radio from 'app/modules/controls/components/Radio';

import Input from 'app/modules/controls/components/Input';

const b = bem('DemoPage');

@observer
export default class DemoPage extends Component {
    render() {
        return (
            <DefaultLayout>
                <Helmet>
                    <title>Demo Page</title>
                </Helmet>

                <section className={b()}>
                    Demo Page<br />

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Grid</h1>

                        <div className={b('examples')}>
                            <Grid>
                                <GridItem
                                    className={b('firstColumnExample')}
                                    columns={7} offset={0}
                                    columnsM={12} offsetM={0}
                                    columnsS={5} offsetS={0}
                                >
                                    <p>7 columns transforms to 12 columns when screen size are M.</p>
                                    <p>12 columns transforms to 5 columns when screen size are S.</p>
                                </GridItem>
                                <GridItem
                                    className={b('secondColumnExample')}
                                    columns={5} offset={0}
                                    columnsM={12} offsetM={0}
                                    columnsS={5} offsetS={2}
                                >
                                    <p>5 columns transforms to 12 columns when screen size are M.</p>
                                    <p>12 columns transforms to 5 columns with 2 columns offset when screen size are S.</p>

                                    <Grid>
                                        <GridItem
                                            className={b('thirdColumnExample')}
                                            columns={6} offset={0}
                                        >
                                            <p>Nested 6 columns</p>
                                        </GridItem>
                                        <GridItem
                                            className={b('fourthColumnExample')}
                                            columns={6} offset={0}
                                        >
                                            <p>Nested 6 columns</p>
                                        </GridItem>
                                    </Grid>
                                </GridItem>
                            </Grid>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Link</h1>

                        <div className={b('examples')}>
                            <Link
                                className={b('linkExample')}
                                theme="default"
                                href="#"
                            >
                                Link
                            </Link>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Button</h1>

                        <div className={b('examples')}>
                            <Button
                                className={b('buttonExample')}
                                theme="default"
                            >
                                Button
                            </Button>

                            <Button
                                className={b('buttonExample')}
                                theme="default"
                                after={<Icon glyph="caret" />}
                            >
                                Button
                            </Button>

                            <Button
                                className={b('buttonExample')}
                                theme="default"
                                before={<Icon glyph="tick" />}
                            >
                                Button
                            </Button>

                            <Button
                                className={b('buttonExample')}
                                theme="default"
                                before={<Icon glyph="tick" />}
                                after={<Icon glyph="caret" />}
                            >
                                Button
                            </Button>

                            <Button
                                className={b('buttonExample')}
                                theme="default"
                                disabled
                            >
                                Disabled button
                            </Button>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Button Group</h1>

                        <div className={b('examples')}>
                            <ButtonGroup>
                                <Button>1st Button</Button>
                                <Button>2nd Button</Button>
                                <Button>3d Button</Button>
                            </ButtonGroup>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Checkbox</h1>

                        <div className={b('examples')}>
                            <Checkbox
                                className={b('checkboxExample')}
                            />

                            <Checkbox
                                className={b('checkboxExample')}
                                defaultChecked
                            >
                                Label
                            </Checkbox>

                            <Checkbox
                                className={b('checkboxExample')}
                            >
                                Multiple<br />
                                Lines<br />
                                Label
                            </Checkbox>

                            <Checkbox
                                className={b('checkboxExample')}
                                disabled
                            >
                                Disabled
                            </Checkbox>

                            <Checkbox
                                className={b('checkboxExample')}
                                disabled
                                defaultChecked
                            >
                                Disabled checked
                            </Checkbox>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Radio</h1>

                        <div className={b('examples')}>
                            <Radio
                                name="radioExample1"
                                value="one"
                                className={b('checkboxExample')}
                            />

                            <Radio
                                className={b('checkboxExample')}
                                name="radioExample1"
                                value="two"
                                defaultChecked
                            >
                                Label
                            </Radio>

                            <Radio
                                className={b('checkboxExample')}
                                name="radioExample1"
                                value="three"
                            >
                                Multiple<br />
                                Lines<br />
                                Label
                            </Radio>

                            <Radio
                                className={b('checkboxExample')}
                                name="radioExample2"
                                value="one"
                                disabled
                            >
                                Disabled
                            </Radio>

                            <Radio
                                className={b('checkboxExample')}
                                name="radioExample2"
                                value="two"
                                disabled
                                defaultChecked
                            >
                                Disabled radio
                            </Radio>

                            <form>
                                <Radio
                                    className={b('checkboxExample')}
                                    formId="someFormId"
                                    name="radioExample3"
                                    value="one"
                                >
                                    One
                                </Radio>

                                <Radio
                                    className={b('checkboxExample')}
                                    formId="someFormId"
                                    name="radioExample3"
                                    value="two"
                                >
                                    Two
                                </Radio>

                                <Radio
                                    className={b('checkboxExample')}
                                    formId="someFormId"
                                    name="radioExample3"
                                    value="three"
                                >
                                    Three
                                </Radio>
                            </form>
                        </div>
                    </section>

                    <section className={b('section')}>
                        <h1 className={b('sectionTitle')}>Input</h1>

                        <div className={b('examples')}>
                            <Input
                                className={b('inputExample')}
                            />

                            <Input
                                className={b('inputExample')}
                                placeholder="With placeholder"
                            />

                            <Input
                                className={b('inputExample')}
                                value="Default value"
                            />

                            <Input
                                className={b('inputExample')}
                                label="With Label"
                            />

                            <Input
                                className={b('inputExample')}
                                label={(
                                    <span>
                                        Multiple<br />
                                        Lines<br />
                                        Label
                                    </span>
                                )}
                            />

                            <Input
                                className={b('inputExample')}
                                value="Disabled input"
                                disabled
                            />
                        </div>
                    </section>
                </section>
            </DefaultLayout>
        );
    }
}
