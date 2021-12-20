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
	left: 15vw;
	right: 15vw;
	bottom: 10vh;
	background-color: ${TRACK_COLOR};
	border-radius: 10px;
	padding:20px 24px;
	color:white;
	.close-container{
		position:absolute;
		right:25px;
	}
	.modal-body-wrapper{
		margin-top:50px;
		overflow:auto;
		height: calc(80vh - 90px);
		.modal-body-container{
			display: flex;
			justify-content:space-between;
			.img-container{
				width:max-content;
				text-align:right;
				img{
				
					height:fit-content
				}
			}		
			.text-container{
				h1{
					margin:0 0 10px 0;
					font-family: "Staatliches", cursive;
				}
				margin-left:20px;
				padding-right:20px;
			}
		}
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
