import { useEffect } from "react";
import { fetchDetails, fetchImage, fetchRecommendations } from "../api/api";
import {
	SelectedTitleState,
	movieIdState,
	movieRecState,
	GenreIdState,
	GenreTitleState,
} from "../states/recoil";
import { useRecoilState } from "recoil";
import {
	saveToLocalStorage,
	loadFromLocalStorage,
} from "../storage/movieStorage";
import {
	HandleItemClickSave,
	HandleItemClickGenre,
} from "../components/Utilities";
import { Link } from "react-router-dom";

function Details() {
	const [titleDetails, setTitleDetails] = useRecoilState(SelectedTitleState);
	const [movieId, setMovieId] = useRecoilState(movieIdState);
	const [recommendations, setRecommendations] = useRecoilState(movieRecState);
	const [genreId, setGenreId] = useRecoilState(GenreIdState);
	const [genreTitle, setGenreTitle] = useRecoilState(GenreTitleState);

	useEffect(() => {
		const storedMovieId = loadFromLocalStorage("movieId");
		const storedTitleDetails = loadFromLocalStorage("titleDetails");
		const storedRecommendations = loadFromLocalStorage("recommendations");

		if (storedMovieId !== null) {
			setMovieId(storedMovieId);
		}

		if (storedTitleDetails !== null) {
			setTitleDetails(storedTitleDetails);
		}

		if (storedRecommendations !== null) {
			setRecommendations(storedRecommendations);
		}

		if (movieId !== 0) {
			fetchDetails(movieId, (data) => {
				setTitleDetails(data);
				saveToLocalStorage("titleDetails", data);
				console.log(data);
			});

			fetchRecommendations(movieId, (data) => {
				console.log("Recommendations API Response:", data);
				if (Array.isArray(data)) {
					setRecommendations(data);
					saveToLocalStorage("recommendations", data);
				} else {
					setRecommendations([]);
				}
			});
		}
	}, [movieId, setTitleDetails, setRecommendations, setMovieId]);

	return (
		<div>
			<div>
				<img
					src={fetchImage(titleDetails.poster_path)}
					alt={titleDetails.title}
				></img>
				<h1 className='text-xl'>{titleDetails.title}</h1>
				<span>
					<p>Genres: </p>
					{titleDetails.genres &&
						titleDetails.genres.map((item) => (
							<Link to='../pages/discoverGenreView'>
								<div key={item.id}>
									<p onClick={() => HandleItemClickGenre({ item, setGenreId, setGenreTitle })}>
										{item.name}
									</p>
								</div>
							</Link>
						))}
				</span>
				<p>Release date: {titleDetails.release_date}</p>
				<p>{titleDetails.runtime} minutes.</p>
				<p>Number of votes: {titleDetails.vote_count}</p>
				<p>Average rating: {titleDetails.vote_average} out of 10</p>
				<p>{titleDetails.overview}</p>
			</div>
			<div>
				<ul>
					<h1>If you like this movie, you might like these: </h1>
					{recommendations.map((item) => (
						<li
							key={item.id}
							onClick={() => HandleItemClickSave({ item, setMovieId })}
						>
							<img
								src={fetchImage(item.poster_path)}
								alt={titleDetails.title}
							></img>
							<h1 className='text-xl'>{item.title}</h1>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Details;
