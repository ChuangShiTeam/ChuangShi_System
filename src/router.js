import React from 'react';
import {Router, Route, IndexRedirect} from 'dva/router';
import Login from './view/Login';
import Main from './view/Main';
import CodeIndex from './view/code/CodeIndex';
import HttpIndex from './view/http/HttpIndex';
import SqlIndex from './view/sql/SqlIndex';
import ExceptionIndex from './view/exception/ExceptionIndex';
import AppIndex from './view/app/AppIndex';
import CategoryIndex from './view/category/CategoryIndex';
import MenuIndex from './view/menu/MenuIndex';
import ApiIndex from './view/api/ApiIndex';
import UserIndex from './view/user/UserIndex';
import AdminIndex from './view/admin/AdminIndex';
import FileIndex from './view/file/FileIndex';
import ProductIndex from './view/product/ProductIndex';
import ProductBrandIndex from './view/product_brand/ProductBrandIndex';
import ProductCategoryIndex from './view/product_category/ProductCategoryIndex';
import MemberIndex from './view/member/MemberIndex';
import MemberAddressIndex from './view/member_address/MemberAddressIndex';
import MemberLevelIndex from './view/member_level/MemberLevelIndex';
import MemberStockActionIndex from './view/member_stock_action/MemberStockActionIndex';
import StockIndex from './view/stock/StockIndex';
import ExpressIndex from './view/express/ExpressIndex';

import CustomerIndex from './view/customer/CustomerIndex';
import CustomerAttributeIndex from './view/customer_attribute/CustomerAttributeIndex';

import GuangqiCustomerIndex from './view/guangqi_customer/GuangqiCustomerIndex';
import GuangqiPrizeIndex from './view/guangqi_prize/GuangqiPrizeIndex';
import FeijiuFastCustomerIndex from './view/feijiu_fast_customer/FeijiuFastCustomerIndex';
import FeijiuRecommendCustomerIndex from './view/feijiu_recommend_customer/FeijiuRecommendCustomerIndex';
import FeijiuRecommendProductIndex from './view/feijiu_recommend_product/FeijiuRecommendProductIndex';

import storage from './util/storage';

import constant from './util/constant';

function RouterConfig({history}) {

    const validate = function (next, replace, callback) {
        if ((storage.getToken() === '' || storage.getToken() === null) && next.location.pathname !== '/login') {

            replace('/login');
        }

        callback();
    };

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route path="login" component={Login}/>
                <Route component={Main} onEnter={validate}>
                    <Route path="code/index" component={CodeIndex}/>
                    <Route path="http/index" component={HttpIndex}/>
                    <Route path="sql/index" component={SqlIndex}/>
                    <Route path="exception/index" component={ExceptionIndex}/>
                    <Route path="app/index" component={AppIndex}/>
                    <Route path="category/index" component={CategoryIndex}/>
                    <Route path="menu/index" component={MenuIndex}/>
                    <Route path="api/index" component={ApiIndex}/>
                    <Route path="user/index" component={UserIndex}/>
                    <Route path="admin/index" component={AdminIndex}/>
                    <Route path="file/index" component={FileIndex}/>
                    <Route path="product/index" component={ProductIndex}/>
                    <Route path="product/brand/index" component={ProductBrandIndex}/>
                    <Route path="product/category/index" component={ProductCategoryIndex}/>
                    <Route path="member/index" component={MemberIndex}/>
                    <Route path="member/address/index" component={MemberAddressIndex}/>
                    <Route path="member/level/index" component={MemberLevelIndex}/>
                    <Route path="member/stock/action/index" component={MemberStockActionIndex}/>
                    <Route path="stock/index" component={StockIndex}/>
                    <Route path="express/index" component={ExpressIndex}/>

                    <Route path="customer/list" component={CustomerIndex}/>
                    <Route path="customer/attribute/index" component={CustomerAttributeIndex}/>

                    <Route path="guangqi/customer/index" component={GuangqiCustomerIndex}/>
                    <Route path="guangqi/prize/index" component={GuangqiPrizeIndex}/>
                    <Route path="feijiu/fast/customer/index" component={FeijiuFastCustomerIndex}/>
                    <Route path="feijiu/recommend/customer/index" component={FeijiuRecommendCustomerIndex}/>
                    <Route path="feijiu/recommend/product/index" component={FeijiuRecommendProductIndex}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
