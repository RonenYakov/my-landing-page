import styles from './FunFacts.module.css'
import { useState } from 'react'
import { useJokes } from '../hooks/useJokes'
import { useTheme } from '../ThemeContext'

/* Card is a small component inside this file — it represents one joke card.
   It has its own useState so each card tracks whether its punchline is revealed independently */
function Card({ number, text, punchLine, flippable }: { number: string, text: string, punchLine: string, flippable?: boolean }) /* we use ? bollean because its optional and we want only one card to do that */ {
    /* revealed is false by default — clicking the card flips it to true */
    const [revealed, setRevealed] = useState(false)
    const [hovered, setHovered] = useState(false)

    return (
        /* onClick toggles revealed between true and false */
        <div className={styles.card} onClick={() => setRevealed(!revealed)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {flippable && hovered ? (<p className={styles.cardText}
                style={{ color: '#1a2e4a', fontStyle: 'italic' }}>
                this is the back
            </p>) : (
                <>
                    <p className={styles.cardNumber}>{number}</p>
                    <p className={styles.cardText}>{text}</p>
                    {revealed && <p className={styles.punchline}>{punchLine}</p>}
                </>
            )}
        </div>
    )
}

export function FunFacts() {
        /* useTheme pulls theme and setTheme from the global ThemeContext */
        const { theme, setTheme } = useTheme()
        /* useJokes is our custom hook — it handles fetch, loading, and error state */
        const { facts, loading, error, loadJokes } = useJokes()

        return (
            /* inline style reads from theme so the background reacts when the button is clicked */
            <div
                className={styles.funfactsContainer}
                style={{ background: theme === 'dark' ? '#111' : '#ffffff', color: theme === 'dark' ? '#f5f5f5' : '#111111' }}
            >
                <p className={styles.eyebrow}>(05) fun facts</p>
                <h2 className={styles.title}>A few things about me</h2>

                <div className={styles.controls}>
                    {/* loadJokes re-runs the fetch — defined inside useJokes */}
                    <button className={styles.btn} onClick={loadJokes}>Refresh jokes</button>
                    {/* ternary: if dark → switch to light, if light → switch to dark */}
                    <button className={styles.btn} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    </button>
                </div>

                {/* three-way conditional render: error → message, loading → spinner, done → cards */}
                {error ? (
                    <p>Something went wrong.</p>
                ) : loading ? (
                    <div className={styles.spinner} />
                ) : (
                    <div className={styles.row}>
                        {/* .map() turns the array of jokes into an array of Card components */}
                        {facts.slice(0, 3).map((joke, index) => (
                            <Card key={joke.id} number={joke.type} text={joke.setup} punchLine={joke.punchline} flippable={index === 1} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

// use state allows to store a value or data and if the value changes it will re-render the component we use it if something on screen need to change from a user action
// use effect is a function that runs after the component is rendered or if something inside it changes something need to happen none related to the user
