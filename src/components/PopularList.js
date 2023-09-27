import { useState, useEffect } from "react";
import { fetchImage, fetchPopular } from "../api/api";
import { useRecoilState } from "recoil";
import { movieIdState } from "../states/recoil";
import { Link } from "react-router-dom";
import { HandleItemClick, NextPageButton, PrevPageButton } from "./Utilities";

function PopularList() {
	const [list, setList] = useState([]);
	const [movieId, setMovieId] = useRecoilState(movieIdState);
	const [page, setPage] = useState(1);
	const imgWidth = "w154";

	useEffect(() => {
		fetchPopular(page, (data) => {
			const itemsWithPosters = data.results.map((item) => ({
				...item,
				poster_path: fetchImage(imgWidth, item.poster_path),
			}));
			setList(itemsWithPosters);
			setPage(data.page);
		});
		console.log(page);
	}, [page]);

	return (
		<>
			<Link to='./pages/detailsView'>
				<div className=''>
					<h1 className='text-4xl'>Popular movies</h1>
					<ul>
						{list.map((item) => (
							<li
								key={item.id}
								onClick={() => HandleItemClick({ item, setMovieId })}
							>
								<img src={item.poster_path} alt={item.title} />
								<h2>{item.title}</h2>
								Rating: {item.vote_average}
							</li>
						))}
					</ul>
				</div>
			</Link>
			<NextPageButton page={page} setPage={setPage} />
			<PrevPageButton page={page} setPage={setPage} />
		</>
	);
}

export default PopularList;
