import constant from '../util/constant';

export default {

    namespace: 'xietong_teacher_recruitment',

    state: {
        app_id: '',
        app_list: [],
        teacher_recruitment_name: '',
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