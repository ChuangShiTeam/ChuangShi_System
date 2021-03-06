import constant from '../util/constant';

export default {

    namespace: 'article',

    state: {
        app_id: '',
        app_list: [],
        article_name: '',
        total: 0,
        page_index: 1,
        page_size: constant.page_size,
        list: [],
        article_category_list: []
    },

    reducers: {
        fetch(state, action) {
            return {...state, ...action.data};
        }
    }

};