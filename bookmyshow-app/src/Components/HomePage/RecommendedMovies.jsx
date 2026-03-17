import { RiArrowRightSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../Styling/RecommendedMovies.module.css";
import { MovieCarousel } from "./MovieCarousel";

const customImages = [
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-MTU4SysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00481091-wgnuvskhhu-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC42LzEwICA2LjZLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00455230-jvncmsgrnj-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-NTkwSysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00478890-gseacbrsej-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS4yLzEwICAzLjZLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00481905-pplzvanval-portrait.jpg",
    "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC,e-usm-2-2-0.5-0.008:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA2IEp1bg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00486049-lknceneldh-portrait.jpg"
];

export const RecommendedMovies = () => {
    const movies_data = useSelector(state => state.app.movies_data);


    const filteredRecommendedMovies = movies_data.filter(movie => (
        !movie.is_premier
    ));

    const moviesToDisplay = filteredRecommendedMovies.length > 0 ? filteredRecommendedMovies.map((movie, index) => {
        if (index < customImages.length) {
            return { ...movie, banner_image_url: customImages[index] };
        }
        return movie;
    }) : customImages.map((url, index) => ({
        _id: `custom_${index}`,
        banner_image_url: url,
        movie_name: "Recommended Movie",
        movie_genre: [{ genre: "Action" }]
    }));

    return (
        <div className={styles.parent}>
            <div className={styles.parent__text}>
                <h1>Recommended Movies</h1>
                <Link to="/ncr/movies" className={styles.link}>See all <RiArrowRightSLine /></Link>
            </div>
            <MovieCarousel movies={moviesToDisplay} />
        </div>
    )
}