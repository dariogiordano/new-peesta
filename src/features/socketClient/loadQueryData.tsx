import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { setOpponentId, setRoomName } from "./socketClientSlice";
interface Params {
	pRoomName: string;
	pOpponentId: string;
}
const LoadQueryData = () => {
	let params: Params = useParams() as Params;

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (params) {
			dispatch(setOpponentId(params.pOpponentId));
			dispatch(setRoomName(params.pRoomName));
		}
	}, [params, params.pRoomName, params.pOpponentId, dispatch]);

	return <div>loading data...</div>;
};
export default LoadQueryData;
