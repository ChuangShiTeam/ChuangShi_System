import constant from '../util/constant';

export default {

    namespace: 'feijiu_recommend_product',

    state: {
        product_name: '',
        app_list: [],
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};