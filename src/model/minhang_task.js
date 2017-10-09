import constant from '../util/constant';

export default {

    namespace: 'minhang_task',

    state: {
        app_id: '',
        app_list: [],
        key_id: '',
        key_list: [],
        task_name: '',
        task_type: '',
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