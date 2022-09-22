import {
    appReducer,
    RequestStatusType,
    setAppError,
    setAppIsInitialized,
    setAppStatus,
    setAppSuccess
} from './app-reducer';

let startState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    success: null as null | string,
    isInitialized: false
}

beforeEach(() => {
    startState = {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        success: null as null | string,
        isInitialized: false
    }
})

test('correct error should be set', () => {

    const endState = appReducer(startState, setAppError('error'))

    expect(startState.error).toBe(null)
    expect(endState.error).toBe('error')
})

test('correct success should be set', () => {

    const endState = appReducer(startState, setAppSuccess('perfect'))

    expect(startState.success).toBe(null)
    expect(endState.success).toBe('perfect')
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatus('loading'))

    expect(startState.status).toBe('idle')
    expect(endState.status).toBe('loading')
})

test('change isInitialized', () => {

    const endState = appReducer(startState, setAppIsInitialized(true))

    expect(startState.isInitialized).toBe(false)
    expect(endState.isInitialized).toBe(true)
})