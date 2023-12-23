import { useRef } from 'react';

export function useRefValue<T>(value: T) {
    const refValue = useRef(value);
    refValue.current = value;
    return refValue;
}
