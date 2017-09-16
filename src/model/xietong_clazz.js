import constant from '../util/constant';

export default {

    namespace: 'xietong_clazz',

    state: {
        app_id: '',
        app_list: [],
        clazz_name: '',
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