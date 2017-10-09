import constant from '../util/constant';

export default {

    namespace: 'product_category_sku_attribute',

    state: {
        product_category_id: '',
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