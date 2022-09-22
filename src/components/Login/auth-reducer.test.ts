import {authReducer, setIsLoggedIn} from './auth-reducer';

let startState = {
    isLoggedIn: false
}

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})

test('set isLoggedIn', () => {

    const endState = authReducer(startState, setIsLoggedIn(true))

    expect(startState.isLoggedIn).toBe(false)
    expect(endState.isLoggedIn).toBe(true)
})