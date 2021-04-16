const InputField = (props) => {
    const {
        ...otherProps
    } = props;
    return <input {...otherProps} />
}

const ClearableInputField = (props) => {
    const {
        onClearValue,
        ...otherProps
    } = props;
    return (
        <span className="clearable">
            <InputField {...otherProps} />
            <i className="clearIcon" onClick={() => onClearValue()}>&times;</i>
        </span>
    )
}

const ValidatedInputWrapper = (props) => {
    const {
        label,
        children,
        error,
    } = props;
    return (
        <div className={"form-element " + (error && 'invalid')}>
            {label && <label>{label}</label>}
            {children}
            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export const ValidatedInput = (props) => {
    return (
        <ValidatedInputWrapper {...props}>
            <InputField {...props} />
        </ValidatedInputWrapper>
    );
}

export const ValidatedClearableInput = (props) => {
    return (
        <ValidatedInputWrapper {...props}>
            <ClearableInputField {...props} />
        </ValidatedInputWrapper>
    );
}

export const ServerError = (props) => {
    const {
        serverError
    } = props;
    return (
        <div>
            {serverError && <p className="server-error">{serverError}</p>}
        </div>
    );
}

export const SubmitButton = (props) => {
    const {
        isSubmitting,
        value,
        onClick,
    } = props;
    return (
        isSubmitting ? 
            <button className="btn-primary loading">
                <div className="loader-wrapper">
                    <div className="loader"></div>
                </div>
            </button>
            :   
            <button onClick={() => onClick()} className="btn-primary">{value}</button> 
    )
}