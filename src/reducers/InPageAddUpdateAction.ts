
export enum InPageAddUpdateActionType {
    SET_ID = 'SET_ID',
    SET_DATA = 'SET_DATA',
    SHOW_LOADER = 'SHOW_LOADER',
    IS_REFRESH_REQUIRED = 'IS_REFRESH_REQUIRED',
    IS_UPDATING = 'IS_UPDATING',
}

export interface InPageAddUpdateState<T> {
    id: number,
    data?: T,
    refreshRequired: boolean,
    showLoader: boolean,
    isUpdating?: boolean,
}

type InPageAddUpdateAction<T> =
    {
        type: InPageAddUpdateActionType.SET_DATA
        payload: T
    }
    |
    {
        type: InPageAddUpdateActionType.SET_ID
        payload: number
    }
    |
    {
        type: InPageAddUpdateActionType.SHOW_LOADER | InPageAddUpdateActionType.IS_REFRESH_REQUIRED | InPageAddUpdateActionType.IS_UPDATING
        payload: boolean
    }

export const reducer = <T extends {}>(state: InPageAddUpdateState<T>, action: InPageAddUpdateAction<T>) => {
    const { type, payload } = action;
    switch (type) {
        case InPageAddUpdateActionType.SET_DATA:
            return { ...state, data: payload };
        case InPageAddUpdateActionType.SHOW_LOADER:
            return { ...state, showLoader: payload };
        case InPageAddUpdateActionType.IS_REFRESH_REQUIRED:
            return { ...state, refreshRequired: payload };
        case InPageAddUpdateActionType.SET_ID:
            return { ...state, id: payload };
        case InPageAddUpdateActionType.IS_UPDATING:
            return { ...state, isUpdating: payload };
        default:
            return state;
    }
};