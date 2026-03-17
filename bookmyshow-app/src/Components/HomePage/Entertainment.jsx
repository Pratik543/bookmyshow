import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from "../Styling/RecommendedMovies.module.css";

const data = [
    "https://in.bmscdn.com/discovery-catalog/collections/workshops-collection-202007231330.png",
    "https://in.bmscdn.com/discovery-catalog/collections/fitness-collection-2020081150.png",
    "https://in.bmscdn.com/discovery-catalog/collections/kids-collection-202007220710.png",
    "https://in.bmscdn.com/discovery-catalog/collections/comedy-shows-collection-202007220710.png",
    "https://in.bmscdn.com/discovery-catalog/collections/music-shows-collection-202007220710.png",
    "https://in.bmscdn.com/discovery-catalog/collections/esports-collection-202011150107.png",
    "https://in.bmscdn.com/discovery-catalog/collections/self-improvement-collection-202007220710.png",
    "https://in.bmscdn.com/discovery-catalog/collections/food-n-drinks-collection-202010061250.png",
    "https://in.bmscdn.com/discovery-catalog/collections/interactive-games-collection-202012041129.png",
    "https://in.bmscdn.com/discovery-catalog/collections/art-and-crafts-collection-202007220710.png",
    "https://in.bmscdn.com/discovery-catalog/collections/theatre-shows-collection-202012041128.png",
    "https://in.bmscdn.com/discovery-catalog/collections/adventure-collection-202010140844.png"
]

export const Entertainment = () => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <div className={styles.parent} style={{ margin: 10 }}>
            <div className={styles.parent__text}>
                <h1>The Best of Entertainment</h1>
            </div>
            <div className={styles.entertainment_container}>
                <Carousel responsive={responsive} removeArrowOnDeviceType={["tablet", "mobile"]} >
                    {
                        data?.map((image, index) => (
                            <div key={index + 1}>
                                <img src={image} alt="Entertainment" />
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        </div>
    )
}