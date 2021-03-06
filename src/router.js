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
import JianglingNewCustomerIndex from './view/jiangling_new_customer/JianglingNewCustomerIndex';
import JianglingNewGameIndex from './view/jiangling_new_game/JianglingNewGameIndex';
import WebsiteMenuIndex from './view/website_menu/WebsiteMenuIndex';
import AdvertisementIndex from './view/advertisement/AdvertisementIndex';
import XietongArticleIndex from './view/xietong_article/XietongArticleIndex';
import XietongCourseIndex from './view/xietong_course/XietongCourseIndex';
import XietongStudentIndex from './view/xietong_student/XietongStudentIndex';
import XietongClazzIndex from './view/xietong_clazz/XietongClazzIndex';
import XietongCourseConfigIndex from './view/xietong_course_config/XietongCourseConfigIndex';
import InfinitiMemberIndex from './view/infiniti_member/InfinitiMemberIndex';
import InfinitiPrizeIndex from './view/infiniti_prize/InfinitiPrizeIndex';
import UniLotteryIndex from './view/uni_lottery/UniLotteryIndex';
import XietongTeacherRecruitmentIndex from './view/xietong_teacher_recruitment/XietongTeacherRecruitmentIndex';
import ProductCategorySkuAttributeIndex from './view/product_category_sku_attribute/ProductCategorySkuAttributeIndex';
import ProductCategorySkuAttributeItemIndex from './view/product_category_sku_attribute_item/ProductCategorySkuAttributeItemIndex';
import MinhangKeyIndex from './view/minhang_key/MinhangKeyIndex';
import MinhangVideoIndex from './view/minhang_video/MinhangVideoIndex';
import MinhangTaskIndex from './view/minhang_task/MinhangTaskIndex';
import MinhangQuestionIndex from './view/minhang_task/minhang_question/MinhangQuestionIndex';
import MinhangPosterIndex from './view/minhang_poster/MinhangPosterIndex';
import MinhangAffiantIndex from './view/minhang_affiant/MinhangAffiantIndex';
import MinhangCompanyIndex from './view/minhang_company/MinhangCompanyIndex';
import MinhangPartyHistoryIndex from './view/minhang_party_history/MinhangPartyHistoryIndex';
import MinhangPartySongIndex from './view/minhang_party_song/MinhangPartySongIndex';
import MinhangTimelineIndex from './view/minhang_timeline/MinhangTimelineIndex';
import MinhangTimelineEventIndex from './view/minhang_timeline/minhang_timeline_event/MinhangTimelineEventIndex';
import XietongOrganizationIndex from './view/xietong_organization/XietongOrganizationIndex';
import MinhangVideoTaskIndex from './view/minhang_video/minhang_video_task/MinhangVideoTaskIndex';
import XietongTeacherIndex from './view/xietong_teacher/XietongTeacherIndex';
import UniApplyIndex from './view/uni_apply/UniApplyIndex';
import UniBookConsultIndex from './view/uni_book_consult/UniBookConsultIndex';
import GezhoubaSupplierinfoIndex from './view/gezhouba_supplier/GezhoubaSupplierinfoIndex';
import GezhoubaProductinfoIndex from './view/gezhouba_product/GezhoubaProductinfoIndex';
import GezhoubaStockinfoIndex from './view/gezhouba_stock/GezhoubaStockinfoIndex';
import GezhoubaStockinIndex from './view/gezhouba_stockin/GezhoubaStockinIndex';
import GezhoubaStockinDetailIndex from './view/gezhouba_stockin_detail/GezhoubaStockinDetailIndex';
import RenaultShareIndex from './view/renault_share/RenaultShareIndex';
import RenaultCustomerIndex from './view/renault_customer/RenaultCustomerIndex';
import RenaultMemberIndex from './view/renault_member/RenaultMemberIndex';
import XietongStudentCategoryIndex from './view/xietong_student_category/XietongStudentCategoryIndex';
import XietongSignupPupilIndex from './view/xietong_signup_pupil/XietongSignupPupilIndex';
import XietongSignupJuniorIndex from './view/xietong_signup_junior/XietongSignupJuniorIndex';
import XietongTeacherCategoryIndex from './view/xietong_teacher_category/XietongTeacherCategoryIndex';
import RoleIndex from './view/role/RoleIndex';
import AppConfigIndex from './view/app_config/AppConfigIndex';
import GuangqiSingConfigIndex from './view/guangqi_sing_config/GuangqiSingConfigIndex';
import GuangqiGameAreaIndex from './view/guangqi_game_area/GuangqiGameAreaIndex';
import GuangqiGameAreaDetailIndex from './view/guangqi_game_area/detail/GuangqiGameAreaDetailIndex';
import GuangqiWonderfulShowIndex from './view/guangqi_wonderful_show/GuangqiWonderfulShowIndex';
import RenaultNewYearIndex from './view/renault_new_year/RenaultNewYearIndex';
import RenaultNewYearShareIndex from './view/renault_new_year_share/RenaultNewYearShareIndex';
import GuangqiNewYearPrizeIndex from './view/guangqi_new_year_prize/GuangqiNewYearPrizeIndex';
import GuangqiNewYearCustomerIndex from './view/guangqi_new_year_customer/GuangqiNewYearCustomerIndex';
import GuangqiJoinApplyIndex from './view/guangqi_join_apply/GuangqiJoinApplyIndex';
import GuangqiConferenceConfigIndex from './view/guangqi_conference_config/GuangqiConferenceConfigIndex';
import GuangqiConferenceCustomerIndex from './view/guangqi_conference_customer/GuangqiConferenceCustomerIndex';
import GuangqiConferencePrizeIndex from './view/guangqi_conference_prize/GuangqiConferencePrizeIndex';

import storage from "./util/storage";
import constant from "./util/constant";

function RouterConfig({history}) {

    const handleEnter = function (next, replace, callback) {
        if ((storage.getToken() === '' || storage.getToken() === null) && next.location.pathname !== '/login') {

            replace('/login');
        }

        callback();
    };

    const handleChange = function (next, replace, callback) {
        if ((storage.getToken() === '' || storage.getToken() === null) && next.location.pathname !== '/login') {

            replace('/login');
        }

        callback();
    };

    return (
        <Router history={history}>
            <Route path="/">
                <IndexRedirect to={constant.index}/>
                <Route path="/login" component={Login}/>
                <Route component={Main} onEnter={handleEnter} onChange={handleChange}>
                    <Route path="/cache/index" component={CacheIndex}/>
                    <Route path="/code/index" component={CodeIndex}/>
                    <Route path="/http/index" component={HttpIndex}/>
                    <Route path="/sql/index" component={SqlIndex}/>
                    <Route path="/exception/index" component={ExceptionIndex}/>
                    <Route path="/app/index" component={AppIndex}/>
                    <Route path="/app/stock/index" component={AppStockIndex}/>
                    <Route path="/app/stock/in/index" component={AppStockInIndex}/>
                    <Route path="/app/stock/out/index" component={AppStockOutIndex}/>
                    <Route path="/app/stock/replenish/index" component={AppStockReplenishIndex}/>
                    <Route path="/category/index" component={CategoryIndex}/>
                    <Route path="/menu/index" component={MenuIndex}/>
                    <Route path="/api/index" component={ApiIndex}/>
                    <Route path="/user/index" component={UserIndex}/>
                    <Route path="/admin/index" component={AdminIndex}/>
                    <Route path="/file/index" component={FileIndex}/>
                    <Route path="/product/index" component={ProductIndex}/>
                    <Route path="/product/brand/index" component={ProductBrandIndex}/>
                    <Route path="/product/category/index" component={ProductCategoryIndex}/>
                    <Route path="/member/index" component={MemberIndex}/>
                    <Route path="/member/address/index" component={MemberAddressIndex}/>
                    <Route path="/member/level/index" component={MemberLevelIndex}/>
                    <Route path="/member/stock/index" component={MemberStockIndex}/>
                    <Route path="/member/stock/in/index" component={MemberStockInIndex}/>
                    <Route path="/member/stock/out/index" component={MemberStockOutIndex}/>
                    <Route path="/member/stock/replenish/index" component={MemberStockReplenishIndex}/>
                    <Route path="/member/delivery/order/index" component={MemberDeliveryOrderIndex}/>
                    <Route path="/express/index" component={ExpressIndex}/>
                    <Route path="/qrcode/index" component={QrcodeIndex}/>
                    <Route path="/trade/index" component={TradeIndex}/>
                    <Route path="/customer/list" component={CustomerIndex}/>
                    <Route path="/customer/attribute/index" component={CustomerAttributeIndex}/>
                    <Route path="/guangqi/customer/index" component={GuangqiCustomerIndex}/>
                    <Route path="/guangqi/prize/index" component={GuangqiPrizeIndex}/>
                    <Route path="/feijiu/fast/credit/card/index" component={FeijiuFastCreditCardIndex}/>
                    <Route path="/feijiu/fast/customer/index" component={FeijiuFastCustomerIndex}/>
                    <Route path="/feijiu/fast/product/index" component={FeijiuFastProductIndex}/>
                    <Route path="/feijiu/fast/product/category/index" component={FeijiuFastProductCategoryIndex}/>
                    <Route path="/feijiu/recommend/customer/index" component={FeijiuRecommendCustomerIndex}/>
                    <Route path="/feijiu/recommend/product/index" component={FeijiuRecommendProductIndex}/>
                    <Route path="/bill/index" component={BillIndex}/>
                    <Route path="/supplier/index" component={SupplierIndex}/>
                    <Route path="/supplier/trade/index" component={SupplierTradeIndex}/>
                    <Route path="/warehouse/index" component={WarehouseIndex}/>
                    <Route path="/warehouse/member/delivery/order/index" component={WarehouseMemberDeliveryOrderIndex}/>
                    <Route path="/certificate/index" component={CertificateIndex}/>
                    <Route path="/article/index" component={ArticleIndex}/>
                    <Route path="/enchashment/index" component={EnchashmentIndex}/>
                    <Route path="/article/category/index" component={ArticleCategoryIndex}/>
                    <Route path="/jiangling/prize/index" component={JianglingPrizeIndex}/>
                    <Route path="/jiangling/member/index" component={JianglingMemberIndex}/>
                    <Route path="/page/index" component={PageIndex}/>
                    <Route path="/captcha/index" component={CaptchaIndex}/>
                    <Route path="/jiangling/customer/index" component={JianglingCustomerIndex}/>
                    <Route path="/jiangling/game/index" component={JianglingGameIndex}/>
                    <Route path="/jiangling/new/customer/index" component={JianglingNewCustomerIndex}/>
                    <Route path="/jiangling/new/game/index" component={JianglingNewGameIndex}/>
                    <Route path="/website/menu/index" component={WebsiteMenuIndex}/>
                    <Route path="/advertisement/index" component={AdvertisementIndex}/>
                    <Route path="/xietong/article/index" component={XietongArticleIndex}/>
                    <Route path="/infiniti/member/index" component={InfinitiMemberIndex}/>
                    <Route path="/infiniti/prize/index" component={InfinitiPrizeIndex}/>
                    <Route path="/xietong/course/index" component={XietongCourseIndex}/>
                    <Route path="/xietong/student/index" component={XietongStudentIndex}/>
                    <Route path="/xietong/clazz/index" component={XietongClazzIndex}/>
                    <Route path="/xietong/course/config/index" component={XietongCourseConfigIndex}/>
                    <Route path="/uni/lottery/index" component={UniLotteryIndex}/>
                    <Route path="/xietong/teacher/recruitment/index" component={XietongTeacherRecruitmentIndex}/>
                    <Route path="/product/category/sku/attribute/index" component={ProductCategorySkuAttributeIndex}/>
                    <Route path="/product/category/sku/attribute/item/index" component={ProductCategorySkuAttributeItemIndex}/>
                    <Route path="/minhang/key/index" component={MinhangKeyIndex}/>
                    <Route path="/minhang/video/index" component={MinhangVideoIndex}/>
                    <Route path="/minhang/task/index" component={MinhangTaskIndex}/>
                    <Route path="/minhang/task/question/index/:task_id" component={MinhangQuestionIndex}/>
                    <Route path="/minhang/poster/index" component={MinhangPosterIndex}/>
                    <Route path="/minhang/party/history/index" component={MinhangPartyHistoryIndex}/>
                    <Route path="/minhang/party/song/index" component={MinhangPartySongIndex}/>
                    <Route path="/minhang/timeline/index" component={MinhangTimelineIndex}/>
                    <Route path="/minhang/affiant/index" component={MinhangAffiantIndex}/>
                    <Route path="/minhang/company/index" component={MinhangCompanyIndex}/>
                    <Route path="/minhang/timeline/event/index/:timeline_id" component={MinhangTimelineEventIndex}/>
                    <Route path="/minhang/video/task/index/:video_id" component={MinhangVideoTaskIndex}/>
                    <Route path="/xietong/organization/index" component={XietongOrganizationIndex}/>
                    <Route path="/xietong/teacher/index" component={XietongTeacherIndex}/>
                    <Route path="/uni/apply/index" component={UniApplyIndex}/>
                    <Route path="/uni/book/consult/index" component={UniBookConsultIndex}/>
                    <Route path="/getzhouba/supplier/index" component={GezhoubaSupplierinfoIndex}/>
                    <Route path="/getzhouba/product/index" component={GezhoubaProductinfoIndex}/>
                    <Route path="/getzhouba/stock/index" component={GezhoubaStockinfoIndex}/>
                    <Route path="/getzhouba/stockin/index" component={GezhoubaStockinIndex}/>
                    <Route path="/getzhouba/stockin_detail/index" component={GezhoubaStockinDetailIndex}/>
                    <Route path="/renault/share/index" component={RenaultShareIndex}/>
                    <Route path="/renault/customer/index" component={RenaultCustomerIndex}/>
                    <Route path="/renault/member/index" component={RenaultMemberIndex}/>
                    <Route path="/xietong/signup/junior/index" component={XietongSignupJuniorIndex}/>
                    <Route path="/xietong/signup/pupil/index" component={XietongSignupPupilIndex}/>
                    <Route path="/xietong/student/category/index" component={XietongStudentCategoryIndex}/>
                    <Route path="/xietong/teacher/category/index" component={XietongTeacherCategoryIndex}/>
                    <Route path="/role/index" component={RoleIndex}/>
                    <Route path="/app/config/index" component={AppConfigIndex}/>
                    <Route path="/guangqi/sing/config/index" component={GuangqiSingConfigIndex}/>
                    <Route path="/guangqi/game/area/index" component={GuangqiGameAreaIndex}/>
                    <Route path="/guangqi/game/area/detail/:game_area_id" component={GuangqiGameAreaDetailIndex}/>
                    <Route path="/guangqi/wonderful/show/index" component={GuangqiWonderfulShowIndex}/>
                    <Route path="/renault/new/year/index" component={RenaultNewYearIndex}/>
                    <Route path="/renault/new/year/share/index" component={RenaultNewYearShareIndex}/>
                    <Route path="/guangqi/new/year/prize/index" component={GuangqiNewYearPrizeIndex}/>
                    <Route path="/guangqi/new/year/customer/index" component={GuangqiNewYearCustomerIndex}/>
                    <Route path="/guangqi/join/apply/index" component={GuangqiJoinApplyIndex}/>
                    <Route path="/guangqi/conference/config/index" component={GuangqiConferenceConfigIndex}/>
                    <Route path="/guangqi/conference/customer/index" component={GuangqiConferenceCustomerIndex}/>
                    <Route path="/guangqi/conference/prize/index" component={GuangqiConferencePrizeIndex}/>
                </Route>
            </Route>
        </Router>
    );
}

export default RouterConfig;
