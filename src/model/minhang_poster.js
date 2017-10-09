import constant from '../util/constant';

export default {

    namespace: 'minhang_poster',

    state: {
        app_id: '',
        app_list: [],
        task_list: [],
        poster_title: '',
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