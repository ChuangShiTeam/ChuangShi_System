import constant from '../util/constant';

export default {

    namespace: 'category',

    state: {
        app_id: '',
        app_list: [],
        category_name: '',
        category_type: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};