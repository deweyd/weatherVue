import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            searchQuery: '',
            searchQueryByName: '',
            searchQueryByAge: '',
        };
    },
    mutations: {
        updateSearchQuery(state, payload) {
            state.searchQuery = payload;
        },
        updateSearchQueryByName(state, payload) {
            state.searchQueryByName = payload;
        },
        updateSearchQueryByAge(state, payload) {
            state.searchQueryByAge = payload;
        },
    },
    actions: {
        setSearchQuery(context, payload) {
            context.commit('updateSearchQuery', payload);
        },
        setSearchQueryByName(context, payload) {
            context.commit('updateSearchQueryByName', payload);
        },
        setSearchQueryByAge(context, payload) {
            context.commit('updateSearchQueryByAge', payload);
        },
    },
    getters: {
        getSearchQuery(state) {
            return state.searchQuery;
        },
        getSearchQueryByName(state) {
            return state.searchQueryByName;
        },
        getSearchQueryByAge(state) {
            return state.searchQueryByAge;
        },
    },
});

export default store;