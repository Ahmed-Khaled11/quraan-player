import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function Loading() {
  return (
    <>
        <Skeleton height={125}></Skeleton>
        <Skeleton height={125}></Skeleton>
        <Skeleton height={125}></Skeleton>
      )
    </>
  );
}
