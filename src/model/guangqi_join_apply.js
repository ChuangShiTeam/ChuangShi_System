import constant from '../util/constant';

export default {

    namespace: 'guangqi_join_apply',

    state: {
        app_id: '',
        app_list: [],
        join_apply_customer_name: '',
        join_apply_customer_phone: '',
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