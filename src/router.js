import React from "react";
import {Router, Route, IndexRedirect} from "dva/router";
import Login from "./view/Login";
import Main from "./view/Main";
import CodeIndex from "./view/code/CodeIndex";
import HttpIndex from "./view/http/HttpIndex";
import SqlIndex from "./view/sql/SqlIndex";
import ExceptionIndex from "./view/exception/ExceptionIndex";
import AppIndex from "./view/app/AppIndex";
import AppStockIndex from "./view/app_stock/AppStockIndex";
import AppStockInIndex from "./view/app_stock/AppStockInIndex";
import AppStockOutIndex from "./view/app_stock/AppStockOutIndex";
import AppStockReplenishIndex from "./view/app_stock/AppStockReplenishIndex";
import CategoryIndex from "./view/category/CategoryIndex";
import MenuIndex from "./view/menu/MenuIndex";
import ApiIndex from "./view/api/ApiIndex";
import UserIndex from "./view/user/UserIndex";
import AdminIndex from "./view/admin/AdminIndex";
import FileIndex from "./view/file/FileIndex";
import ProductIndex from "./view/product/ProductIndex";
import ProductBrandIndex from "./view/product_brand/ProductBrandIndex";
import ProductCategoryIndex from "./view/product_category/ProductCategoryIndex";
import MemberIndex from "./view/member/MemberIndex";
import MemberAddressIndex from "./view/member_address/MemberAddressIndex";
import MemberLevelIndex from "./view/member_level/MemberLevelIndex";
import MemberStockIndex from "./view/member_stock/MemberStockIndex";
import MemberStockInIndex from "./view/member_stock/MemberStockInIndex";
import MemberStockOutIndex from "./view/member_stock/MemberStockOutIndex";
import MemberStockReplenishIndex from "./view/member_stock/MemberStockReplenishIndex";
import MemberDeliveryOrderIndex from "./view/member_delivery_order/MemberDeliveryOrderIndex";
import ExpressIndex from "./view/express/ExpressIndex";
import QrcodeIndex from "./view/qrcode/QrcodeIndex";
import TradeIndex from "./view/trade/TradeIndex";
import CustomerIndex from "./view/customer/CustomerIndex";
import CustomerAttributeIndex from "./view/customer_attribute/CustomerAttributeIndex";
import GuangqiCustomerIndex from "./view/guangqi_customer/GuangqiCustomerIndex";
import GuangqiPrizeIndex from "./view/guangqi_prize/GuangqiPrizeIndex";
import FeijiuFastCreditCardIndex from './view/feijiu_fast_credit_card/FeijiuFastCreditCardIndex';
import FeijiuFastCustomerIndex from "./view/feijiu_fast_customer/FeijiuFastCustomerIndex";
import FeijiuFastProductIndex from './view/feijiu_fast_product/FeijiuFastProductIndex';
import FeijiuFastProductCategoryIndex from './view/feijiu_fast_product_category/FeijiuFastProductCategoryIndex';
import FeijiuRecommendCustomerIndex from "./view/feijiu_recommend_customer/FeijiuRecommendCustomerIndex";
import FeijiuRecommendProductIndex from "./view/feijiu_recommend_product/FeijiuRecommendProductIndex";
import BillIndex from "./view/bill/BillIndex";
import SupplierIndex from "./view/supplier/SupplierIndex";
import SupplierTradeIndex from "./view/supplier_trade/SupplierTradeIndex";
import CacheIndex from "./view/cache/CacheIndex";
import WarehouseIndex from "./view/warehouse/WarehouseIndex";
import WarehouseMemberDeliveryOrderIndex from "./view/warehouse_member_delivery_order/WarehouseMemberDeliveryOrderIndex";
import CertificateIndex from "./view/certificate/CertificateIndex";
import ArticleIndex from './view/article/ArticleIndex';
import EnchashmentIndex from './view/enchashment/EnchashmentIndex';
import ArticleCategoryIndex from './view/article_category/ArticleCategoryIndex';
import JianglingPrizeIndex from './view/jiangling_prize/JianglingPrizeIndex';
import JianglingMemberIndex from './view/jiangling_member/JianglingMemberIndex';
import PageIndex from './view/page/PageIndex';
import CaptchaIndex from './view/captcha/CaptchaIndex';
import JianglingCustomerIndex from './view/jiangling_customer/JianglingCustomerIndex';
import JianglingGameIndex from './view/jiangling_game/JianglingGameIndex';

import storage from "./util/storage";
import constant from "./util/constant";

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
                    <Route path="cache/index" component={CacheIndex}/>
                    <Route path="code/index" component={CodeIndex}/>
                    <Route path="http/index" component={HttpIndex}/>
                    <Route path="sql/index" component={SqlIndex}/>
                    <Route path="exception/index" component={ExceptionIndex}/>
                    <Route path="app/index" component={AppIndex}/>
                    <Route path="app/stock/index" component={AppStockIndex}/>
                    <Route path="app/stock/in/index" component={AppStockInIndex}/>
                    <Route path="app/stock/out/index" component={AppStockOutIndex}/>
                    <Route path="app/stock/replenish/index" component={AppStockReplenishIndex}/>
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
                    <Route path="member/stock/in/index" component={MemberStockInIndex}/>
                    <Route path="member/stock/out/index" component={MemberStockOutIndex}/>
                    <Route path="member/stock/replenish/index" component={MemberStockReplenishIndex}/>
                    <Route path="member/delivery/order/index" component={MemberDeliveryOrderIndex}/>
                    <Route path="express/index" component={ExpressIndex}/>
                    <Route path="qrcode/index" component={QrcodeIndex}/>
                    <Route path="trade/index" component={TradeIndex}/>
                    <Route path="customer/list" component={CustomerIndex}/>
                    <Route path="customer/attribute/index" component={CustomerAttributeIndex}/>
                    <Route path="guangqi/customer/index" component={GuangqiCustomerIndex}/>
                    <Route path="guangqi/prize/index" component={GuangqiPrizeIndex}/>
                    <Route path="feijiu/fast/credit/card/index" component={FeijiuFastCreditCardIndex}/>
                    <Route path="feijiu/fast/customer/index" component={FeijiuFastCustomerIndex}/>
                    <Route path="feijiu/fast/product/index" component={FeijiuFastProductIndex}/>
                    <Route path="feijiu/fast/product/category/index" component={FeijiuFastProductCategoryIndex}/>
                    <Route path="feijiu/recommend/customer/index" component={FeijiuRecommendCustomerIndex}/>
                    <Route path="feijiu/recommend/product/index" component={FeijiuRecommendProductIndex}/>
                    <Route path="bill/index" component={BillIndex}/>
                    <Route path="supplier/index" component={SupplierIndex}/>
                    <Route path="supplier/trade/index" component={SupplierTradeIndex}/>
                    <Route path="warehouse/index" component={WarehouseIndex}/>
                    <Route path="warehouse/member/delivery/order/index" component={WarehouseMemberDeliveryOrderIndex}/>
                    <Route path="certificate/index" component={CertificateIndex}/>
                    <Route path="article/index" component={ArticleIndex}/>
                    <Route path="enchashment/index" component={EnchashmentIndex}/>
                    <Route path="article/category/index" component={ArticleCategoryIndex}/>
                    <Route path="jiangling/prize/index" component={JianglingPrizeIndex}/>
                    <Route path="jiangling/member/index" component={JianglingMemberIndex}/>
                    <Route path="page/index" component={PageIndex}/>
                    <Route path="captcha/index" component={CaptchaIndex}/>
                    <Route path="jiangling/customer/index" component={JianglingCustomerIndex}/>
                    <Route path="jiangling/game/index" component={JianglingGameIndex}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
