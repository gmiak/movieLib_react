import Express from "express";
import { Movie } from "../model/movie.interface";
import { makeMovieService, MovieService } from "../service/movie.service";
import { IMovieService } from "../service/imovie.service";
import { MovieDBService } from "../service/moviedb.service";

/** Router is an express server */
/** For Movie in general */
export function makeFavoriteMovieRouter (movieService: IMovieService ) {
    const favoriteMovieRouter : Express.Express = Express();

    // Get /movie/favorite router
    favoriteMovieRouter.get("/", async (req: Express.Request, res: Express.Response) => {
        try {
            const movies : Array<Movie> = await movieService.getFavoriteMovies(); // TODO: Should get movies from favorit list
            //res.status(200).send(JSON.stringify(movies)) // if i didn't specify in index.ts to get all in json
            res.status(200).send(movies); 
        } catch (e : any) {
            res.status(500).send(e.message);
        }
    });

    // POST or PUT /movie/favorite/id router
    favoriteMovieRouter.put("/:id", async (req: Express.Request, res: Express.Response) => {
        try {
            const id : number = parseInt(req.params.id, 10);
            const completed : boolean = await movieService.isFavorite(id);
            if (! completed) {
                res.status(400).send(`No movie with id ${id}\n`);
                return;
            }
            res.status(201).send("Movie is added as favorite\n");
        } catch (e : any) {
            res.status(500).send(e.message);
        }
    });

    // DELETE /movie/id router

    favoriteMovieRouter.delete("/:id", async (req: Express.Request, res: Express.Response) => {
        try {
            const id : number = parseInt(req.params.id, 10);
            const completed : boolean = await movieService.notFavorite(id);
            if (! completed) {
                res.status(400).send(`No movie with id ${id}\n`);
                return;
            }
            res.status(201).send("Movie is removed from favorite\n");
        } catch (e : any) {
            res.status(500).send(e.message);
        }
    });

    return favoriteMovieRouter;
}

export function makeDefaultFavoriteMovieRouter() : Express.Express {
    return makeFavoriteMovieRouter(new MovieDBService());
}

