import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// BrowserRouter never resets the scroll, so a new page would open as far down as the last one was.
// Back/Forward (POP) is left alone, so the browser can return the user to where they were.
function ScrollToTop() {
    const location = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType !== "POP") window.scrollTo(0, 0);
    }, [location.pathname, navigationType]);

    return null;
}

export default ScrollToTop;
