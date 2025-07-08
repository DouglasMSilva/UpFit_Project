import { useState } from "react";

export const Count = () => {
    const [count, setCount] = useState(0);


    function handleClick() {
        setCount((count) => count + 1);
    }

    return (
        <>
            <button onClick={handleClick}>Clique aqui</button>
            {count && <p>{count}</p>}
        </>
    )
}