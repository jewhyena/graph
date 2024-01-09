import { FC } from "react";

interface Props {
  value: string;
}

const Tooltip: FC<Props> = ({ value }) => {
  return (
    <>
      <div
        style={{
          background:
            "linear-gradient(0deg, #39B04A 2%, #5ABA43 15.59%, #9DCE34 46.64%, #CEDD2A 71.87%, #ECE623 89.34%, #F7E921 100.98%)",
        }}
        className="pb-px pr-px rounded-lg"
      >
        <div
          className="py-2 px-3 rounded-lg bg-neutral-600 flex items-center gap-2"
          style={{
            border: `1px solid rgba(255, 255, 255, 0.20)`,
            backdropFilter: `blur(20px)`,
          }}
        >
          <p className="text-white">{value}</p>
          <div className="flex items-center gap-[2px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="6"
              viewBox="0 0 7 6"
              fill="none"
            >
              <path d="M3.5 0L6.9641 6H0.0358984L3.5 0Z" fill="#B8FE61" />
            </svg>
            <p className="text-[#B8FE61] text-sm">15%</p>
          </div>
        </div>
      </div>

      <GreenArrow />
    </>
  );
};

const GreenArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
    >
      <path
        d="M4.40192 4.5C4.01702 5.16667 3.05477 5.16667 2.66987 4.5L0.0717959 6.05683e-07L7 0L4.40192 4.5Z"
        fill="#39B04A"
      />
    </svg>
  );
};

export default Tooltip;
