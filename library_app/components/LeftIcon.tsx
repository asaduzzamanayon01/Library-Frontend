import React from "react";
import type { SVGProps } from "react";

const LeftIcon = (props: SVGProps<SVGSVGElement>) => {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 1536 1536"
                {...props}
            >
                <path
                    fill="#085ee7"
                    d="m909 1267l102-102q19-19 19-45t-19-45L704 768l307-307q19-19 19-45t-19-45L909 269q-19-19-45-19t-45 19L365 723q-19 19-19 45t19 45l454 454q19 19 45 19t45-19m627-499q0 209-103 385.5T1153.5 1433T768 1536t-385.5-103T103 1153.5T0 768t103-385.5T382.5 103T768 0t385.5 103T1433 382.5T1536 768"
                ></path>
            </svg>
        </div>
    );
};

export default LeftIcon;
