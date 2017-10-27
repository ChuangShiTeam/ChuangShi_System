import constant from '../util/constant';

export default {

    namespace: 'page',

    state: {
        app_id: '',
        app_list: [],
        page_name: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        website_menu_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};