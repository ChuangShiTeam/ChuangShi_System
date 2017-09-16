import constant from '../util/constant';

export default {

    namespace: 'xietong_student',

    state: {
        app_id: '',
        app_list: [],
        student_name: '',
        clazz_id: '',
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