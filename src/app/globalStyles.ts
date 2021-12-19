import { createGlobalStyle } from "styled-components";
import { TRACK_COLOR } from "../features/constants";

const GlobalStyle = createGlobalStyle`

body {
	margin: 0;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
		"Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
		sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}


.App {
	display: flex;
	height: 100vh;
	user-select: none;
}


 .modal {
		position: absolute;
		top: 10vh;
		left: 10vw;
		right: 10vw;
		bottom: 10vh;
		background-color: ${TRACK_COLOR};
		border-radius: 10px;
		padding:20px 24px;
		color:white;
		h1{
		margin:0 0 10px 0;
		font-family: "Staatliches", cursive;
		}
		.modal-body-container{
			display: flex;
			justify-content:left;
			img{height:fit-content}
			margin-top:50px;overflow:auto;
			height: calc(80vh - 90px);
		}
		.text-container{
			margin-left:20px;
			
			padding-right:20px;
		}
		.close-container{
			position:absolute;
		
			right:25px;
			
		}
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: RGBA(0,0,0,0.7);
	}

`;

export default GlobalStyle;
