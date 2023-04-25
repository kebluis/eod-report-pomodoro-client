import React, { useEffect, useRef } from "react";
import LottieView from "lottie-react-native";

const LoadingComponent = ({ isMain }) => {
  const loadingRef = useRef(null);

  useEffect(() => {
    return () => {
      loadingRef?.current?.reset();
    };
  }, []);

  return (
    <>
      {isMain ? (
        <LottieView
          autoPlay
          ref={loadingRef}
          source={require("../../assets/primary-loading.json")}
        />
      ) : (
        <LottieView
          autoPlay
          ref={loadingRef}
          source={require("../../assets/secondary-loading.json")}
        />
      )}
    </>
  );
};

export default LoadingComponent;
