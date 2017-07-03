import dva from 'dva';
import Router from './router';

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
import member_level from './model/member_level';

import guangqi_customer from './model/guangqi_customer';
import guangqi_prize from './model/guangqi_prize';
import feijiu_fast_customer from './model/feijiu_fast_customer';
import feijiu_recommend_customer from './model/feijiu_recommend_customer';
import feijiu_recommend_product from './model/feijiu_recommend_product';

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
app.model(member_level);

app.model(guangqi_customer);
app.model(guangqi_prize);
app.model(feijiu_fast_customer);
app.model(feijiu_recommend_customer);
app.model(feijiu_recommend_product);

app.router(Router);

document.getElementById("loading").remove();

app.start('#root');