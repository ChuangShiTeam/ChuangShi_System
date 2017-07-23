import React from 'react';
import {Router, Route, IndexRedirect} from 'dva/router';
import Login from './view/Login';
import Main from './view/Main';
import CodeIndex from './view/code/CodeIndex';
import HttpIndex from './view/http/HttpIndex';
import SqlIndex from './view/sql/SqlIndex';
import ExceptionIndex from './view/exception/ExceptionIndex';
import AppIndex from './view/app/AppIndex';
import AppStockIndex from './view/app_stock/AppStockIndex';
import AppStockList from './view/app_stock/AppStockList';
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
import MemberStockIndex from './view/member_stock/MemberStockIndex';
import MemberStockList from './view/member_stock/MemberStockList';
import MemberStockOutIndex from './view/member_stock/MemberStockOutIndex';
import ExpressIndex from './view/express/ExpressIndex';
import QrcodeIndex from './view/qrcode/QrcodeIndex';

import TradeIndex from './view/trade/TradeIndex';

import CustomerIndex from './view/customer/CustomerIndex';
import CustomerAttributeIndex from './view/customer_attribute/CustomerAttributeIndex';

import GuangqiCustomerIndex from './view/guangqi_customer/GuangqiCustomerIndex';
import GuangqiPrizeIndex from './view/guangqi_prize/GuangqiPrizeIndex';
import FeijiuFastCustomerIndex from './view/feijiu_fast_customer/FeijiuFastCustomerIndex';
import FeijiuRecommendCustomerIndex from './view/feijiu_recommend_customer/FeijiuRecommendCustomerIndex';
import FeijiuRecommendProductIndex from './view/feijiu_recommend_product/FeijiuRecommendProductIndex';
import BillIndex from './view/bill/BillIndex';
import SupplierIndex from './view/supplier/SupplierIndex';
import SupplierStockOutIndex from './view/supplier_stock/SupplierStockOutIndex';

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
                    <Route path="app/stock/index" component={AppStockIndex}/>
                    <Route path="app/stock/list" component={AppStockList}/>
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
                    <Route path="member/stock/index" component={MemberStockIndex}/>
                    <Route path="member/stock/list" component={MemberStockList}/>
                    <Route path="member/stock/out/index" component={MemberStockOutIndex}/>
                    <Route path="express/index" component={ExpressIndex}/>
                    <Route path="qrcode/index" component={QrcodeIndex}/>

                    <Route path="trade/index" component={TradeIndex}/>

                    <Route path="customer/list" component={CustomerIndex}/>
                    <Route path="customer/attribute/index" component={CustomerAttributeIndex}/>

                    <Route path="guangqi/customer/index" component={GuangqiCustomerIndex}/>
                    <Route path="guangqi/prize/index" component={GuangqiPrizeIndex}/>
                    <Route path="feijiu/fast/customer/index" component={FeijiuFastCustomerIndex}/>
                    <Route path="feijiu/recommend/customer/index" component={FeijiuRecommendCustomerIndex}/>
                    <Route path="feijiu/recommend/product/index" component={FeijiuRecommendProductIndex}/>

                    <Route path="bill/index" component={BillIndex}/>
                    <Route path="supplier/index" component={SupplierIndex}/>
                    <Route path="supplier/stock/out/index" component={SupplierStockOutIndex}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
