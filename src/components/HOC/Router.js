import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Info} from "../Info/Info";
import Shop from "../Shop/Shop";

export const Router = () => {
    return (
        <Switch>
            <Route path={'/'} exact>
                <Shop />
            </Route>
            <Route path={'/info'}>
                <Info />
            </Route>
        </Switch>
    )
};