import { emptyAnim } from "@/assets/lottie/index";
import Lottie from "lottie-react";

function EmptyDatas() {
  return (
    <div className="flex justify-center">
      <Lottie
        loop={true}
        animationData={emptyAnim}
        className="w-[20vw] h-auto"
      />
    </div>
  );
}

export default EmptyDatas;
