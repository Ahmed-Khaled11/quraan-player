import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function Loading() {
  return (
    <>
        <div>
              <h1>{<Skeleton />}</h1>
              <h3 style={{color:'black'}}>jdsaja</h3>
              {<Skeleton count={10} />}
        </div>
    )
    </>
  );
}
