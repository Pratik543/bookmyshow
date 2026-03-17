import { useSelector } from "react-redux";
import styles from "../Styling/RecommendedMovies.module.css";
import { CommonCarousel } from "./CommonCarousel";

export const LatestEvents = () => {
    const latest_events = useSelector(state => state.app.latest_events);
    // console.log(latest_events);

    return (
        <div className={styles.parent}>
            <div className={styles.parent__text}>
                <h1>Latest Events</h1>
            </div>
            <CommonCarousel events={latest_events} />
        </div>
    )
}