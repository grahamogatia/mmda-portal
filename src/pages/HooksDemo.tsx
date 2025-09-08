import {useEffect, useState} from "react";

function HooksDemo() {

    const [state, setState] = useState(["Graham", "Keshia", "Ace"]);

    const onClick = () => {
        setState(() => ["Test", "Test"])
    }

    useEffect(() => {
        console.log(state);
    }, [])

    return (
        <div className="p-4">
            <button onClick={onClick}>Add</button>
            <div>
                {state.map(item => {
                    return <p key={item}>
                        {item}
                    </p>
                })}
            </div>
        </div>
    )
}

export default HooksDemo;