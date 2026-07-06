import { useState, useEffect } from "react";

export function useJokes() {
    const [facts, setFacts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    function loadJokes() {
        setLoading(true) /* this is a state change it will re render so when the data is loaded the loading woild turn to false and woudent be shown on screen */
        setTimeout(() => { /* this is a mock API for fun set time out is wraping the whole function and delayes all by the time written at the end of the function so it loads the data and then delays it by 2 seconds */
            fetch('https://official-joke-api.appspot.com/jokes/ten') /*to see how the api response looks like we either read the doc or view in the console */
                .then(res => res.json()) /* This means that the response is in json format */
                .then(data => {
                    setFacts(data)
                    console.log(data[0]) /* if we want to see how the data we recieved in the API looks like we just console it in the console */
                    setLoading(false)
                }).catch(() => { /* if there is an error */
                    setError(true)
                    setLoading(false)
                })
        }, 2000)
    }

    useEffect(() => {
        loadJokes()
    }, [])

    return { facts, loading, error, loadJokes }
}