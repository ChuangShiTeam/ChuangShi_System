import constant from '../util/constant';

export default {

    namespace: 'member_stock_action',

    state: {
        app_id: '',
        app_list: [],
        member_stock_action_name: '',
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