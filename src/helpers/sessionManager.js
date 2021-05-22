/**
 * The sessionStorage exists only within the current browser tab.
 * The data survives page refresh, but not closing/opening the tab.
 */

export default {
    getGameId: () => {
        return sessionStorage.getItem('gameId');
    },
    setGameId: (gameId) => {
        if (gameId === null) {
            sessionStorage.removeItem('gameId');
            return
        }
        sessionStorage.setItem('gameId', gameId);
    },
    getGameSessionId: () => {
        return sessionStorage.getItem('gameSessionId');
    },
    setGameSessionId: (gameSessionId) => {
        if (gameSessionId === null) {
            sessionStorage.removeItem('gameSessionId');
            return
        }
        sessionStorage.setItem('gameSessionId', gameSessionId);
    },
    getGameViewPage: () => {
        return sessionStorage.getItem('gameViewPage');
    },
    setGameViewPage: (gameViewPage) => {
        if (gameViewPage === null) {
            sessionStorage.removeItem('gameViewPage');
            return
        }
        sessionStorage.setItem('gameViewPage', gameViewPage);
    }
}