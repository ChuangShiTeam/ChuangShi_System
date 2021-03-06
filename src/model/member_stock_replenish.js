import constant from '../util/constant';

export default {

    namespace: 'member_stock_replenish',

    state: {
        app_id: '',
        app_list: [],
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        stock_replenish_type: 'MEMBER',
        user_name: '',
        warehouse_id: '',
        warehouse_list: [],
        product_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};