import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

import classes from './MultiChoiceSelect.module.css';

type MultiChoiceSelectProps = JSX.IntrinsicElements['div'] & {
    text: string;
    inputStrings: { name: string; _id: number }[];
    setStateHandler: Dispatch<SetStateAction<InputStringType[]>>;
    selected: InputStringType[];
}

export type InputStringType = {
    name: string;
    _id: number
}

const MultiChoiceSelect: React.FC<MultiChoiceSelectProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const isInvalid = isTouched && props.selected.length === 0;

    const onContainerClick = (e: React.MouseEvent<HTMLElement>) => {
        const element = e.target as HTMLElement;
        if (element === containerRef.current || element === textRef.current) {
            setIsVisible(oldValue => !oldValue);
            setIsTouched(true);
        }
    };

    const outsideClickHandler = useCallback((e: Event) => {
        const element = e.target as HTMLElement;

        if (!containerRef.current?.contains(element)) {
            setIsVisible(false)
        }
    }, []);

    const onSelectHandler = (_id: number) => {
        const selectedString = props.inputStrings.find(x => x._id === _id) as InputStringType;
        const isPresent = props.selected.find(x => x._id === _id) as InputStringType;
        const isPresentIndex = props.selected.indexOf(isPresent);

        if (isPresentIndex !== -1) {
            props.setStateHandler(oldValue => {
                const newSelected = oldValue.slice();
                newSelected.splice(isPresentIndex, 1);
                return newSelected;
            });
        } else {
            props.setStateHandler(old => [selectedString, ...old]);
        }
    };

    useEffect(() => {
        document.addEventListener('click', outsideClickHandler, { capture: true });
        return () => document.removeEventListener('click', outsideClickHandler, { capture: true });
    }, [outsideClickHandler]);

    return (
        <div ref={containerRef} className={`${classes.select} ${isInvalid ? classes['select--invalid'] : ''}`} onClick={onContainerClick}>
            <div ref={textRef} className={classes.text}>{props.selected.map(x => x.name).join(', ') || props.text}</div>
            {isVisible && <ul className={classes.list}>{props.inputStrings.map(x => {
                return (
                    <li key={x._id} >
                        <input onChange={() => onSelectHandler(x._id)} id={x.name} type="checkbox" checked={Boolean(props.selected.find(y => y._id === x._id))} />
                        <label htmlFor={x.name}>{x.name}</label>
                    </li>
                )
            })}</ul>}
            {isInvalid && <p className={classes['input-notification']}>At least one city is required!</p>}
        </div>
    )
}

export default MultiChoiceSelect;