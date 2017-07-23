import constant from '../util/constant';

export default {

    namespace: 'supplier_stock_out',

    state: {
        app_id: '',
        app_list: [],
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        express_no: '',
        stock_receiver_name: '',
        express_sender_name: '',
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};