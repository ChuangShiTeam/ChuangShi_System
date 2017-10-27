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
import uni_lottery from './model/uni_lottery';
import website_menu from './model/website_menu';
import advertisement from './model/advertisement';
import infiniti_member from './model/infiniti_member';
import infiniti_prize from './model/infiniti_prize';
import xietong_course from './model/xietong_course';
import xietong_student from './model/xietong_student';
import xietong_clazz from './model/xietong_clazz';
import xietong_course_config from './model/xietong_course_config';
import xietong_teacher_recruitment from './model/xietong_teacher_recruitment';
import xietong_admissions from './model/xietong_admissions';
import minhang_key from './model/minhang_key';
import minhang_video from './model/minhang_video';
import minhang_task from './model/minhang_task';
import minhang_question from './model/minhang_question';
import minhang_poster from './model/minhang_poster';
import minhang_party_history from './model/minhang_party_history';
import minhang_party_song from './model/minhang_party_song';
import product_category_sku_attribute from './model/product_category_sku_attribute';
import product_category_sku_attribute_item from './model/product_category_sku_attribute_item';
import minhang_timeline from './model/minhang_timeline';
import minhang_timeline_event from './model/minhang_timeline_event';
import xietong_organization from './model/xietong_organization';
import xietong_teacher from './model/xietong_teacher';
import minhang_video_task from './model/minhang_video_task';
import uni_apply from './model/uni_apply';
import uni_book_consult from './model/uni_book_consult';

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
app.model(enchashment);
app.model(article);
app.model(article_category);
app.model(jiangling_prize);
app.model(jiangling_member);
app.model(page);
app.model(captcha);
app.model(jiangling_customer);
app.model(jiangling_game);
app.model(uni_lottery);
app.model(website_menu);
app.model(advertisement);
app.model(infiniti_member);
app.model(infiniti_prize);
app.model(xietong_course);
app.model(xietong_student);
app.model(xietong_clazz);
app.model(xietong_course_config);
app.model(xietong_teacher_recruitment);
app.model(xietong_admissions);
app.model(minhang_key);
app.model(minhang_video);
app.model(minhang_task);
app.model(minhang_question);
app.model(minhang_poster);
app.model(minhang_party_history);
app.model(minhang_party_song);
app.model(product_category_sku_attribute);
app.model(product_category_sku_attribute_item);
app.model(minhang_timeline);
app.model(minhang_timeline_event);
app.model(xietong_organization);
app.model(xietong_teacher);
app.model(minhang_video_task);
app.model(uni_apply);
app.model(uni_book_consult);

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