import constant from '../util/constant';

export default {

    namespace: 'app_stock_out',

    state: {
        app_id: '',
        app_list: [],
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        stock_out_type: 'APP',
        warehouse_id: '',
        warehouse_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};