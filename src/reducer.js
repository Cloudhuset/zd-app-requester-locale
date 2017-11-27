import { actions } from './actions'

const initialState = {
    isLoadingRequester: false,
    isLoadingLocales: false,
    isSettingLocale: false,
    locales: null,
    requester: null
}

const rootReducer = (state = initialState, action) => {

    if (action.type === actions.RESET_STORE) {
        state = undefined
    }

    return reducer(state, action)
}

const reducer = (state = initialState, action) => {

    if (action.type === actions.GET_REQUESTER) {
        return {
            ...state,
            isLoadingRequester: true,
        }
    }

    if (action.type === actions.GET_REQUESTER_SUCCESS) {
        return {
            ...state,
            requester: action.requester,
            isLoadingRequester: false,
        }
    }

    if (action.type === actions.GET_REQUESTER_FAILED) {
        return {
            ...state,
            isLoadingRequester: false,
        }
    }

    if(action.type === actions.GET_LOCALES) {
        return {
            ...state,
            isLoadingLocales: true
        }
    }

    if(action.type === actions.GET_LOCALES_SUCCESS) {
        return {
            ...state,
            locales: action.locales,
            isLoadingLocales: false
        }
    }

    if(action.type === actions.GET_LOCALES_FAILED) {
        return {
            ...state,
            isLoadingLocales: false
        }
    }

    if(action.type === actions.SET_REQUESTER_LOCALE) {
        return {
            ...state,
            isSettingLocale: true,
        }
    }

    if(action.type === actions.SET_REQUESTER_LOCALE_SUCCESS) {
        return {
            ...state,
            isSettingLocale: false,
        }
    }

    if(action.type === actions.SET_REQUESTER_LOCALE_FAILED) {
        return {
            ...state,
            isSettingLocale: false,
        }
    }

    return state

}

export default rootReducer
