import constant from '../util/constant';

export default {

    namespace: 'minhang_video',

    state: {
        app_id: '',
        app_list: [],
        video_title: '',
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