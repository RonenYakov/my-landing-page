import { useState, useEffect } from "react";


export function BackToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        function onScroll() {
            setVisible(window.scrollY > 400) // this is a built in function that returns the y position of the scroll and we want to know when we hit 400 and thats how we determine set visable value

        }
        window.addEventListener('scroll', onScroll, { passive: true }) // we add an event listener to the window and that will listen for the scroll event and when it happens it will call the onScroll function
        return () => window.removeEventListener('scroll', onScroll) // we remove the event listener when the component unmounts to prevent memory leaks
    }, [])
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' }) // use build in function that scroll to the top of the page and we add behavior smooth so it will scroll smoothly
    }
    if (!visible) return null // if visible is false we dont render the component
    return (
        <button onClick={scrollToTop} // the vale inside the brackets determens what will happen when the button is clicked
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1px solid #e8e8e8',
                background: '#ffffff',
                cursor: 'pointer',
                fontSize: '1rem',
                zIndex: 50,
            }}
        >
            ↑
        </button>
    )

}