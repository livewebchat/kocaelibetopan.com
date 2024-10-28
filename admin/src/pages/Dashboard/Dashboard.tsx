import React from 'react';
import CardDataStats from '../../components/CardDataStats';

const Dashboard: React.FC = () => {
  return (
    <>
      <h1 className="text-2xl text-black font-bold dark:text-white mb-10">
        Hızlı Menü
      </h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <CardDataStats
          to="/slaytlar"
          title="Ana Sayfa Slaytları"
          total="Slaytlar"
          className="text-primary dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M192 48H64a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 144H64V64h128zm48-136v144a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0M32 56v144a8 8 0 0 1-16 0V56a8 8 0 0 1 16 0"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          to="/gecmis-projeler"
          title="Referanslar"
          total="Geçmiş Projeler"
          className="text-primary dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 3v18h-6v-3.5h-2V21H5V3zm-4 4h2V5h-2zm-4 0h2V5h-2zM7 7h2V5H7zm8 4h2V9h-2zm-4 0h2V9h-2zm-4 0h2V9H7zm8 4h2v-2h-2zm-4 0h2v-2h-2zm-4 0h2v-2H7zm8 4h2v-2h-2zm-8 0h2v-2H7zM21 1H3v22h18z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          to="/iletisim-bilgileri"
          title="Telefon, E-posta, WhatsApp"
          total="İletişim Bilgileri"
          className="text-primary dark:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 21q-.825 0-1.412-.587T0 19V5q0-.825.588-1.412T2 3h20q.825 0 1.413.588T24 5v14q0 .825-.587 1.413T22 21zm13.9-2H22V5H2v14h.1q1.05-1.875 2.9-2.937T9 15t4 1.063T15.9 19M9 14q1.25 0 2.125-.875T12 11t-.875-2.125T9 8t-2.125.875T6 11t.875 2.125T9 14m10 4l2-2l-1.5-2h-1.65q-.15-.45-.25-.962T17.5 12t.1-1.012t.25-.988h1.65L21 8l-2-2q-1.35 1.05-2.175 2.663T16 12t.825 3.338T19 18M4.55 19h8.9q-.85-.95-2.013-1.475T9 17t-2.425.525T4.55 19M9 12q-.425 0-.712-.288T8 11t.288-.712T9 10t.713.288T10 11t-.288.713T9 12m3 0"
            />
          </svg>
        </CardDataStats>
      </div>
    </>
  );
};

export default Dashboard;
