import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
 const Loading = () => {
  return (
    <>
        <Skeleton count={3} height={125}></Skeleton>
        <Skeleton count={3} height={125}></Skeleton>
        <Skeleton count={3} height={125}></Skeleton>
      )
    </>
  );
}
export default Loading