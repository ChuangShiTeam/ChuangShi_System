import constant from '../util/constant';

export default {

    namespace: 'minhang_affiant',

    state: {
        app_id: '',
        app_list: [],
        affiant_name: '',
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