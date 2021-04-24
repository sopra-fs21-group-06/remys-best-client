export const createField = (id, left, top, color, size, borderWidth) => {
    let _id = id;
    let _left = left;
    let _top = top;
    let _color = color;
    let _size = size;
    let _borderWidth = borderWidth;

    return ({
        getId: () => _id,
        getLeft: () => _left,
        getTop: () => _top,
        getColor: () => _color,
        getSize: () => _size,
        getBorderWidth: () => _borderWidth
    });
};

export const createMarble = (id, fieldId, color, isMovable, isVisible) => {
    let _id = id;
    let _fieldId = fieldId;
    let _color = color;
    let _isMovable = isMovable;
    let _isVisible = isVisible;

    return ({
        getId: () => _id,
        getFieldId: () => _fieldId,
        setFieldId: (fieldId) => _fieldId = fieldId,
        getColor: () => _color,
        getIsMovable: () => _isMovable,
        setIsMovable: (isMovable) => _isMovable = isMovable,
        getIsVisible: () => _isVisible,
        setIsVisible: (isVisible) => _isVisible = isVisible,
    });
};

export const createPlayer = (username, handRef, handRot, color) => {
    // A variable defined in a factory or constructor function scope
    // is private to that function.
    let _username = username;
    let _handRef = handRef;
    let _handRot = handRot;
    let _color = color;
   
    return ({
        // Any other functions defined in the same scope are privileged:
        // These both have access to the private `count` variable
        // defined anywhere in their scope chain (containing function
        // scopes).
        getUsername: () => _username,
        getHandRef: () => _handRef,
        getHandRot: () => _handRot
    });
};

export const createCard = () => {
    // A variable defined in a factory or constructor function scope
    // is private to that function.
    let count = 0;

    return ({
        // Any other functions defined in the same scope are privileged:
        // These both have access to the private `count` variable
        // defined anywhere in their scope chain (containing function
        // scopes).
        click: () => count += 1,
        getCount: () => count.toLocaleString()
    });
};

export const createUser = () => {
    // A variable defined in a factory or constructor function scope
    // is private to that function.
    let count = 0;

    return ({
        // Any other functions defined in the same scope are privileged:
        // These both have access to the private `count` variable
        // defined anywhere in their scope chain (containing function
        // scopes).
        click: () => count += 1,
        getCount: () => count.toLocaleString()
    });
};

export const createChannel = (name, callback) => {
    let _name = name;
    let _callback = callback;
    let _unsubscribe;

    return ({
        getName: () => _name,
        getCallback: () => _callback,
        getUnsubscribe: () => _unsubscribe,
        setUnsubscribe: (unsubscribe) => _unsubscribe = unsubscribe,
    });
};