<<<<<<< HEAD
import { getCardNameFromCode, getCardValueFromCode } from './remysBestUtils'

export const createField = (id, left, top, color, size, borderWidth, isColorShown) => {
=======
export const createField = (id, left, top, color, size, borderWidth) => {
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
    let _id = id;
    let _left = left;
    let _top = top;
    let _color = color;
    let _size = size;
    let _borderWidth = borderWidth;
<<<<<<< HEAD
    let _key = String(_id) + (color ? color.name : '')
    let _isColorShown = isColorShown
    let _isPossibleTargetField = false
    let _isTargetField = false
=======
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))

    return ({
        getId: () => _id,
        getLeft: () => _left,
        getTop: () => _top,
        getColor: () => _color,
        getSize: () => _size,
<<<<<<< HEAD
        getBorderWidth: () => _borderWidth,
        getKey: () => _key,
        getIsColorShown: () => _isColorShown,
        getIsPossibleTargetField: () => _isPossibleTargetField,
        setIsPossibleTargetField: (isPossibleTargetField) => _isPossibleTargetField = isPossibleTargetField,
        getIsTargetField: () => _isTargetField,
        setIsTargetField: (isTargetField) => _isTargetField = isTargetField,
    });
};

export const createMarble = (id, fieldKey, color, isMovable, isVisible) => {
    let _id = id;
    let _fieldKey = String(fieldKey);
    let _color = color;
    let _isMovable = isMovable;
    let _isVisible = isVisible;
    let _isSelected = false;

    return ({
        getId: () => _id,
        getFieldKey: () => _fieldKey,
        setFieldKey: (fieldKey) => _fieldKey = String(fieldKey),
=======
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
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
        getColor: () => _color,
        getIsMovable: () => _isMovable,
        setIsMovable: (isMovable) => _isMovable = isMovable,
        getIsVisible: () => _isVisible,
        setIsVisible: (isVisible) => _isVisible = isVisible,
<<<<<<< HEAD
        getIsSelected: () => _isSelected,
        setIsSelected: (isSelected) => _isSelected = isSelected,
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

export const createCard = (code, imgUrl) => {
    let _code = code;
    let _imgUrl = imgUrl;
    let _isRaised = false;
    let _style = {};
    let _name = getCardNameFromCode(code)
    let _value = getCardValueFromCode(code)

    return ({
        getCode: () => _code,
        getImgUrl: () => _imgUrl,
        getIsRaised: () => _isRaised,
        setIsRaised: (isRaised) => _isRaised = isRaised,
        getStyle: () => _style,
        setStyle: (style) => _style = style,
        getName: () => _name,
        getValue: () => _value,
    });
};

export const createPlayer = (playerName, handRef, handRot, colorName) => {
    let _playerName = playerName;
    let _handRef = handRef;
    let _handRot = handRot;
    let _colorName = colorName;
   
    return ({
        getPlayerName: () => _playerName,
        getHandRef: () => _handRef,
        getHandRot: () => _handRot,
        getColorName: () => _colorName
=======
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
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
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
<<<<<<< HEAD
=======
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
>>>>>>> 1d7b81c (websocket basic implementation, first test until game screen (#111))
};