import constant from '../util/constant';

export default {

    namespace: 'feijiu_fast_product_category',

    state: {
        app_id: '',
        app_list: [],
        product_category_name: '',
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