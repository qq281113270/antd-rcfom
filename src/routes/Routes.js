/*
 * @Author: your name
 * @Date: 2020-06-24 14:11:24
 * @LastEditTime: 2021-06-24 21:13:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /antd-rcfom/src/routes/Routes.js
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import '~antd/dist/antd.css';

const Home = lazy(() => import('../pages/Home/Home'));
const About = lazy(() => import('../pages/About/About'));
const Antd = lazy(() => import('../pages/Antd/Antd'));
const Form = lazy(() => import('../pages/Form/Form'));
const RcForm = lazy(() => import('../pages/RcForm/RcForm'));
const LogicFlow = lazy(() => import('../pages/LogicFlow'));
const Go = lazy(() => import('../pages/Go'));
const DragDrop = lazy(() => import('../pages/DragDrop'));
const IVRtree = lazy(() => import('../pages/IVRtree'));
const DraggableLink = lazy(() => import('../pages/DraggableLink'));
const ReactDraggableLink = lazy(() => import('../pages/ReactDraggableLink'));
 
 

 

function Routes() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/antd" component={Antd} />
                    <Route path="/form" component={Form} />
                    <Route path="/rcForm" component={RcForm} />
                    <Route path="/LogicFlow" component={LogicFlow} />
                    <Route path="/Go" component={Go} />
                    <Route path="/DragDrop" component={DragDrop} />
                    <Route path="/IVRtree" component={IVRtree} />
                    <Route path="/DraggableLink" component={DraggableLink} />
                    <Route path="/ReactDraggableLink" component={ReactDraggableLink} />
                
                 
                </Switch>
            </Suspense>
        </Router>
    );
}

export default Routes;
