import constant from '../util/constant';

export default {

    namespace: 'product',

    state: {
        app_id: '',
        app_list: [],
        product_name: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        member_level_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};