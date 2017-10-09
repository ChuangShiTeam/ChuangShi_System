import constant from '../util/constant';

export default {

    namespace: 'minhang_question',

    state: {
        app_id: '',
        app_list: [],
        question_title: '',
        question_type: '',
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