import { RotatingLines } from "react-loader-spinner";

function Loader() {
    return (
        <RotatingLines
            strokeColor="skyblue"
            strokeWidth="5"
            animationDuration="0.25"
            width="35"
            visible={true}
        />
    );
}
export default Loader;
