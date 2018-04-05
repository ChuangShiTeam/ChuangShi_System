import constant from '../util/constant';

export default {

    namespace: 'jiangling_new_customer',

    state: {
        app_id: '',
        app_list: [],
        new_customer_name: '',
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