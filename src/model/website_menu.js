import constant from '../util/constant';

export default {

    namespace: 'website_menu',

    state: {
        app_id: '',
        app_list: [],
        website_menu_name: '',
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