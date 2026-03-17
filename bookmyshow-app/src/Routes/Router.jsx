import { Route, Switch } from "react-router-dom";
import { BookingHistory } from "../Components/BookingHistory";
import { BookTicketsPage } from '../Pages/BookTicketsPage';
import { HomePage } from '../Pages/HomePage';
import MoviePage from "../Pages/moviePage/MoviePage";
import SeeAll from "../Pages/SeeAll";

const Router = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route exact path="/ncr/movies">
                    <SeeAll />
                </Route>
                <Route exact path="/booktickets/:id">
                    <BookTicketsPage />
                </Route>
                <Route exact path="/movies/:id">
                    <MoviePage></MoviePage>
                </Route>
                <Route exact path="/profile/booking-history">
                    <BookingHistory />
                </Route>
                <Route>
                    <div>404. Page not found</div>
                </Route>
            </Switch>
        </div>
    );
};

export default Router;
