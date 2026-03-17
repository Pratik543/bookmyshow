import { useSelector } from "react-redux";
import styles from "../Styling/RecommendedMovies.module.css";
import { CommonCarousel } from "./CommonCarousel";

export const OutdoorEvents = () => {
    const outdoor_events = useSelector(state => state.app.outdoor_events);
    return (
        <div className={styles.parent}>
            <div className={styles.parent__text}>
                <h1>Outdoor Events</h1>
            </div>
            <CommonCarousel events={outdoor_events} />
        </div>
    )
}