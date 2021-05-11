/**
 * The sessionStorage exists only within the current browser tab.
 * The data survives page refresh, but not closing/opening the tab.
 */

export default {
    getGameId: () => {
        return sessionStorage.getItem('gameId');
    },
    setGameId: (gameId) => {
        if (gameId === undefined) {
            sessionStorage.removeItem('gameId');
        }
        sessionStorage.setItem('gameId', gameId);
    },
    getGameSessionId: () => {
        return sessionStorage.getItem('gameSessionId');
    },
    setGameSessionId: (gameSessionId) => {
        if (gameSessionId === undefined) {
            sessionStorage.removeItem('gameSessionId');
        }
        sessionStorage.setItem('gameSessionId', gameSessionId);
    }
}