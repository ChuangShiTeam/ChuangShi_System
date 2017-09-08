import constant from '../util/constant';

export default {

    namespace: 'advertisement',

    state: {
        app_id: '',
        app_list: [],
        advertisement_category_code: '',
        advertisement_title: '',
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