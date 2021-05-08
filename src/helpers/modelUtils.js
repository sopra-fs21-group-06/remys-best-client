import { getCardNameFromCode, getCardValueFromCode } from './remysBestUtils'

export const createField = (id, left, top, color, size, borderWidth, isColorShown) => {
    let _id = id;
    let _left = left;
    let _top = top;
    let _color = color;
    let _size = size;
    let _borderWidth = borderWidth;
    let _key = String(_id) + (color ? color.name : '')
    let _isColorShown = isColorShown
    let _isPossibleTargetField = false
    let _isTargetField = false

    return ({
        getId: () => _id,
        getLeft: () => _left,
        getTop: () => _top,
        getColor: () => _color,
        getSize: () => _size,
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
        getColor: () => _color,
        getIsMovable: () => _isMovable,
        setIsMovable: (isMovable) => _isMovable = isMovable,
        getIsVisible: () => _isVisible,
        setIsVisible: (isVisible) => _isVisible = isVisible,
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
    });
};

export const createUser = (username, email, status, category) => {
    let _username = username;
    let _email = email;
    let _status = status;
    let _category = category;
    let _invite = null;
    let _accept = null;
    let _reject = null;
   
    return ({
        getUsername: () => _username,
        getEmail: () => _email,
        getStatus: () => _status,
        getCategory: () => _category,
        getInvite: () => _invite,
        setInvite: (invite) => _invite = invite,
        getAccept: () => _accept,
        setAccept: (accept) => _accept = accept,
        getReject: () => _reject,
        setReject: (reject) => _reject = reject,
    });
};