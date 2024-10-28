import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface CardDataStatsProps {
  to: string;
  title: string;
  total: string;
  children: ReactNode;
  className: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  to,
  title,
  total,
  children,
  className,
}) => {
  return (
    <NavLink
      to={to}
      className="relative rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark hover:border-primary hover:-translate-y-1 transition-all group"
    >
      <div
        className={`flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 ${className}`}
      >
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </div>

      <span className="absolute top-1/2 right-5 -translate-x-2 -translate-y-1/2 opacity-0 flex justify-center items-center h-10 w-10 bg-primary dark:bg-white rounded-full text-white dark:text-primary transition-all group-hover:translate-x-0 group-hover:opacity-100">
        <svg
          className="relative translate-x-[1px]"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"
          />
        </svg>
      </span>
    </NavLink>
  );
};

export default CardDataStats;
