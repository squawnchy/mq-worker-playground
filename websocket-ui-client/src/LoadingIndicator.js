const LoadingIndicator = () => {
    const spinnerStyle = {
        border: "5px solid #f3f3f3", /* Light grey */
        borderTop: "5px solid #3498db", /* Blue */
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        animation: "spin 2s linear infinite"
    };

    return (
        <>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={spinnerStyle}></div>
        </>
    );
}

export default LoadingIndicator;