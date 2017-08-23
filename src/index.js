import dva from "dva";
import Router from "./router";
import constant from "./util/constant";
import "./view/Style.css";
import code from "./model/code";
import http from "./model/http";
import sql from "./model/sql";
import exception from "./model/exception";
import appModel from "./model/app";
import category from "./model/category";
import menu from "./model/menu";
import api from "./model/api";
import user from "./model/user";
import admin from "./model/admin";
import file from "./model/file";
import product from "./model/product";
import product_brand from "./model/product_brand";
import product_category from "./model/product_category";
import member from "./model/member";
import member_address from "./model/member_address";
import member_level from "./model/member_level";
import member_stock from "./model/member_stock";
import member_stock_in from "./model/member_stock_in";
import member_stock_out from "./model/member_stock_out";
import member_stock_replenish from "./model/member_stock_replenish";
import app_stock from "./model/app_stock";
import app_stock_in from "./model/app_stock_in";
import app_stock_out from "./model/app_stock_out";
import app_stock_replenish from "./model/app_stock_replenish";
import express from "./model/express";
import qrcode from "./model/qrcode";
import member_delivery_order from "./model/member_delivery_order";
import trade from "./model/trade";
import customer from "./model/customer";
import customer_attribute from "./model/customer_attribute";
import guangqi_customer from "./model/guangqi_customer";
import guangqi_prize from "./model/guangqi_prize";
import feijiu_fast_credit_card from "./model/feijiu_fast_credit_card";
import feijiu_fast_customer from "./model/feijiu_fast_customer";
import feijiu_fast_product from "./model/feijiu_fast_product";
import feijiu_fast_product_category from "./model/feijiu_fast_product_category";
import feijiu_recommend_customer from "./model/feijiu_recommend_customer";
import feijiu_recommend_product from "./model/feijiu_recommend_product";
import bill from "./model/bill";
import supplier from "./model/supplier";
import supplier_trade from "./model/supplier_trade";
import cache from "./model/cache";
import warehouse from "./model/warehouse";
import warehouse_member_delivery_order from "./model/warehouse_member_delivery_order";
import certificate from "./model/certificate";
import article from './model/article';
import enchashment from './model/enchashment';
import article_category from './model/article_category';
import jiangling_prize from './model/jiangling_prize';
import jiangling_member from './model/jiangling_member';
import page from './model/page';
import captcha from './model/captcha';
import jiangling_customer from './model/jiangling_customer';
import jiangling_game from './model/jiangling_game';
import website_menu from './model/website_menu';

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
app.model(member_stock_in);
app.model(member_stock_out);
app.model(member_stock_replenish);
app.model(app_stock);
app.model(app_stock_in);
app.model(app_stock_out);
app.model(app_stock_replenish);
app.model(express);
app.model(qrcode);
app.model(trade);
app.model(customer);
app.model(customer_attribute);
app.model(guangqi_customer);
app.model(guangqi_prize);
app.model(feijiu_fast_credit_card);
app.model(feijiu_fast_customer);
app.model(feijiu_fast_product_category);
app.model(feijiu_fast_product);
app.model(feijiu_recommend_customer);
app.model(feijiu_recommend_product);
app.model(bill);
app.model(supplier);
app.model(supplier_trade);
app.model(cache);
app.model(warehouse);
app.model(warehouse_member_delivery_order);
app.model(member_delivery_order);
app.model(certificate);
app.model(article);
app.model(enchashment);
app.model(article_category);
app.model(jiangling_prize);
app.model(jiangling_member);
app.model(page);
app.model(captcha);
app.model(jiangling_customer);
app.model(jiangling_game);
app.model(website_menu);

app.router(Router);

for (let i = 0; i < document.styleSheets.length; i++) {
    let rule = document.styleSheets[i].cssRules;
    for (let j = 0; j < rule.length; j++) {
        if (rule[j].selectorText === '.ant-modal-body') {
            rule[j].style.height = document.documentElement.clientHeight - 290 + 'px';
            break;
        }
    }
}

document.getElementById("loading").remove();

app.start('#root');