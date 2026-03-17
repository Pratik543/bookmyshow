import { useSelector } from "react-redux";
import styles from "../Styling/RecommendedMovies.module.css";
import { CommonCarousel } from "./CommonCarousel";

export const LaughterEvents = () => {
    const laughter_events = useSelector(state => state.app.laughter_events);
    // console.log(laughter_events);

    return (
        <div className={styles.parent}>
            <div className={styles.parent__text}>
                <h1>Laughter Events</h1>
            </div>
            <CommonCarousel events={laughter_events} />
        </div>
    )
}