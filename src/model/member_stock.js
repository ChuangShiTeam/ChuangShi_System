import constant from '../util/constant';

export default {

    namespace: 'member_stock',

    state: {
        app_id: '',
        app_list: [],
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        stock_type: '会员',
        stock_action: '',
        product_name: '',
        member_name: '',
        member_list: [],
        product_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};