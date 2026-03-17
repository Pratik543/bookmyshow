import { useSelector } from "react-redux";
import styles from "../Styling/RecommendedMovies.module.css";
import { CommonCarousel } from "./CommonCarousel";

export const PopularEvents = () => {
    const popular_events = useSelector(state => state.app.popular_events);
    // console.log(popular_events);

    return (
        <div className={styles.parent}>
            <div className={styles.parent__text}>
                <h1>Popular Events</h1>
            </div>
            <CommonCarousel events={popular_events} />
        </div>
    )
}