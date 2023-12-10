import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const InputComponent = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');

    // Debounced Send Function
    const debouncedSend = React.useMemo(() => _.debounce(onSend, 300), [onSend]);

    // Update the debounced function when inputValue changes
    useEffect(() => {
        if (inputValue) {
            debouncedSend(inputValue);
        }

        // Cleanup function
        return () => {
            debouncedSend.cancel();
        };
    }, [inputValue, debouncedSend]);

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter a number"
            />
        </div>
    );
};

export default InputComponent;
