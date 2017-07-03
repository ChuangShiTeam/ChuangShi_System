import constant from '../util/constant';

export default {

    namespace: 'product_category',

    state: {
        app_id: '',
        app_list: [],
        product_category_name: '',
        list: [],
        expandedRowKeys: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};