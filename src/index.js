import dva from 'dva';
import Router from './router';

import constant from './util/constant';
import './view/Style.css';

import code from './model/code';
import http from './model/http';
import sql from './model/sql';
import exception from './model/exception';
import appModel from './model/app';
import category from './model/category';
import menu from './model/menu';
import api from './model/api';
import user from './model/user';
import admin from './model/admin';
import file from './model/file';
import product from './model/product';
import product_brand from './model/product_brand';
import product_category from './model/product_category';
import member from './model/member';
import member_address from './model/member_address';
import member_level from './model/member_level';
import member_stock from './model/member_stock';
import app_stock from './model/app_stock';
import express from './model/express';
import qrcode from './model/qrcode';

import delivery_order from './model/delivery_order';

import trade from './model/trade';

import customer from './model/customer';
import customer_attribute from './model/customer_attribute';

import guangqi_customer from './model/guangqi_customer';
import guangqi_prize from './model/guangqi_prize';
import feijiu_fast_customer from './model/feijiu_fast_customer';
import feijiu_recommend_customer from './model/feijiu_recommend_customer';
import feijiu_recommend_product from './model/feijiu_recommend_product';
import bill from './model/bill';
import supplier from './model/supplier';
import supplier_trade from './model/supplier_trade';
import cache from './model/cache';

import warehouse from './model/warehouse';

document.title = constant.name;

const app = dva();

app.model(code);
app.model(http);
app.model(sql);
app.model(exception);
app.model(appModel);
app.model(category);
app.model(menu);
app.model(api);
app.model(user);
app.model(admin);
app.model(file);
app.model(product);
app.model(product_brand);
app.model(product_category);
app.model(member);
app.model(member_address);
app.model(member_level);
app.model(member_stock);
app.model(app_stock);
app.model(express);
app.model(qrcode);

app.model(trade);

app.model(customer);
app.model(customer_attribute);

app.model(guangqi_customer);
app.model(guangqi_prize);
app.model(feijiu_fast_customer);
app.model(feijiu_recommend_customer);
app.model(feijiu_recommend_product);
app.model(bill);
app.model(supplier);
app.model(supplier_trade);
app.model(cache);

app.model(warehouse);

app.model(delivery_order);

app.router(Router);

for (let i = 0; i < document.styleSheets.length; i++) {
    let rule = document.styleSheets[i].cssRules;
    for (let j = 0 ; j < rule.length; j++) {
        if (rule[j].selectorText === '.ant-modal-body') {
            rule[j].style.height= document.documentElement.clientHeight - 290 + 'px';
            break;
        }
    }
}

document.getElementById("loading").remove();

app.start('#root');